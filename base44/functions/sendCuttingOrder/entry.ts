import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@2.5.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { animalType, customerInfo, orderDetails } = await req.json();

    if (!animalType || !customerInfo || !orderDetails) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ── Generate PDF ──────────────────────────────────────────────
    const doc = new jsPDF();
    const animalLabel = animalType.charAt(0).toUpperCase() + animalType.slice(1);

    // Header
    doc.setFillColor(28, 25, 23);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(`Walnut Valley Meat Market`, 14, 13);
    doc.setFontSize(12);
    doc.text(`New ${animalLabel} Cutting Order`, 14, 23);

    // Customer Info
    let y = 40;
    doc.setFontSize(13);
    doc.setTextColor(127, 29, 29);
    doc.text('Customer Information', 14, y);
    doc.setDrawColor(127, 29, 29);
    doc.line(14, y + 2, 196, y + 2);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const customerName = customerInfo.fullName || `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim();
    doc.text(`Name: ${customerName}`, 14, y); y += 7;
    doc.text(`Email: ${customerInfo.email || ''}`, 14, y); y += 7;
    doc.text(`Phone: ${customerInfo.phone || ''}`, 14, y); y += 7;
    if (orderDetails['Pickup Location']) {
      doc.text(`Pickup Location: ${orderDetails['Pickup Location']}`, 14, y); y += 7;
    }
    y += 5;

    // Order Details
    doc.setFontSize(13);
    doc.setTextColor(127, 29, 29);
    doc.text('Order Details', 14, y);
    doc.line(14, y + 2, 196, y + 2);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const renderValue = (value) => {
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ');
      }
      return String(value);
    };

    for (const [key, value] of Object.entries(orderDetails)) {
      if (y > 270) { doc.addPage(); y = 20; }
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const valueStr = renderValue(value);
      const lines = doc.splitTextToSize(`${label}: ${valueStr}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 6 + 2;
    }

    // Footer note
    y += 6;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(254, 243, 199);
    doc.rect(14, y, 182, 16, 'F');
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14);
    doc.text('Reminder: Customer must pick up within 7 calendar days of notification.', 18, y + 6);
    doc.text('After 7 days, a $3/day storage fee applies.', 18, y + 12);

    // Convert PDF to base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];

    // ── Save order to database ────────────────────────────────────
    const savedOrder = await base44.asServiceRole.entities.Order.create({
      animal_type: animalType,
      quantity: orderDetails.quantity || orderDetails.Quantity || '',
      customer_name: customerName,
      customer_email: customerInfo.email || '',
      customer_phone: customerInfo.phone || '',
      order_details: orderDetails,
      email_sent: false,
      deposit_paid: true,
    });

    // ── Send Email via Gmail API with PDF attachment ──────────────
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("gmail");

    const subject = `New ${animalLabel} Cutting Order - ${customerName}`;
    const boundary = 'boundary_wvmm_' + Date.now();

    const orderRows = Object.entries(orderDetails).map(([key, value]) => {
      const displayValue = typeof value === 'object' && value !== null
        ? Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('<br>')
        : String(value);
      return `<tr>
        <td style="padding: 8px 12px; font-weight: bold; color: #44403c; background: #f5f5f4; border-bottom: 1px solid #e7e5e4; white-space: nowrap; vertical-align: top;">${key}</td>
        <td style="padding: 8px 12px; color: #1c1917; border-bottom: 1px solid #e7e5e4; vertical-align: top;">${displayValue}</td>
      </tr>`;
    }).join('');

    const htmlBody = `
      <html><body style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
        <div style="background: #1c1917; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">New ${animalLabel} Cutting Order</h1>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden;">
            <tr><th colspan="2" style="background: #7f1d1d; color: white; padding: 10px 12px; text-align: left; font-size: 14px; letter-spacing: 0.05em;">CUSTOMER INFORMATION</th></tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #44403c; background: #f5f5f4; border-bottom: 1px solid #e7e5e4; white-space: nowrap;">Name</td>
              <td style="padding: 8px 12px; color: #1c1917; border-bottom: 1px solid #e7e5e4;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #44403c; background: #f5f5f4; border-bottom: 1px solid #e7e5e4; white-space: nowrap;">Email</td>
              <td style="padding: 8px 12px; color: #1c1917; border-bottom: 1px solid #e7e5e4;">${customerInfo.email || ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #44403c; background: #f5f5f4;">Phone</td>
              <td style="padding: 8px 12px; color: #1c1917;">${customerInfo.phone || ''}</td>
            </tr>
          </table>

          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden;">
            <tr><th colspan="2" style="background: #7f1d1d; color: white; padding: 10px 12px; text-align: left; font-size: 14px; letter-spacing: 0.05em;">ORDER DETAILS</th></tr>
            ${orderRows}
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>Reminder:</strong> Customer must pick up within 7 calendar days. After 7 days, a $3/day storage fee applies.</p>
          </div>
          <p style="color: #78716c; font-size: 13px; margin-top: 16px;">The full order is also attached as a PDF.</p>
        </div>
        <div style="background: #f5f5f4; padding: 15px; text-align: center; color: #78716c; font-size: 12px;">
          <p>Walnut Valley Packing LLC | (316) 321-3595</p>
        </div>
      </body></html>`;

    const fileName = `${animalLabel}_Order_${customerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    const rawEmail = [
      `MIME-Version: 1.0`,
      `To: matt@walnutvalleymeatmarket.com`,
      `Subject: ${subject}`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      ``,
      htmlBody,
      ``,
      `--${boundary}`,
      `Content-Type: application/pdf; name="${fileName}"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="${fileName}"`,
      ``,
      pdfBase64,
      `--${boundary}--`,
    ].join('\r\n');

    const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedEmail }),
    });

    if (!response.ok) {
      const error = await response.text();
      // Mark email as failed in the database
      if (savedOrder?.id) {
        await base44.asServiceRole.entities.Order.update(savedOrder.id, { email_sent: false, email_error: error });
      }
      throw new Error(`Gmail API error: ${error}`);
    }

    // Mark email as successfully sent
    if (savedOrder?.id) {
      await base44.asServiceRole.entities.Order.update(savedOrder.id, { email_sent: true });
    }

    return Response.json({ success: true, message: 'Order submitted successfully!' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});