import { useState, useEffect } from "react";

const KEY = "wingman_chats";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function save(chats) {
  try { localStorage.setItem(KEY, JSON.stringify(chats)); }
  catch (e) { console.warn("localStorage write failed", e); }
}

export function useChats() {
  const [chats, setChats] = useState(load);

  useEffect(() => { save(chats); }, [chats]);

  const addChat = (result, name) => {
    // Strip chart images (base64 PNGs) — store only structured data
    const { charts, ...rest } = result;
    const entry = {
      id: crypto.randomUUID(),
      name: name || `Chat ${new Date().toLocaleDateString()}`,
      savedAt: new Date().toISOString(),
      data: rest,         // stats, participants, senderStats, responseByPerson, rawData
    };
    setChats(prev => [entry, ...prev]);
    return entry.id;
  };

  const removeChat = (id) => setChats(prev => prev.filter(c => c.id !== id));

  const renameChat = (id, name) =>
    setChats(prev => prev.map(c => c.id === id ? { ...c, name } : c));

  return { chats, addChat, removeChat, renameChat };
}
