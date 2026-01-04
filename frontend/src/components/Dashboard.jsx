import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { calculateStreak } from '../utils/streak';
import { getDateRange, formatDate } from '../utils/date';
import Header from './Header';
import POTDGrid from './POTDGrid';
import Heatmap from './Heatmap';
import SyncButton from './SyncButton';
import PastPOTDCard from './PastPOTDCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState({ current: 0, isActiveToday: false });
  const [pastPOTDs, setPastPOTDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heatmapKey, setHeatmapKey] = useState(0); // Force heatmap refresh
  const [potdKey, setPotdKey] = useState(0); // Force POTD refresh

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

  const fetchPastPOTDs = useCallback(async () => {
    try {
      const response = await api.getPastPOTDs(5); // Show last 5
      if (response.success) {
        // Filter out today's POTD if it exists in the list
        const today = formatDate(new Date());
        setPastPOTDs(response.data.filter(p => p.date !== today));
      }
    } catch (err) {
      console.error('Failed to fetch past POTDs:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStreak(), fetchPastPOTDs()]);
      setLoading(false);
    };
    loadData();
  }, [fetchStreak, fetchPastPOTDs]);

  const handleSync = useCallback(async () => {
    try {
      // Sync today's progress
      const today = formatDate(new Date());
      const syncResponse = await api.syncProgress(today);
      
      // Refresh all components that depend on progress
      await Promise.all([fetchStreak(), fetchPastPOTDs()]);
      setHeatmapKey(prev => prev + 1); // Force heatmap to refresh
      setPotdKey(prev => prev + 1); // Force POTD grid to refresh
    } catch (err) {
      console.error('Sync failed:', err);
      throw err;
    }
  }, [fetchStreak, fetchPastPOTDs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-retro-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-1 w-32 bg-retro-border rounded-full overflow-hidden">
            <div className="h-full bg-retro-accent animate-[scanline_2s_linear_infinite]" />
          </div>
          <div className="terminal-text text-sm animate-flicker">INIT_DASHBOARD_PROTOCOL...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4 md:p-8 relative">
      <div className="scanline" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <Header streak={streak.current} isActiveToday={streak.isActiveToday} />
        
        <div className="flex items-center justify-between border-b border-retro-border pb-4">
          <h2 className="terminal-text text-lg font-bold tracking-[0.3em] uppercase">
             Todays's TOTD
          </h2>
          <SyncButton onSync={handleSync} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            <POTDGrid refreshKey={potdKey} />
            
            {/* Past Challenges Section */}
            {pastPOTDs.length > 0 && (
              <section className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <h3 className="terminal-text text-sm font-bold uppercase tracking-widest opacity-50">
                    Past TOTD's
                  </h3>
                  <div className="h-px flex-1 bg-retro-border" />
                </div>
                <div className="flex flex-col gap-4">
                  {pastPOTDs.map(potd => (
                    <PastPOTDCard key={potd.date} {...potd} />
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="terminal-text text-xs font-bold uppercase tracking-widest opacity-50">
              Activity_Log
            </h3>
            <div className="glass-panel p-4">
              <Heatmap key={heatmapKey} refresh={heatmapKey > 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

