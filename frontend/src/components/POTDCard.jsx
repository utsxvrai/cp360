import { memo } from 'react';

const POTDCard = memo(({ difficulty, contestId, index, rating, solved = false }) => {
  const getColorClass = () => {
    const diff = difficulty.toLowerCase();
    if (diff === 'easy') return 'text-retro-easy';
    if (diff === 'medium') return 'text-retro-medium';
    if (diff === 'hard') return 'text-retro-hard';
    return 'text-retro-text';
  };

  const handleClick = () => {
    const url = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className={`retro-card cursor-pointer hover:opacity-90 transition-opacity ${
        solved ? 'border-retro-accent border-4' : ''
      }`}
      onClick={handleClick}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`${getColorClass()} text-sm uppercase tracking-wider`}>
          {difficulty}
        </span>
        {solved && (
          <span className="text-xs text-retro-easy uppercase font-bold">✓ SOLVED</span>
        )}
      </div>
      <div className="text-2xl font-bold mb-2">
        {contestId}{index}
      </div>
      <div className="text-retro-muted text-sm uppercase">
        RATING: {rating}
      </div>
    </div>
  );
});

POTDCard.displayName = 'POTDCard';

export default POTDCard;
