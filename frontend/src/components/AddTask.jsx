import React, { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask(text.trim(), tag.trim());
    setText('');
    setTag('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 bg-surface text-ink border border-rule rounded-md px-3 py-1.5 text-xs font-hand focus-visible:outline-2 focus-visible:outline-ink"
          placeholder="Add a task"
          onClick={() => setIsOpen(true)}
          readOnly
          aria-label="Add a task"
        />
        <button
          className="bg-ink text-neutral-900 rounded-md px-4 py-1.5 text-xs font-hand-sc uppercase tracking-wider shadow-lg hover:brightness-110 active:translate-y-px transition-all focus-visible:outline-2 focus-visible:outline-ink"
          onClick={() => setIsOpen(true)}
          aria-label="Open add task form"
        >
          ADD
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 bg-surface p-3 rounded-md border border-rule">
      <input
        type="text"
        className="w-full bg-paper text-ink border border-rule rounded-md px-3 py-1.5 text-xs font-hand focus-visible:outline-2 focus-visible:outline-ink"
        placeholder="Task description..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        required
        aria-label="New task description"
      />
      <input
        type="text"
        className="w-full bg-paper text-ink border border-rule rounded-md px-3 py-1.5 text-xs font-hand focus-visible:outline-2 focus-visible:outline-ink"
        placeholder="Phase / Tag (optional)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        aria-label="New task phase or tag"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="px-3 py-1 rounded-md text-xs font-hand-sc uppercase tracking-wider border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-neutral-900 transition-colors focus-visible:outline-2 focus-visible:outline-ink"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1 bg-ink text-neutral-900 rounded-md text-xs font-hand-sc uppercase tracking-wider shadow-lg hover:brightness-110 active:translate-y-px transition-all focus-visible:outline-2 focus-visible:outline-ink"
        >
          ADD
        </button>
      </div>
    </form>
  );
}
