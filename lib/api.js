import { getToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper that adds the auth header automatically
async function authFetch(url, options = {}) {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // If 401 — token expired or invalid, log the user out
  if (res.status === 401) {
    removeToken();
    window.location.href = "/login";
    return;
  }

  return res;
}

export async function getChats() {
  const res = await authFetch(`${BASE_URL}/chats`);
  if (!res.ok) throw new Error("Failed to fetch chats");
  const data = await res.json();
  return data.chats;
}

export async function createChat(chat) {
  const res = await authFetch(`${BASE_URL}/chats`, {
    method: "POST",
    body: JSON.stringify(chat),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  return await res.json();
}

export async function updateChat(chatId, updates) {
  const res = await authFetch(`${BASE_URL}/chats/${chatId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update chat");
  return await res.json();
}

export async function deleteChat(chatId) {
  const res = await authFetch(`${BASE_URL}/chats/${chatId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete chat");
  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function registerUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}