const BASE_URL = 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch (e) {
      // Ignore json parsing error if response body is not JSON
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchBoards() {
  const res = await fetch(`${BASE_URL}/boards`);
  return handleResponse(res);
}

export async function createBoard(title) {
  const res = await fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function renameBoard(id, title) {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function deleteBoard(id) {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function addTask(boardId, text, tag = '') {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tag }),
  });
  return handleResponse(res);
}

export async function updateTask(taskId, updates) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function deleteTask(taskId) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}

export async function importTasks(boardId, text) {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return handleResponse(res);
}

export async function generateTasks(boardId, topic, model = 'qwen2.5:3b', level = 'beginner', timePerDay = '1 hour/day') {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, model: 'qwen2.5:3b', level, time_per_day: timePerDay }),
  });
  return handleResponse(res);
}



