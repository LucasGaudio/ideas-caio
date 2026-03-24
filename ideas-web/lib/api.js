const BASE_URL = 'http://localhost:3000'; // backend

export async function getIdeas() {
  const res = await fetch(`${BASE_URL}/ideas`);
  return res.json();
}

export async function getIdea(id) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`);
  return res.json();
}

export async function createIdea(data) {
  const res = await fetch(`${BASE_URL}/ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateIdea(id, data) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function classifyIdea(id, data) {
  const res = await fetch(`${BASE_URL}/ideas/${id}/classification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getClassification(id) {
  const res = await fetch(`${BASE_URL}/ideas/${id}/classification`);
  return res.json();
}