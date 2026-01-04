import { memo } from 'react';

const PastPOTDCard = memo(({ date, easy_contest_id, easy_index, medium_contest_id, medium_index, hard_contest_id, hard_index }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getProblemUrl = (contestId, index) => `https://codeforces.com/problemset/problem/${contestId}/${index}`;

  const problems = [
    { id: 'E', contestId: easy_contest_id, index: easy_index, color: 'text-retro-easy border-retro-easy/30 bg-retro-easy/5' },
    { id: 'M', contestId: medium_contest_id, index: medium_index, color: 'text-retro-medium border-retro-medium/30 bg-retro-medium/5' },
    { id: 'H', contestId: hard_contest_id, index: hard_index, color: 'text-retro-hard border-retro-hard/30 bg-retro-hard/5' }
  ];

  return (
    <div className="glass-panel p-4 flex items-center justify-between group hover:border-retro-accent/30 transition-all duration-300">
      <div className="flex flex-col">
        <span className="text-[10px] text-retro-muted uppercase font-mono tracking-widest opacity-50">Archive_Date</span>
        <span className="text-xs font-bold font-mono terminal-text">{formatDate(date)}</span>
      </div>

      <div className="flex gap-2">
        {problems.map((p) => (
          <a
            key={p.id}
            href={getProblemUrl(p.contestId, p.index)}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-black font-mono transition-all duration-300 hover:scale-110 hover:shadow-lg ${p.color}`}
            title={`${p.id}: ${p.contestId}${p.index}`}
          >
            {p.id}
          </a>
        ))}
      </div>
    </div>
  );
});

PastPOTDCard.displayName = 'PastPOTDCard';

export default PastPOTDCard;
