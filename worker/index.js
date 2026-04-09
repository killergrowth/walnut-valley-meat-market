/**
 * Walnut Valley Meat Market — Order Form Handler (Cloudflare Worker)
 *
 * On POST:
 *  1. Sends branded HTML email with full order details + PDF attachment via Gmail API
 *  2. Returns { success: true, redirectUrl: "..." } for client-side redirect to payment
 *
 * Secrets (wrangler secret put):
 *   GOOGLE_CLIENT_EMAIL   — openclaw-agent@killergrowth.iam.gserviceaccount.com
 *   GOOGLE_PRIVATE_KEY    — PEM private key
 *   FROM_EMAIL            — notifications@killergrowth.com
 *   TO_EMAIL              — tyler@killergrowth.com (test; change for production)
 */

// ── Payment redirect map ────────────────────────────────────────────────────
const PAYMENT_URLS = {
  'beef-whole':   'http://pay.smrtpayments.com/wvp/beef-whole',
  'beef-half':    'http://pay.smrtpayments.com/wvp/beef-half',
  'beef-quarter': 'http://pay.smrtpayments.com/wvp/beef-quarter',
  'hog-whole':    'http://pay.smrtpayments.com/wvp/hog-whole',
  'hog-half':     'http://pay.smrtpayments.com/wvp/hog-half',
};

