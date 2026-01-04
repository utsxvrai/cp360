import { memo } from 'react';

const POTDCard = memo(({ difficulty, contestId, index, rating, solved = false }) => {
  const getDifficultyStyles = () => {
    const diff = difficulty.toLowerCase();
    if (diff === 'easy') return {
      text: 'text-retro-easy',
      bg: 'bg-retro-easy/10',
      border: 'border-retro-easy/30',
      glow: 'shadow-glow-green/20'
    };
    if (diff === 'medium') return {
      text: 'text-retro-medium',
      bg: 'bg-retro-medium/10',
      border: 'border-retro-medium/30',
      glow: 'shadow-purple-500/20'
    };
    if (diff === 'hard') return {
      text: 'text-retro-hard',
      bg: 'bg-retro-hard/10',
      border: 'border-retro-hard/30',
      glow: 'shadow-red-500/20'
    };
    return {
      text: 'text-retro-text',
      bg: 'bg-white/5',
      border: 'border-white/10',
      glow: ''
    };
  };

  const styles = getDifficultyStyles();

  const handleClick = () => {
    const url = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className={`glass-panel p-5 cursor-pointer group relative overflow-hidden transition-all duration-500 hover:-translate-y-1 ${styles.border} ${solved ? 'ring-1 ring-retro-accent/50' : ''}`}
      onClick={handleClick}
    >
      {/* Target icon background */}
      <div className={`absolute -bottom-4 -right-4 w-20 h-20 ${styles.text} opacity-5 group-hover:opacity-10 transition-opacity`}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
        </svg>
      </div>

      <div className="mb-4 flex items-center justify-between relative z-10">
        <span className={`difficulty-tag ${styles.bg} ${styles.text}`}>
          {difficulty}
        </span>
        {solved ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-retro-easy/20 border border-retro-easy/30">
            <div className="w-1.5 h-1.5 rounded-full bg-retro-easy animate-pulse" />
            <span className="text-[10px] text-retro-easy font-bold tracking-tighter uppercase font-mono">Completed</span>
          </div>
        ) : (
          <span className="text-[10px] text-retro-muted font-mono opacity-50 uppercase tracking-tighter">Pending_Sync</span>
        )}
      </div>

      <div className="relative z-10 mb-4">
        <div className="text-3xl font-black terminal-text tracking-tighter group-hover:text-white transition-colors">
          {contestId} <span className="text-retro-accent opacity-50 group-hover:opacity-100">{index}</span>
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <span className="text-[8px] text-retro-muted uppercase tracking-[0.2em]">Efficiency_Rating</span>
          <span className="text-xs font-mono font-bold text-white/70">{rating}</span>
        </div>
        
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-retro-accent/10 transition-colors">
          <svg className="w-4 h-4 text-retro-muted group-hover:text-retro-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
});

POTDCard.displayName = 'POTDCard';

export default POTDCard;
