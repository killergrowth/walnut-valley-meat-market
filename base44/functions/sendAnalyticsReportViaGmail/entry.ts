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

    // Get Gmail access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('gmail');

    // Fetch analytics data
    const customEvents = await base44.asServiceRole.entities.CustomEvent.list('-created_date', 200);
    const performanceMetrics = await base44.asServiceRole.entities.PerformanceMetric.list('-created_date', 200);

    const appId = '698b6dbe800d8d5b491da8d8';
    const validEvents = customEvents.filter(e => e.app_id === appId);
    const validMetrics = performanceMetrics.filter(m => m.app_id === appId);

    // Time periods
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Helper to analyze events by time period
    const analyzeByPeriod = (events, metrics, startDate) => {
      const filteredEvents = startDate ? events.filter(e => new Date(e.created_date) >= startDate) : events;
      const filteredMetrics = startDate ? metrics.filter(m => new Date(m.created_date) >= startDate) : metrics;

      const allEvents = {};
      const uniqueVisitors = new Set();
      const sessionDurations = [];
      const pageTraffic = {};
      const devices = {};
      const os = {};
      const referrers = {};
      
      filteredEvents.forEach(event => {
        allEvents[event.event_name] = (allEvents[event.event_name] || 0) + 1;
        
        if (event.user_agent) uniqueVisitors.add(event.user_agent);
        if (event.page) pageTraffic[event.page] = (pageTraffic[event.page] || 0) + 1;
        
        if (event.event_name === 'session_duration') {
          const duration = event.properties?.duration_ms;
          if (duration) sessionDurations.push(duration);
        }
        
        // Parse user agent for device/OS info
        const ua = event.user_agent || '';
        if (ua.includes('Mobile')) devices['Mobile'] = (devices['Mobile'] || 0) + 1;
        else if (ua.includes('Tablet')) devices['Tablet'] = (devices['Tablet'] || 0) + 1;
        else devices['Desktop'] = (devices['Desktop'] || 0) + 1;
        
        if (ua.includes('Windows')) os['Windows'] = (os['Windows'] || 0) + 1;
        else if (ua.includes('Mac')) os['Mac'] = (os['Mac'] || 0) + 1;
        else if (ua.includes('Android')) os['Android'] = (os['Android'] || 0) + 1;
        else if (ua.includes('iOS') || ua.includes('iPhone')) os['iOS'] = (os['iOS'] || 0) + 1;
        else if (ua) os['Other'] = (os['Other'] || 0) + 1;
      });

      filteredMetrics.forEach(metric => {
        if (metric.user_agent) uniqueVisitors.add(metric.user_agent);
        if (metric.page) pageTraffic[metric.page] = (pageTraffic[metric.page] || 0) + 1;
      });

      const pageLoads = filteredMetrics.filter(m => m.metric_type === 'page_load').map(m => m.value);
      const avgPageLoad = pageLoads.length > 0 ? (pageLoads.reduce((a, b) => a + b, 0) / pageLoads.length).toFixed(0) : 0;
      const avgSession = sessionDurations.length > 0 ? (sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length / 1000).toFixed(1) : 0;
      const totalVisits = pageLoads.length;

      return { 
        allEvents,
        totalVisits,
        uniqueVisitors: uniqueVisitors.size,
        avgSession,
        avgPageLoad,
        pageTraffic,
        devices,
        os,
        referrers,
        errorCount: filteredMetrics.filter(m => m.metric_type === 'error').length 
      };
    };

    const todayData = analyzeByPeriod(validEvents, validMetrics, today);
    const last7Data = analyzeByPeriod(validEvents, validMetrics, last7Days);
    const allTimeData = analyzeByPeriod(validEvents, validMetrics, null);

    // Helper to render events table
    const renderTable = (items) => {
      if (Object.keys(items).length === 0) return '<p style="color: #9ca3af; font-size: 12px;">No data</p>';
      return `<table style="border-collapse: collapse;">${
        Object.entries(items).sort((a, b) => b[1] - a[1]).map(([name, count]) => 
          `<tr><td style="padding: 3px 6px; font-size: 12px; border-bottom: 1px solid #f3f4f6;">${name.replace(/_/g, ' ')}</td><td style="padding: 3px 6px; padding-left: 12px; font-weight: bold; font-size: 12px; border-bottom: 1px solid #f3f4f6;">${count}</td></tr>`
        ).join('')
      }</table>`;
    };

    const renderSection = (title, data) => `
      <div class="section">
        <h2>${title}</h2>
        
        <div style="margin-bottom: 12px;">
          <span class="stat"><strong>${data.totalVisits}</strong> visits</span>
          <span class="stat"><strong>${data.uniqueVisitors}</strong> unique</span>
          <span class="stat"><strong>${data.avgSession}s</strong> avg duration</span>
          <span class="stat"><strong>${data.avgPageLoad}ms</strong> page load</span>
          <span class="stat"><strong>${data.errorCount}</strong> errors</span>
        </div>

        <div style="margin-bottom: 6px;"><strong style="font-size: 13px;">Custom Events:</strong></div>
        ${renderTable(data.allEvents)}

        <div style="margin-top: 12px; margin-bottom: 6px;"><strong style="font-size: 13px;">Page Traffic:</strong></div>
        ${renderTable(data.pageTraffic)}

        <div style="margin-top: 12px; margin-bottom: 6px;"><strong style="font-size: 13px;">Devices:</strong></div>
        ${renderTable(data.devices)}

        <div style="margin-top: 12px; margin-bottom: 6px;"><strong style="font-size: 13px;">Operating Systems:</strong></div>
        ${renderTable(data.os)}
      </div>
    `;

    // Generate HTML report
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 15px; background: #f9fafb; }
    .container { background: #fff; padding: 20px; border-radius: 8px; }
    h1 { color: #991b1b; border-bottom: 2px solid #991b1b; padding-bottom: 8px; font-size: 20px; margin-bottom: 5px; }
    h2 { color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 8px; border-left: 3px solid #991b1b; padding-left: 8px; }
    .section { margin-bottom: 25px; background: #fafafa; padding: 15px; border-radius: 6px; }
    .meta { color: #6b7280; font-size: 12px; margin-bottom: 15px; }
    .stat { display: inline-block; margin-right: 15px; font-size: 12px; }
    .stat strong { color: #991b1b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Analytics Report - Walnut Valley Meat Market</h1>
    <div class="meta">Generated: ${new Date().toLocaleDateString()} | App ID: ${appId}</div>

    ${renderSection('Today', todayData)}
    ${renderSection('Last 7 Days', last7Data)}
    ${renderSection('All Time', allTimeData)}

    <div style="text-align: center; color: #9ca3af; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 11px;">
      KillerGrowth App Monitor
    </div>
  </div>
</body>
</html>
    `;

    // Send emails via Gmail API
    const subject = `Analytics Report - Walnut Valley Meat Market - ${new Date().toLocaleDateString()}`;
    
    const emailPromises = recipients.map(async (to) => {
      const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlContent
      ].join('\r\n');

      const encodedMessage = btoa(unescape(encodeURIComponent(message)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      return fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedMessage })
      });
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.ok).length;

    return Response.json({ 
      success: true, 
      message: `Successfully sent ${successCount}/${recipients.length} emails`,
      recipients 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});