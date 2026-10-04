import React, { useState } from 'react';

export default function ImportPanel({ onImport, isImporting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [importText, setImportText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!importText.trim()) return;
    onImport(importText);
    setImportText('');
  };

  return (
    <div className="bg-surface border border-rule rounded-md p-3 shadow-md">
      <button
        className="text-ink text-sm font-hand-sc uppercase tracking-wider flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-ink hover:text-mute transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle batch task import panel"
      >
        {isOpen ? '▼ HIDE BATCH IMPORT' : '► BATCH IMPORT TASKS (PASTE LIST)'}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2.5">
          <textarea
            className="w-full h-24 bg-paper text-ink border border-rule rounded-md p-2.5 text-sm font-hand focus-visible:outline-2 focus-visible:outline-ink resize-y"
            placeholder={`Paste tasks line-by-line, e.g.:\nPhase 1: Setup project\n- Install dependencies\n1. Run migrations`}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            aria-label="Paste batch tasks list"
            disabled={isImporting}
          />
          <button
            type="submit"
            className="self-start bg-ink text-neutral-900 rounded-md px-4 py-1.5 text-sm font-hand-sc uppercase tracking-wider shadow-lg hover:brightness-110 active:translate-y-px transition-all disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-ink"
            disabled={isImporting || !importText.trim()}
            aria-label="Import pasted tasks"
          >
            {isImporting ? 'Importing...' : 'Import Tasks'}
          </button>
        </form>
      )}
    </div>
  );
}
