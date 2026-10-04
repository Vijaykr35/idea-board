import React from 'react';

export default function BoardTabs({ boards, activeBoardId, onSelectBoard, onCreateBoard }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-rule font-hand-sc uppercase tracking-wider" role="tablist" aria-label="Boards">
      {boards.map((board) => (
        <button
          key={board.id}
          role="tab"
          aria-selected={board.id === activeBoardId}
          aria-label={`Switch to board ${board.title || 'Untitled Board'}`}
          className={`px-4 py-1.5 text-base font-hand-sc uppercase tracking-wider transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-ink ${
            board.id === activeBoardId
              ? 'border-b-2 border-ink text-ink font-bold'
              : 'text-mute hover:text-ink'
          }`}
          onClick={() => onSelectBoard(board.id)}
        >
          {board.title || 'Untitled Board'}
        </button>
      ))}
      <button
        className="px-3 py-1 text-sm font-hand-sc uppercase tracking-wider whitespace-nowrap border-2 border-dashed border-rule text-mute hover:text-ink hover:border-ink rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-ink"
        aria-label="Create new board"
        onClick={onCreateBoard}
      >
        + New Board
      </button>
    </div>
  );
}
