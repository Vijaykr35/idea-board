import React, { useState } from 'react';

export default function GeneratePanel({ onGenerate, isGenerating }) {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [timePerDay, setTimePerDay] = useState('1 hour/day');

  const MODEL_NAME = 'qwen2.5:3b';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), MODEL_NAME, level, timePerDay);
  };

  return (
    <div className="bg-surface border border-rule rounded-md p-3 shadow-md flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-hand-sc uppercase tracking-wider text-ink flex items-center gap-2">
          <span>▶ ADD A BREAKDOWN</span>
        </div>
        <span className="text-xs font-hand-sc uppercase tracking-wider text-mute">
          Model: {MODEL_NAME}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2.5">
        <input
          type="text"
          className="flex-1 min-w-[200px] bg-paper text-ink border border-rule rounded-md px-3 py-1.5 text-sm font-hand focus-visible:outline-2 focus-visible:outline-ink"
          placeholder="Enter a goal or project idea..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-label="Goal or project topic"
          disabled={isGenerating}
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          disabled={isGenerating}
          aria-label="Select experience level"
          className="bg-paper text-ink border border-rule rounded-md px-2.5 py-1.5 text-sm font-hand-sc uppercase tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
        >
          <option value="absolute beginner">Level: Beginner</option>
          <option value="intermediate learner">Level: Intermediate</option>
          <option value="advanced practitioner">Level: Advanced</option>
        </select>

        <select
          value={timePerDay}
          onChange={(e) => setTimePerDay(e.target.value)}
          disabled={isGenerating}
          aria-label="Select daily time available"
          className="bg-paper text-ink border border-rule rounded-md px-2.5 py-1.5 text-sm font-hand-sc uppercase tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-ink"
        >
          <option value="30 mins/day">Time: 30 mins/day</option>
          <option value="1 hour/day">Time: 1 hour/day</option>
          <option value="2 hours/day">Time: 2 hours/day</option>
          <option value="4+ hours/day">Time: 4+ hours/day</option>
        </select>

        <button
          type="submit"
          className="bg-ink text-neutral-900 rounded-md px-4 py-1.5 text-sm font-hand-sc uppercase tracking-wider shadow-lg hover:brightness-110 active:translate-y-px transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ink"
          disabled={isGenerating || !topic.trim()}
          aria-label="Generate tasks using local Ollama model"
        >
          {isGenerating ? (
            <>
              <span className="w-3 h-3 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin-custom"></span>
              Generating...
            </>
          ) : (
            'Generate'
          )}
        </button>
      </form>

      <div className="text-xs font-hand text-mute">
        {isGenerating
          ? `Calling Ollama (${MODEL_NAME}) to break down goal...`
          : `Requires Ollama running locally at http://localhost:11434 with model '${MODEL_NAME}'.`}
      </div>
    </div>
  );
}
