import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { getDateRange } from '../utils/date';
import HeatmapDate from './HeatmapDate';

const Heatmap = ({ refresh = false }) => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHeatmap = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { from, to } = getDateRange(8); // Last 8 weeks
      const response = await api.getHeatmap(from, to, refresh);
      if (response.success) {
        setHeatmapData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load heatmap');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeatmap();
  }, [fetchHeatmap]);

  const dates = useMemo(() => {
    if (!heatmapData) return [];
    
    // Flatten all weeks into a single array of dates
    const allDates = [];
    Object.values(heatmapData).forEach(weekData => {
      weekData.forEach(dayData => {
        allDates.push(dayData);
      });
    });
    
    // Sort by date (most recent first)
    return allDates.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [heatmapData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-8 h-8 border-2 border-retro-accent/10 border-t-retro-accent rounded-full animate-spin" />
        <span className="terminal-text text-[10px] animate-pulse uppercase tracking-widest">Loading_Heatmap...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-retro-hard/30 rounded-lg bg-retro-hard/5">
        <div className="text-retro-hard text-[10px] font-bold uppercase tracking-widest">Buffer_Error</div>
        <div className="text-retro-muted text-[10px] font-mono mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-4 mb-2 opacity-50">
        <div className="text-[8px] uppercase tracking-[0.2em] font-bold">TIMESTAMP</div>
        <div className="flex gap-2">
          {['E', 'M', 'H'].map(l => (
            <div key={l} className="w-8 text-center text-[8px] uppercase tracking-[0.2em] font-bold">{l}</div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {dates.map((dayData) => (
          <HeatmapDate
            key={dayData.date}
            date={dayData.date}
            easy={dayData.easy}
            medium={dayData.medium}
            hard={dayData.hard}
          />
        ))}
      </div>
    </div>
  );
};

export default Heatmap;

