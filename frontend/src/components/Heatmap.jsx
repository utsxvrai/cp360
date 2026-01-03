import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { getDateRange, groupDatesByWeek, getDaysInRange } from '../utils/date';
import HeatmapWeek from './HeatmapWeek';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHeatmap = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { from, to } = getDateRange(8); // Last 8 weeks
      const response = await api.getHeatmap(from, to);
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

  const weeks = useMemo(() => {
    if (!heatmapData) return [];
    
    return Object.entries(heatmapData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekKey, weekData], index) => ({
        weekKey,
        weekData,
        weekNumber: index + 1,
      }));
  }, [heatmapData]);

  if (loading) {
    return (
      <div className="retro-box text-center py-8">
        <div className="animate-flicker uppercase">LOADING HEATMAP...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-box border-retro-hard text-retro-hard py-8 text-center">
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
        LEGEND: [E] EASY | [M] MEDIUM | [H] HARD
      </div>
      <div>
        {weeks.map(({ weekKey, weekData, weekNumber }) => (
          <HeatmapWeek
            key={weekKey}
            weekData={weekData}
            weekNumber={weekNumber}
          />
        ))}
      </div>
    </section>
  );
};

export default Heatmap;

