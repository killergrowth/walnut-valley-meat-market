/**
 * Walnut Valley Meat Market - Order Form Handler (Cloudflare Worker)
 *
 * Handles two form types:
 *   1. Cutting order (beef/pork) from homepage
 *      - Sends HTML email with PDF attachment
 *      - Returns JSON { success, redirectUrl } so JS can redirect to payment
 *   2. Contact/LTO form from limitedtimeoffer/index.html
 *      - Sends simple HTML email, no PDF, no redirect
 *
 * Environment secrets (set via wrangler secret put):
 *   GOOGLE_CLIENT_EMAIL  - openclaw-agent@killergrowth.iam.gserviceaccount.com
 *   GOOGLE_PRIVATE_KEY   - PEM private key
 *   FROM_EMAIL           - notifications@killergrowth.com
 *   TO_EMAIL             - tyler@killergrowth.com
 */

const PAYMENT_LINKS = {
  beef: {
    whole:   'http://pay.smrtpayments.com/wvp/beef-whole',
    half:    'http://pay.smrtpayments.com/wvp/beef-half',
    quarter: 'http://pay.smrtpayments.com/wvp/beef-quarter',
  },
  pork: {
    whole: 'http://pay.smrtpayments.com/wvp/hog-whole',
    half:  'http://pay.smrtpayments.com/wvp/hog-half',
  },
};

const DEPOSIT_LABELS = {
  beef: { whole: '$1,200', half: '$600', quarter: '$300' },
  pork: { whole: '$200',   half: '$100' },
};

const RED   = '#b91c1c';
const DARK  = '#1c1917';
const STONE = '#78716c';
const LIGHT = '#f5f5f4';

// ---- UTF-8 safe base64 ----

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

// ---- Gmail JWT Auth ----

