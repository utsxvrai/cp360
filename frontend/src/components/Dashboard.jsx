import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { calculateStreak } from '../utils/streak';
import { getDateRange, formatDate } from '../utils/date';
import Header from './Header';
import POTDGrid from './POTDGrid';
import Heatmap from './Heatmap';
import SyncButton from './SyncButton';

const Dashboard = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState({ current: 0, isActiveToday: false });
  const [loading, setLoading] = useState(true);
  const [heatmapKey, setHeatmapKey] = useState(0); // Force heatmap refresh

  const fetchStreak = useCallback(async () => {
    try {
      const { from, to } = getDateRange(60); // Last 60 days for streak calculation
      const response = await api.getProgressForRange(from, to);
      if (response.success) {
        const streakData = calculateStreak(response.data);
        setStreak(streakData);
      }
    } catch (err) {
      console.error('Failed to fetch streak:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchStreak();
      setLoading(false);
    };
    loadData();
  }, [fetchStreak]);

  const handleSync = useCallback(async () => {
    try {
      // Sync today's progress
      const today = formatDate(new Date());
      await api.syncProgress(today);
      
      // Refresh streak and heatmap
      await fetchStreak();
      setHeatmapKey(prev => prev + 1); // Force heatmap to refresh
    } catch (err) {
      console.error('Sync failed:', err);
      throw err;
    }
  }, [fetchStreak]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-flicker uppercase">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header streak={streak.current} isActiveToday={streak.isActiveToday} />
        <div className="mb-6 flex justify-end">
          <SyncButton onSync={handleSync} />
        </div>
        <POTDGrid />
        <Heatmap key={heatmapKey} />
      </div>
    </div>
  );
};

export default Dashboard;

