import { useState, useEffect } from 'react';
import api from '../services/api';
import POTDCard from './POTDCard';

const POTDGrid = () => {
  const [potd, setPotd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPOTD = async () => {
      try {
        setLoading(true);
        const response = await api.getTodayPOTD();
        if (response.success) {
          setPotd(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load POTD');
      } finally {
        setLoading(false);
      }
    };

    fetchPOTD();
  }, []);

  if (loading) {
    return (
      <div className="retro-box text-center py-8">
        <div className="animate-flicker uppercase">LOADING POTD...</div>
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

  if (!potd) {
    return (
      <div className="retro-box text-center py-8">
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
        />
        <POTDCard
          difficulty="Medium"
          contestId={potd.medium_contest_id}
          index={potd.medium_index}
          rating={potd.medium_rating}
        />
        <POTDCard
          difficulty="Hard"
          contestId={potd.hard_contest_id}
          index={potd.hard_index}
          rating={potd.hard_rating}
        />
      </div>
    </section>
  );
};

export default POTDGrid;

