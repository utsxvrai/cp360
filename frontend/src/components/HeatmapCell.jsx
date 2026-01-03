import { memo } from 'react';

const HeatmapCell = memo(({ solved, difficulty, date }) => {
  const getColorClass = () => {
    if (!solved) return 'bg-retro-bg';
    const diff = difficulty.toLowerCase();
    if (diff === 'easy') return 'bg-retro-easy';
    if (diff === 'medium') return 'bg-retro-medium';
    if (diff === 'hard') return 'bg-retro-hard';
    return 'bg-retro-bg';
  };

  return (
    <div
      className={`
        w-12 h-12 border-2 border-retro-border
        ${getColorClass()}
        hover:invert transition-none
        cursor-pointer
      `}
      title={`${date} - ${difficulty}: ${solved ? 'Solved' : 'Not solved'}`}
    />
  );
});

HeatmapCell.displayName = 'HeatmapCell';

export default HeatmapCell;