function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getGmailAccessToken(clientEmail, privateKeyPem, subject) {
  const now = Math.floor(Date.now() / 1000);
  const header  = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail, sub: subject,
    scope: 'https://www.googleapis.com/auth/gmail.send',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  };

  const enc = new TextEncoder();
  const headerB64  = base64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const keyBuffer = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', keyBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, enc.encode(signingInput));
  const jwt = `${signingInput}.${base64url(signature)}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

async function sendGmail(accessToken, from, to, subject, htmlBody, pdfBase64, pdfFilename) {
  const boundary = 'WVBoundary' + Date.now();

  // UTF-8 safe base64 for HTML body
  const htmlEncoded = utf8ToBase64(htmlBody);

  // All headers must be ASCII
  const safeSubject = subject.replace(/[^\x20-\x7E]/g, '');

  let mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${safeSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    htmlEncoded,
  ].join('\r\n');

  if (pdfBase64 && pdfFilename) {
    mime += '\r\n' + [
      `--${boundary}`,
      `Content-Type: application/pdf; name="${pdfFilename}"`,
      `Content-Disposition: attachment; filename="${pdfFilename}"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      pdfBase64,
      ``,
      `--${boundary}--`,
    ].join('\r\n');
  } else {
    mime += `\r\n--${boundary}--`;
  }

  // MIME message: headers are ASCII, HTML body is base64 - all safe for btoa
  const encoded = btoa(mime).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encoded }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gmail send error: ${JSON.stringify(data)}`);
  return data;
}

// ---- Email Templates (ASCII-safe, special chars as HTML entities) ----

function buildOrderEmail(animal, quantity, contact, selections, deposit, redirectUrl) {
  const animalLabel = animal === 'beef' ? 'Beef Order' : 'Pork Order';
  const qLabel = { whole: 'Whole', half: 'Half', quarter: 'Quarter' }[quantity] || quantity;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short',
  });

  let sectionsHtml = '';
  (selections || []).forEach(s => {
    const rows = Object.entries(s.fields || {}).map(([k, v]) =>
      `<tr><td style="padding:5px 0;color:${STONE};font-size:13px;width:45%;">${k}</td>` +
      `<td style="padding:5px 0;font-size:13px;font-weight:600;color:${DARK};">${v === true ? 'Yes' : v}</td></tr>`
    ).join('');
    sectionsHtml +=
      `<tr><td colspan="2" style="padding:10px 0 4px;">` +
      `<div style="background:${RED};color:#fff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:6px 12px;border-radius:4px;">${s.section}</div>` +
      `</td></tr>${rows}`;
  });

  const payLink = '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Cutting Order - Walnut Valley</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <tr><td style="background:${RED};padding:24px 32px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:1px;">WALNUT VALLEY MEAT MARKET</p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">New Cutting Order Received</p>
  </td></tr>
  <tr><td style="background:#fef2f2;border-left:4px solid ${RED};padding:14px 32px;">
    <p style="margin:0;font-size:17px;font-weight:700;color:${DARK};">${animalLabel} &mdash; ${qLabel}</p>
    <p style="margin:4px 0 0;font-size:12px;color:${STONE};">${timestamp} (Central Time)</p>
  </td></tr>
  <tr><td style="padding:24px 32px 12px;">
    <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Customer</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding-bottom:12px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Name</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${DARK};">${contact.name || '&mdash;'}</p>
        </td>
        <td width="50%" style="padding-bottom:12px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Phone</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${RED};">
            <a href="tel:${contact.phone || ''}" style="color:${RED};text-decoration:none;">${contact.phone || '&mdash;'}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:10px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Email</p>
          <p style="margin:4px 0 0;font-size:14px;">${contact.email ? `<a href="mailto:${contact.email}" style="color:${RED};text-decoration:none;">${contact.email}</a>` : '&mdash;'}</p>
        </td>
        <td style="padding-bottom:10px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Pickup Location</p>
          <p style="margin:4px 0 0;font-size:13px;color:${DARK};">${contact.pickup || '&mdash;'}</p>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
  <tr><td style="padding:20px 32px 16px;">
    <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Order Selections</p>
    <table width="100%" cellpadding="0" cellspacing="0">${sectionsHtml}</table>
  </td></tr>
  <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
  <tr><td style="padding:16px 32px;background:#fef2f2;">
    <p style="margin:0;font-size:13px;color:${STONE};">Required Deposit</p>
    <p style="margin:4px 0 0;font-size:26px;font-weight:900;color:${RED};">${deposit || '&mdash;'}</p>
    <p style="margin:4px 0 0;font-size:11px;color:${STONE};">Customer is being redirected to payment now.</p>
  </td></tr>

  <tr><td style="background:${DARK};padding:18px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Walnut Valley Meat Market &middot; El Dorado, Augusta &amp; Andover, KS</p>
    <p style="margin:6px 0 0;font-size:11px;color:#666;">Managed by KillerGrowth</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildLtoEmail(data) {
  const { name, email, phone, message } = data;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short',
  });

  const msgBlock = message
    ? `<tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #eee;margin:0;"></td></tr>
       <tr><td style="padding:16px 32px 24px;">
         <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Message</p>
         <div style="background:${LIGHT};border-radius:6px;padding:16px;border-left:3px solid ${RED};">
           <p style="margin:0;font-size:14px;color:${DARK};line-height:1.7;">${message}</p>
         </div>
       </td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Message - Walnut Valley Ground Beef Offer</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <tr><td style="background:${RED};padding:24px 32px;text-align:center;">
    <p style="margin:0;color:#fff;font-size:20px;font-weight:900;">WALNUT VALLEY MEAT MARKET</p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:12px;">Ground Beef Offer &mdash; New Inquiry</p>
  </td></tr>
  <tr><td style="background:#fef2f2;border-left:4px solid ${RED};padding:14px 32px;">
    <p style="margin:0;font-size:16px;font-weight:700;color:${DARK};">New Message from Landing Page</p>
    <p style="margin:4px 0 0;font-size:12px;color:${STONE};">${timestamp} (Central Time)</p>
  </td></tr>
  <tr><td style="padding:24px 32px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding-bottom:14px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Name</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${DARK};">${name || '&mdash;'}</p>
        </td>
        <td width="50%" style="padding-bottom:14px;vertical-align:top;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Phone</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:${RED};">
            <a href="tel:${phone || ''}" style="color:${RED};text-decoration:none;">${phone || '&mdash;'}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-bottom:10px;">
          <p style="margin:0;font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Email</p>
          <p style="margin:4px 0 0;font-size:14px;">${email ? `<a href="mailto:${email}" style="color:${RED};text-decoration:none;">${email}</a>` : '&mdash;'}</p>
        </td>
      </tr>
    </table>
  </td></tr>
  ${msgBlock}
  <tr><td style="padding:8px 32px 24px;text-align:center;">
    ${phone ? `<a href="tel:${phone}" style="display:inline-block;background:${RED};color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none;margin-right:8px;">Call Now</a>` : ''}
    ${email ? `<a href="mailto:${email}" style="display:inline-block;background:${DARK};color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none;">Reply by Email</a>` : ''}
  </td></tr>
  <tr><td style="background:${DARK};padding:18px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#aaa;">Walnut Valley Meat Market &middot; El Dorado, Augusta &amp; Andover, KS</p>
    <p style="margin:6px 0 0;font-size:11px;color:#666;">Managed by KillerGrowth</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ---- CORS ----

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ---- Main Handler ----

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const to   = env.TO_EMAIL || 'tyler@killergrowth.com';
    const from = `Walnut Valley Orders <${env.FROM_EMAIL}>`;

    try {
      const accessToken = await getGmailAccessToken(
        env.GOOGLE_CLIENT_EMAIL,
        env.GOOGLE_PRIVATE_KEY,
        env.FROM_EMAIL
      );

      if (data.animal === 'beef' || data.animal === 'pork') {
        const { animal, quantity, contact, selections, deposit, pdfBase64 } = data;
        const redirectUrl  = PAYMENT_LINKS[animal]?.[quantity] || null;
        const depositLabel = DEPOSIT_LABELS[animal]?.[quantity] || deposit || '';
        const animalLabel  = animal === 'beef' ? 'Beef' : 'Pork';
        const qLabel = { whole: 'Whole', half: 'Half', quarter: 'Quarter' }[quantity] || quantity;
        const subject = `New ${animalLabel} Order - ${(contact?.name || 'Unknown').replace(/[^\x20-\x7E]/g, '')} (${qLabel})`;
        const html = buildOrderEmail(animal, quantity, contact, selections, depositLabel, redirectUrl);
        const pdfName = `WV-${animalLabel}-Order-${(contact?.name || 'Customer').replace(/\s+/g, '-').replace(/[^\x20-\x7E]/g, '')}.pdf`;

        await sendGmail(accessToken, from, to, subject, html, pdfBase64 || null, pdfBase64 ? pdfName : null);
        return json({ success: true, redirectUrl });
      }

      // LTO / contact form
      const subject = `New Contact Form Submission - ${(data.name || 'Website Visitor').replace(/[^\x20-\x7E]/g, '')}`;
      await sendGmail(accessToken, from, to, subject, buildLtoEmail(data), null, null);
      return json({ success: true });

    } catch (e) {
      console.error('Worker error:', e.message);
      return json({ error: e.message }, 500);
    }
  },
};