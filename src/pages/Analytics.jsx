import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, BarChart2, Zap, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Analytics() {
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingPerf, setLoadingPerf] = useState(false);

  const downloadCSV = async (type) => {
    const setLoading = type === 'events' ? setLoadingEvents : setLoadingPerf;
    setLoading(true);
    try {
      const response = await base44.functions.invoke('exportAnalyticsCSV', { type });
      const csv = response.data;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_${type}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Report downloaded!');
    } catch (err) {
      toast.error('Failed to download report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Analytics Export</h1>
        <p className="text-stone-500 mb-8">Download CSV reports for the last 30 days of data.</p>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="w-5 h-5 text-red-700" />
                Custom Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-500 text-sm mb-4">
                All tracked user interactions: button clicks, scroll depth, session durations, and navigation events.
              </p>
              <Button
                onClick={() => downloadCSV('events')}
                disabled={loadingEvents}
                className="bg-red-700 hover:bg-red-800"
              >
                {loadingEvents ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Download className="w-4 h-4 mr-2" /> Download Events CSV</>}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-red-700" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-500 text-sm mb-4">
                Page load times, INP responsiveness scores, and any errors detected by visitors.
              </p>
              <Button
                onClick={() => downloadCSV('performance')}
                disabled={loadingPerf}
                className="bg-red-700 hover:bg-red-800"
              >
                {loadingPerf ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Download className="w-4 h-4 mr-2" /> Download Performance CSV</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}