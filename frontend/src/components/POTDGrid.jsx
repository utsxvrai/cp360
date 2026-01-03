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
      <div className="retro-card text-center py-8">
        <div className="animate-flicker uppercase">LOADING POTD...</div>
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

  if (!potd) {
    return (
      <div className="retro-card text-center py-8">
        <div className="text-retro-muted uppercase">NO POTD AVAILABLE</div>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl uppercase tracking-widest mb-6 border-b-2 border-retro-border pb-2">
        TODAY'S PROBLEMS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

