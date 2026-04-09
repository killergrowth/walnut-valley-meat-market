import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { recipients } = await req.json();
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return Response.json({ error: 'Recipients array required' }, { status: 400 });
    }

    // Fetch all custom events and performance metrics for the report
    const customEvents = await base44.asServiceRole.entities.CustomEvent.list('-created_date', 200);
    const performanceMetrics = await base44.asServiceRole.entities.PerformanceMetric.list('-created_date', 200);

    // Filter for the correct app_id
    const appId = '698b6dbe800d8d5b491da8d8';
    const validEvents = customEvents.filter(e => e.app_id === appId);
    const validMetrics = performanceMetrics.filter(m => m.app_id === appId);

    // Analyze click events
    const clickEvents = {};
    const scrollDepth = { 25: 0, 50: 0, 75: 0, 100: 0 };
    const sessionDurations = [];
    
    validEvents.forEach(event => {
      if (event.event_type === 'button_click') {
        clickEvents[event.event_name] = (clickEvents[event.event_name] || 0) + 1;
      } else if (event.event_name === 'scroll_depth') {
        const depth = event.properties?.depth;
        if (depth) scrollDepth[depth]++;
      } else if (event.event_name === 'session_duration') {
        const duration = event.properties?.duration_ms;
        if (duration) sessionDurations.push(duration);
      }
    });

    // Analyze performance metrics
    const pageLoads = validMetrics.filter(m => m.metric_type === 'page_load').map(m => m.value);
    const inpMetrics = validMetrics.filter(m => m.metric_type === 'inp').map(m => m.value);
    const errors = validMetrics.filter(m => m.metric_type === 'error');

    const avgPageLoad = pageLoads.length > 0 ? (pageLoads.reduce((a, b) => a + b, 0) / pageLoads.length).toFixed(0) : 0;
    const avgInp = inpMetrics.length > 0 ? (inpMetrics.reduce((a, b) => a + b, 0) / inpMetrics.length).toFixed(0) : 0;
    const avgSession = sessionDurations.length > 0 ? (sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length / 1000).toFixed(1) : 0;

    // Generate HTML report
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #991b1b; border-bottom: 3px solid #991b1b; padding-bottom: 15px; }
    h2 { color: #1f2937; margin-top: 30px; border-left: 4px solid #991b1b; padding-left: 15px; }
    .metric-box { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #991b1b; }
    .metric-label { font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
    .metric-value { font-size: 32px; font-weight: bold; color: #991b1b; margin: 5px 0; }
    .click-item { display: flex; justify-content: space-between; padding: 10px; background: #f9fafb; margin: 5px 0; border-radius: 6px; }
    .recommendation { background: #ecfdf5; border-left: 4px solid #059669; padding: 15px; margin: 10px 0; border-radius: 6px; }
    .footer { text-align: center; color: #6b7280; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Analytics Report - Walnut Valley Meat Market</h1>
    <p style="color: #6b7280; font-size: 14px;">Generated: ${new Date().toLocaleDateString()} | App ID: ${appId}</p>

    <h2>📈 Executive Summary</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="metric-box">
        <div class="metric-label">Total Events Tracked</div>
        <div class="metric-value">${validEvents.length}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Total Click Events</div>
        <div class="metric-value">${Object.values(clickEvents).reduce((a, b) => a + b, 0)}</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Avg Session Duration</div>
        <div class="metric-value">${avgSession}s</div>
      </div>
      <div class="metric-box">
        <div class="metric-label">Avg Page Load</div>
        <div class="metric-value">${avgPageLoad}ms</div>
      </div>
    </div>

    <h2>🖱️ Button Click Analysis</h2>
    ${Object.entries(clickEvents).sort((a, b) => b[1] - a[1]).map(([name, count]) => `
      <div class="click-item">
        <span><strong>${name.replace(/_/g, ' ').toUpperCase()}</strong></span>
        <span style="font-weight: bold; color: #991b1b;">${count} clicks</span>
      </div>
    `).join('')}

    <h2>📍 Location Popularity</h2>
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
      <p><strong>El Dorado:</strong> ${(clickEvents.el_dorado_directions_click || 0) + (clickEvents.el_dorado_map_directions_click || 0)} direction clicks</p>
      <p><strong>Andover:</strong> ${(clickEvents.andover_directions_click || 0) + (clickEvents.andover_map_directions_click || 0)} direction clicks</p>
      <p><strong>Augusta:</strong> ${(clickEvents.augusta_directions_click || 0) + (clickEvents.augusta_map_directions_click || 0)} direction clicks</p>
    </div>

    <h2>📱 User Engagement</h2>
    <div class="metric-box">
      <p><strong>Scroll Depth Milestones:</strong></p>
      <p>25%: ${scrollDepth[25]} users | 50%: ${scrollDepth[50]} users | 75%: ${scrollDepth[75]} users | 100%: ${scrollDepth[100]} users</p>
    </div>

    <h2>⚡ Performance Metrics</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="metric-box">
        <div class="metric-label">Average Page Load</div>
        <div class="metric-value">${avgPageLoad}ms</div>
        <p style="font-size: 12px; color: #6b7280; margin: 5px 0 0 0;">Target: &lt;3000ms</p>
      </div>
      <div class="metric-box">
        <div class="metric-label">Average INP</div>
        <div class="metric-value">${avgInp}ms</div>
        <p style="font-size: 12px; color: #6b7280; margin: 5px 0 0 0;">Target: &lt;200ms</p>
      </div>
    </div>
    <p>Errors Detected: <strong style="color: ${errors.length > 0 ? '#dc2626' : '#059669'}">${errors.length}</strong></p>

    <h2>💡 Recommendations</h2>
    <div class="recommendation">
      <strong>✅ Strong Performance:</strong> ${avgInp < 100 ? 'Excellent INP scores show fast, responsive interactions.' : 'INP scores are acceptable but could be optimized.'}
    </div>
    <div class="recommendation">
      <strong>📞 Call-to-Action:</strong> ${clickEvents.hero_visit_location_click > 0 ? `Hero CTA is performing well with ${clickEvents.hero_visit_location_click} clicks.` : 'Consider A/B testing the hero CTA button text.'}
    </div>
    <div class="recommendation">
      <strong>🗺️ Location Interest:</strong> Track which locations get the most engagement and consider highlighting the most popular one.
    </div>

    <div class="footer">
      <p>KillerGrowth App Monitor | Report generated automatically</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to each recipient
    const emailPromises = recipients.map(email => 
      base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'KillerGrowth App Monitor',
        to: email,
        subject: `📊 Analytics Report - Walnut Valley Meat Market - ${new Date().toLocaleDateString()}`,
        body: reportHtml
      })
    );

    await Promise.all(emailPromises);

    return Response.json({ 
      success: true, 
      message: `Report sent to ${recipients.length} recipient(s)`,
      recipients 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});