// ── Gmail JWT Auth ──────────────────────────────────────────────────────────
function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getGmailAccessToken(clientEmail, privateKeyPem, subject) {
  const now = Math.floor(Date.now() / 1000);
  const header  = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss:   clientEmail,
    sub:   subject,
    scope: 'https://www.googleapis.com/auth/gmail.send',
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
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

// ── Multipart MIME email with optional PDF attachment ───────────────────────
async function sendGmailWithAttachment(accessToken, from, to, subject, htmlBody, pdfBase64, pdfFilename) {
  const boundary = 'WVM_BOUNDARY_' + Math.random().toString(36).slice(2);

  const htmlPart = [
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(unescape(encodeURIComponent(htmlBody))),
  ].join('\r\n');

  const pdfPart = pdfBase64 ? [
    `--${boundary}`,
    `Content-Type: application/pdf; name="${pdfFilename || 'order.pdf'}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${pdfFilename || 'order.pdf'}"`,
    '',
    pdfBase64,
  ].join('\r\n') : '';

  const rawEmail = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    htmlPart,
    pdfPart,
    `--${boundary}--`,
  ].filter(Boolean).join('\r\n');

  const encoded = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encoded }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gmail send error: ${JSON.stringify(data)}`);
  return data;
}

// ── Email HTML template ──────────────────────────────────────────────────────
function buildEmailHtml(order) {
  const { animal, contact, quantity, selections, timestamp } = order;
  const isBeef = animal === 'beef';
  const ts = timestamp || new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short'
  });

  // Build selections rows
  function rows(obj) {
    return Object.entries(obj || {})
      .filter(([, v]) => v && v !== '' && v !== false)
      .map(([k, v]) => `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #f0ece8;font-size:13px;color:#78350f;font-weight:600;width:40%;vertical-align:top;">${k.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0ece8;font-size:13px;color:#1c1917;">${v === true ? '✓ Yes' : v}</td>
        </tr>`).join('');
  }

  const sectionHtml = (sel || []).map(s => `
    <tr><td colspan="2" style="background:#7f1d1d;padding:8px 12px;">
      <span style="color:#fff;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">${s.section}</span>
    </td></tr>
    ${rows(s.fields)}
  `).join('');

  const sel = selections || [];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Cutting Order — Walnut Valley Meat Market</title></head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;padding:32px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.12);">

        <!-- Header -->
        <tr><td style="background:#7f1d1d;padding:28px 32px;text-align:center;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.6);">WALNUT VALLEY MEAT MARKET</p>
          <p style="margin:8px 0 0;font-size:24px;font-weight:900;color:#fff;letter-spacing:0.02em;">NEW CUTTING ORDER</p>
          <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.7);">${ts} (Central Time)</p>
        </td></tr>

        <!-- Red accent bar -->
        <tr><td style="background:#dc2626;height:4px;font-size:0;">&nbsp;</td></tr>

        <!-- Customer info -->
        <tr><td style="padding:24px 32px 16px;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Customer Information</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Name</p>
                <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#1c1917;">${contact.name || '—'}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Phone</p>
                <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#dc2626;">
                  <a href="tel:${contact.phone || ''}" style="color:#dc2626;text-decoration:none;">${contact.phone || '—'}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-bottom:12px;vertical-align:top;">
                <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Email</p>
                <p style="margin:4px 0 0;font-size:14px;color:#1c1917;">
                  ${contact.email ? `<a href="mailto:${contact.email}" style="color:#dc2626;">${contact.email}</a>` : '—'}
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <p style="margin:0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:1px;">Pickup Location</p>
                <p style="margin:4px 0 0;font-size:14px;color:#1c1917;font-weight:600;">${contact.pickup || '—'}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Order summary bar -->
        <tr><td style="background:#fef3c7;border-top:1px solid #fde68a;border-bottom:1px solid #fde68a;padding:14px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:13px;color:#92400e;font-weight:700;">
                ${isBeef ? '🐄 BEEF ORDER' : '🐷 PORK ORDER'} &nbsp;·&nbsp; ${quantity ? quantity.toUpperCase() : ''}
              </td>
              <td align="right" style="font-size:13px;color:#92400e;font-weight:700;">
                Deposit: ${order.deposit || '—'}
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Selections -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;">Order Selections</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ece8;border-radius:6px;overflow:hidden;">
            ${sectionHtml || '<tr><td style="padding:12px;color:#aaa;font-size:13px;">No selections recorded.</td></tr>'}
          </table>
        </td></tr>

        <!-- CTA buttons -->
        <tr><td style="padding:24px 32px;text-align:center;">
          ${contact.phone ? `<a href="tel:${contact.phone}" style="display:inline-block;background:#dc2626;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:4px;text-decoration:none;margin-right:8px;">Call ${(contact.name || '').split(' ')[0] || 'Customer'}</a>` : ''}
          ${contact.email ? `<a href="mailto:${contact.email}" style="display:inline-block;background:#292524;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:4px;text-decoration:none;">Email Customer</a>` : ''}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#292524;padding:20px 32px;text-align:center;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#fff;">Walnut Valley Meat Market</p>
          <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.5);">El Dorado · Augusta · Andover, KS</p>
          <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.3);">Order submitted via walnut-valley-meat-market.pages.dev</p>
        </td></tr>
        <tr><td style="background:#dc2626;height:4px;font-size:0;">&nbsp;</td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Redirect key helper ──────────────────────────────────────────────────────
function getRedirectKey(animal, quantity) {
  const a = (animal || '').toLowerCase();
  const q = (quantity || '').toLowerCase();
  if (a === 'beef') {
    if (q.includes('whole')) return 'beef-whole';
    if (q.includes('quarter')) return 'beef-quarter';
    return 'beef-half';
  }
  if (a === 'pork' || a === 'hog') {
    if (q.includes('whole')) return 'hog-whole';
    return 'hog-half';
  }
  return null;
}

// ── Main Handler ─────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return json({ error: 'Invalid JSON payload' }, 400);
    }

    // Determine redirect URL
    const redirectKey = getRedirectKey(data.animal, data.quantity);
    const redirectUrl = PAYMENT_URLS[redirectKey] || null;

    // Build email
    const subject = `New ${(data.animal || 'Cutting').toUpperCase()} Order — ${data.contact?.name || 'Customer'} — ${data.quantity || ''}`;
    const htmlBody = buildEmailHtml(data);
    const from = `Walnut Valley Orders <${env.FROM_EMAIL || 'notifications@killergrowth.com'}>`;
    const to = env.TO_EMAIL || 'tyler@killergrowth.com';

    try {
      const accessToken = await getGmailAccessToken(
        env.GOOGLE_CLIENT_EMAIL,
        env.GOOGLE_PRIVATE_KEY,
        env.FROM_EMAIL || 'notifications@killergrowth.com'
      );

      await sendGmailWithAttachment(
        accessToken,
        from,
        to,
        subject,
        htmlBody,
        data.pdfBase64 || null,
        `order-${(data.animal || 'cutting')}-${Date.now()}.pdf`
      );

      return json({ success: true, redirectUrl });
    } catch (e) {
      console.error('Worker error:', e.message);
      return json({ error: e.message }, 500);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
