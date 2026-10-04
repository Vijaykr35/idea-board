import React, { useState, useEffect } from 'react';
import * as api from './api';
import BoardTabs from './components/BoardTabs';
import BoardHeader from './components/BoardHeader';
import GeneratePanel from './components/GeneratePanel';
import ImportPanel from './components/ImportPanel';
import ProgressBar from './components/ProgressBar';
import Column from './components/Column';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const loadBoards = async (preferredBoardId = null) => {
    try {
      setError(null);
      const data = await api.fetchBoards();
      setBoards(data);
      if (data.length > 0) {
        if (preferredBoardId && data.some((b) => b.id === preferredBoardId)) {
          setActiveBoardId(preferredBoardId);
        } else if (!activeBoardId || !data.some((b) => b.id === activeBoardId)) {
          setActiveBoardId(data[0].id);
        }
      } else {
        setActiveBoardId(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || null;

  const handleCreateBoard = async () => {
    try {
      setError(null);
      const newBoard = await api.createBoard('New Board');
      await loadBoards(newBoard.id);
    } catch (err) {
      setError(err.message || 'Failed to create board');
    }
  };

  const handleRenameBoard = async (id, title) => {
    try {
      setError(null);
      await api.renameBoard(id, title);
      await loadBoards(id);
    } catch (err) {
      setError(err.message || 'Failed to rename board');
    }
  };

  const handleDeleteBoard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this board?')) return;
    try {
      setError(null);
      await api.deleteBoard(id);
      await loadBoards();
    } catch (err) {
      setError(err.message || 'Failed to delete board');
    }
  };

  const handleAddTask = async (text, tag) => {
    if (!activeBoardId) return;
    try {
      setError(null);
      await api.addTask(activeBoardId, text, tag);
      await loadBoards(activeBoardId);
    } catch (err) {
      setError(err.message || 'Failed to add task');
    }
  };

  const handleMoveStatus = async (taskId, newStatus) => {
    try {
      setError(null);
      await api.updateTask(taskId, { status: newStatus });
      await loadBoards(activeBoardId);
    } catch (err) {
      setError(err.message || 'Failed to move task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError(null);
      await api.deleteTask(taskId);
      await loadBoards(activeBoardId);
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleImportTasks = async (text) => {
    if (!activeBoardId) return;
    try {
      setError(null);
      setIsImporting(true);
      await api.importTasks(activeBoardId, text);
      await loadBoards(activeBoardId);
    } catch (err) {
      setError(err.message || 'Failed to import tasks');
    } finally {
      setIsImporting(false);
    }
  };

  const handleGenerateTasks = async (topic, model, level, timePerDay) => {
    if (!activeBoardId) return;
    try {
      setError(null);
      setIsGenerating(true);
      await api.generateTasks(activeBoardId, topic, model, level, timePerDay);
      await loadBoards(activeBoardId);
    } catch (err) {
      setError(err.message || 'Failed to generate tasks');
    } finally {
      setIsGenerating(false);
    }
  };


  const tasks = activeBoard ? activeBoard.tasks || [] : [];
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const doingTasks = tasks.filter((t) => t.status === 'doing');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 font-hand text-ink">
      <header className="flex items-center justify-between pb-4 border-b-4 border-double border-ink">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💡</span>
          <h1 className="text-3xl font-hand-sc uppercase tracking-wider text-ink">Idea Board</h1>
        </div>
      </header>

      {error && (
        <div className="bg-surface border border-danger text-danger p-3 rounded-md text-sm flex justify-between items-center shadow-md" role="alert">
          <span>{error}</span>
          <button
            className="text-lg font-bold hover:opacity-80 px-2 text-danger focus-visible:outline-2 focus-visible:outline-ink"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <BoardTabs
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoardId}
        onCreateBoard={handleCreateBoard}
      />

      {loading ? (
        <div className="text-center py-12 text-mute font-hand-sc uppercase tracking-wider">
          Loading your boards...
        </div>
      ) : activeBoard ? (
        <>
          <BoardHeader
            board={activeBoard}
            onRenameBoard={handleRenameBoard}
            onDeleteBoard={handleDeleteBoard}
          />

          <div className="flex flex-col gap-4">
            <GeneratePanel
              onGenerate={handleGenerateTasks}
              isGenerating={isGenerating}
            />
            <ImportPanel
              onImport={handleImportTasks}
              isImporting={isImporting}
            />
          </div>

          <ProgressBar total={tasks.length} done={doneTasks.length} />

          <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Column
              status="todo"
              title="To do"
              tasks={todoTasks}
              onMoveStatus={handleMoveStatus}
              onDeleteTask={handleDeleteTask}
              onDropTask={handleMoveStatus}
              onAddTask={handleAddTask}
            />
            <Column
              status="doing"
              title="Doing"
              tasks={doingTasks}
              onMoveStatus={handleMoveStatus}
              onDeleteTask={handleDeleteTask}
              onDropTask={handleMoveStatus}
              onAddTask={handleAddTask}
            />
            <Column
              status="done"
              title="Done"
              tasks={doneTasks}
              onMoveStatus={handleMoveStatus}
              onDeleteTask={handleDeleteTask}
              onDropTask={handleMoveStatus}
              onAddTask={handleAddTask}
            />
          </main>
        </>
      ) : (
        <div className="text-center py-12 text-mute font-hand-sc uppercase tracking-wider">
          No boards found. Click "+ New Board" above to get started!
        </div>
      )}
    </div>
  );
}

