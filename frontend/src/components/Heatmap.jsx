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
      <div className="retro-card text-center py-8">
        <div className="animate-flicker uppercase">LOADING HEATMAP...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-card border-retro-hard text-retro-hard py-8 text-center">
        <div className="uppercase">ERROR: {error}</div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl uppercase tracking-widest mb-6 border-b-2 border-retro-border pb-2">
        ACTIVITY HEATMAP
      </h2>
      <div className="mb-4 text-retro-muted text-sm uppercase">
        DATE | [E] EASY | [M] MEDIUM | [H] HARD
      </div>
      <div>
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
    </section>
  );
};

export default Heatmap;

