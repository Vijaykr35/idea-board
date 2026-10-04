import React, { useState, useEffect } from 'react';

export default function BoardHeader({ board, onRenameBoard, onDeleteBoard }) {
  const [title, setTitle] = useState(board ? board.title : '');

  useEffect(() => {
    if (board) {
      setTitle(board.title);
    }
  }, [board]);

  if (!board) return null;

  const handleBlur = () => {
    if (title !== board.title && title.trim() !== '') {
      onRenameBoard(board.id, title);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <input
        type="text"
        className="text-2xl font-hand-sc uppercase tracking-wider text-ink bg-transparent border-b-2 border-transparent hover:border-rule focus:border-ink rounded-none px-1 py-0.5 w-full max-w-md focus-visible:outline-2 focus-visible:outline-ink transition-colors"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Rename board title"
        placeholder="Board Title"
      />
      <button
        className="px-3 py-1.5 text-xs font-hand-sc uppercase tracking-wider rounded-md border border-danger/40 text-danger hover:bg-danger hover:text-paper transition-colors focus-visible:outline-2 focus-visible:outline-ink"
        onClick={() => onDeleteBoard(board.id)}
        aria-label={`Delete board ${board.title}`}
      >
        Delete Board
      </button>
    </div>
  );
}
