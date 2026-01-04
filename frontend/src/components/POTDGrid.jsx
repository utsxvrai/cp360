import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/date';
import POTDCard from './POTDCard';

const POTDGrid = ({ refreshKey = 0 }) => {
  const [potd, setPotd] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPOTDAndProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const today = formatDate(new Date());
      
      // Fetch POTD and progress in parallel
      const [potdResponse, progressResponse] = await Promise.all([
        api.getTodayPOTD(),
        api.getProgressForDate(today).catch(() => ({ success: false, data: null }))
      ]);
      
      if (potdResponse.success) {
        setPotd(potdResponse.data);
      }
      
      if (progressResponse.success && progressResponse.data) {
        setProgress(progressResponse.data);
      } else {
        // Default to unsolved if progress fetch fails
        setProgress({ date: today, easy: false, medium: false, hard: false });
      }
    } catch (err) {
      setError(err.message || 'Failed to load POTD');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPOTDAndProgress();
  }, [fetchPOTDAndProgress, refreshKey]);

  if (loading) {
    return (
      <div className="glass-panel p-12 flex flex-col items-center justify-center gap-4 bg-retro-bg/40">
        <div className="w-12 h-12 border-2 border-retro-accent/20 border-t-retro-accent rounded-full animate-spin" />
        <div className="terminal-text text-xs animate-pulse uppercase tracking-[0.2em]">Retrieving_POTD_Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 border-retro-hard/30 bg-retro-hard/5">
        <div className="flex items-center gap-3 text-retro-hard mb-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-bold uppercase tracking-widest text-sm">System_Error</span>
        </div>
        <div className="text-retro-muted text-xs font-mono">{error}</div>
      </div>
    );
  }

  if (!potd) {
    return (
      <div className="glass-panel p-12 text-center bg-retro-bg/40">
        <div className="text-retro-muted uppercase tracking-[0.3em] text-xs font-mono opacity-50">Empty_Buffer: No_Tasks_Available</div>
      </div>
    );
  }

  return (
    <section className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <POTDCard
          difficulty="Easy"
          contestId={potd.easy_contest_id}
          index={potd.easy_index}
          rating={potd.easy_rating}
          solved={progress?.easy || false}
        />
        <POTDCard
          difficulty="Medium"
          contestId={potd.medium_contest_id}
          index={potd.medium_index}
          rating={potd.medium_rating}
          solved={progress?.medium || false}
        />
        <POTDCard
          difficulty="Hard"
          contestId={potd.hard_contest_id}
          index={potd.hard_index}
          rating={potd.hard_rating}
          solved={progress?.hard || false}
        />
      </div>
    </section>
  );
};

export default POTDGrid;

