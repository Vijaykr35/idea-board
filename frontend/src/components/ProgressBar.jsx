import React from 'react';

export default function ProgressBar({ total, done }) {
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-1 font-hand-sc uppercase tracking-wider text-xs" aria-label="Task completion progress">
      <div className="text-mute">
        {done} of {total} tasks done
      </div>
      <div className="w-full h-2 bg-paper border border-rule rounded-full overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div className="h-full bg-done transition-all duration-300 ease-out" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
