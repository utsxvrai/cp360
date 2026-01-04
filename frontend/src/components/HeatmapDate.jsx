import { memo } from 'react';
import HeatmapCell from './HeatmapCell';

const HeatmapDate = memo(({ date, easy, medium, hard }) => {
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-4 items-center group">
      <div className="text-[10px] terminal-text opacity-40 group-hover:opacity-100 transition-opacity font-mono uppercase truncate">
        {formattedDate}
      </div>
      <div className="flex items-center gap-2">
        <HeatmapCell solved={easy} difficulty="easy" date={date} />
        <HeatmapCell solved={medium} difficulty="medium" date={date} />
        <HeatmapCell solved={hard} difficulty="hard" date={date} />
      </div>
    </div>
  );
});

HeatmapDate.displayName = 'HeatmapDate';

export default HeatmapDate;

