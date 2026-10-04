import React, { useState } from 'react';
import TaskCard from './TaskCard';
import AddTask from './AddTask';

export default function Column({ status, title, tasks, onMoveStatus, onDeleteTask, onDropTask, onAddTask }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      const taskId = parseInt(taskIdStr, 10);
      onDropTask(taskId, status);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 min-h-[400px] transition-all rounded-md ${
        isDragOver ? 'outline-2 outline-dashed outline-ink' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`${title} column`}
    >
      <div className="flex items-center justify-between pb-1 border-b-4 border-double border-ink">
        <h2 className="text-xl font-hand-sc uppercase tracking-wider text-ink">{title}</h2>
        <span className="text-sm font-hand-sc uppercase tracking-wider text-doing">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-2.5">
        {tasks.length === 0 ? (
          <div className="text-xs font-hand text-mute py-4 px-2 italic">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMoveStatus={onMoveStatus}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
      {status === 'todo' && <AddTask onAddTask={onAddTask} />}
    </div>
  );
}
