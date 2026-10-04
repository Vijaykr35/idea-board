import React from 'react';

export default function TaskCard({ task, onMoveStatus, onDeleteTask }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
  };

  const getPrevStatus = () => {
    if (task.status === 'doing') return 'todo';
    if (task.status === 'done') return 'doing';
    return null;
  };

  const getNextStatus = () => {
    if (task.status === 'todo') return 'doing';
    if (task.status === 'doing') return 'done';
    return null;
  };

  const prevStatus = getPrevStatus();
  const nextStatus = getNextStatus();

  return (
    <div
      className={`bg-surface border border-rule rounded-md px-3 py-2 shadow-md flex flex-col gap-1.5 cursor-grab active:cursor-grabbing hover:border-ink/40 transition-all ${
        task.status === 'done' ? 'line-through decoration-done opacity-70' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      aria-label={`Task: ${task.text}`}
    >
      <div className="flex items-start gap-2 justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Custom Task Bullet Circle (15px circle, 2px border) */}
          {task.status === 'todo' && (
            <span className="shrink-0 w-[15px] h-[15px] rounded-full border-2 border-todo mt-1" />
          )}
          {task.status === 'doing' && (
            <span className="shrink-0 w-[15px] h-[15px] rounded-full border-2 border-doing bg-gradient-to-r from-doing from-50% to-transparent to-50% mt-1" />
          )}
          {task.status === 'done' && (
            <span className="shrink-0 w-[15px] h-[15px] rounded-full border-2 border-done bg-done mt-1" />
          )}
          <span className="text-sm font-hand text-ink break-words leading-snug">
            {task.text}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {prevStatus && (
            <button
              className="w-5 h-5 flex items-center justify-center rounded-sm text-todo border border-todo/40 hover:border-todo text-xs transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              onClick={() => onMoveStatus(task.id, prevStatus)}
              aria-label={`Move task left to ${prevStatus}`}
              title={`Move to ${prevStatus}`}
            >
              ‹
            </button>
          )}
          {nextStatus && (
            <button
              className="w-5 h-5 flex items-center justify-center rounded-sm text-todo border border-todo/40 hover:border-todo text-xs transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              onClick={() => onMoveStatus(task.id, nextStatus)}
              aria-label={`Move task right to ${nextStatus}`}
              title={`Move to ${nextStatus}`}
            >
              ›
            </button>
          )}
          <button
            className="w-5 h-5 flex items-center justify-center rounded-sm text-danger border border-danger/40 hover:border-danger text-xs transition-colors focus-visible:outline-2 focus-visible:outline-ink"
            onClick={() => onDeleteTask(task.id)}
            aria-label={`Delete task ${task.text}`}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>

      {task.tag && (
        <span className="self-start font-hand-sc text-xs uppercase text-mute tracking-wider">
          {task.tag}
        </span>
      )}
    </div>
  );
}
