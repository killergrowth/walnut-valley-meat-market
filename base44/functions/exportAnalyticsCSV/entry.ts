import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const appId = '698b6dbe800d8d5b491da8d8';
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch data
    const [customEvents, performanceMetrics] = await Promise.all([
      base44.asServiceRole.entities.CustomEvent.list('-created_date', 500),
      base44.asServiceRole.entities.PerformanceMetric.list('-created_date', 500),
    ]);

    const { type } = await req.json().catch(() => ({ type: 'events' }));

    const validEvents = customEvents.filter(e =>
      e.app_id === appId &&
      new Date(e.created_date) >= thirtyDaysAgo
    );
    const validMetrics = performanceMetrics.filter(m =>
      m.app_id === appId &&
      new Date(m.created_date) >= thirtyDaysAgo
    );

    let csv = '';

    if (type === 'performance') {
      csv = 'Date,Metric Type,Page,Value (ms),Error Message,User Agent\n';
      csv += validMetrics.map(m => {
        const d = m.data || m;
        return [
          new Date(m.created_date).toLocaleString(),
          d.metric_type || '',
          d.page || '',
          d.value || '',
          (d.error_message || '').replace(/,/g, ';'),
          (d.user_agent || '').replace(/,/g, ';'),
        ].join(',');
      }).join('\n');
    } else {
      // Custom events (default)
      csv = 'Date,Event Name,Event Type,Page,Properties,User Agent\n';
      csv += validEvents.map(e => {
        const d = e.data || e;
        return [
          new Date(e.created_date).toLocaleString(),
          d.event_name || '',
          d.event_type || '',
          d.page || '',
          JSON.stringify(d.properties || {}).replace(/,/g, ';'),
          (d.user_agent || '').replace(/,/g, ';'),
        ].join(',');
      }).join('\n');
    }

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics_${type}_${new Date().toISOString().split('T')[0]}.csv"`,
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});