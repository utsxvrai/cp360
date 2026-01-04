import { memo } from 'react';

const HeatmapCell = memo(({ solved, difficulty, date }) => {
  const getStyles = () => {
    if (!solved) return 'bg-white/5 border-white/5';
    const diff = difficulty.toLowerCase();
    if (diff === 'easy') return 'bg-retro-easy/40 border-retro-easy/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
    if (diff === 'medium') return 'bg-retro-medium/40 border-retro-medium/30 shadow-[0_0_8px_rgba(139,92,246,0.2)]';
    if (diff === 'hard') return 'bg-retro-hard/40 border-retro-hard/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]';
    return 'bg-white/10 border-white/20';
  };

  return (
    <div
      className={`
        w-8 h-8 rounded-[4px] border transition-all duration-300
        ${getStyles()}
        hover:scale-110 hover:border-white/40 cursor-pointer
      `}
      title={`${date} [${difficulty.toUpperCase()}]: ${solved ? 'SOLVED' : 'PENDING'}`}
    />
  );
});

HeatmapCell.displayName = 'HeatmapCell';

export default HeatmapCell;

