"use client";

import { useState, useRef, useEffect } from "react";


export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleNewChat() {
  setMessages([]);
  setHistory([]);
  setMessage("");
  setActiveChatId(null);
}

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Runs once when the page loads — reads saved chats from localStorage
useEffect(() => {
  try {
    const saved = localStorage.getItem("gemini_chats");
    if (saved) setChats(JSON.parse(saved));
  } catch {
    setChats([]);
  }
}, []);

// Shortens long text so it fits as a chat title
function truncate(text, length = 30) {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

// Converts a timestamp into human-readable time like "5m ago"
function formatTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Loads a saved chat back into the UI when you click it
function handleLoadChat(chat) {
  setMessages(chat.messages);
  setHistory(chat.history);
  setActiveChatId(chat.id);
  setMessage("");
}

// Deletes a chat from the list and localStorage
function handleDeleteChat(e, chatId) {
  e.stopPropagation();
  const updated = chats.filter((c) => c.id !== chatId);
  setChats(updated);
  localStorage.setItem("gemini_chats", JSON.stringify(updated));
  if (activeChatId === chatId) handleNewChat();
}

  async function handleSend() {
    if (!message.trim() || loading) return;

    const userMsg = { role: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);

    const newHistory = [
      ...history,
      { role: "user", parts: [{ text: message }] },
    ];

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: `Error: ${data.error}` }]);
        return;
      }

        setHistory([
        ...newHistory,
        { role: "model", parts: [{ text: data.reply }] },
      ]);

      // Build the updated chat object
const chatId = activeChatId || Date.now().toString();
if (!activeChatId) setActiveChatId(chatId);

const updatedChat = {
  id: chatId,
  title: truncate(message || messages[0]?.text || "New Chat"),
  timestamp: Date.now(),
  messages: [...messages, { role: "user", text: message }, { role: "ai", text: data.reply }],
  history: [...history,
    { role: "user", parts: [{ text: message }] },
    { role: "model", parts: [{ text: data.reply }] }
  ],
};

const updatedChats = activeChatId
  ? chats.map((c) => (c.id === chatId ? updatedChat : c))
  : [updatedChat, ...chats];

setChats(updatedChats);
localStorage.setItem("gemini_chats", JSON.stringify(updatedChats));


      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
   <main style={styles.page}>
  <style>{`
  @media (max-width: 768px) {
    .sidebar {
      position: fixed !important;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      transition: transform 0.3s ease;
      transform: translateX(-100%);
    }
    .sidebar.open {
      transform: translateX(0) !important;
    }
    .toggle-btn {
      display: flex !important;
    }
    .overlay {
      display: block !important;
    }
  }
`}</style>

  <div style={styles.layout}>

    {sidebarOpen && (
      <div
        className="overlay"
        onClick={() => setSidebarOpen(false)}
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 99,
        }}
      />
    )}

   <div
  className={sidebarOpen ? "sidebar open" : "sidebar"}
  style={styles.sidebar}
>

  <div style={styles.sidebarHeader}>
    <span style={styles.sidebarTitle}>Chats</span>
  </div>

  <button
    style={styles.newChatSidebarBtn}
    onClick={handleNewChat}
  >
    + New Chat
  </button>

  <div style={styles.chatList}>
    {chats.length === 0 && (
      <div style={styles.noChats}>No saved chats yet</div>
    )}
    {chats.map((chat) => (
      <div
        key={chat.id}
        onClick={() => handleLoadChat(chat)}
        style={{
          ...styles.chatItem,
          ...(activeChatId === chat.id ? styles.chatItemActive : {}),
        }}
      >
        <div style={styles.chatItemTitle}>{chat.title}</div>
        <div style={styles.chatItemBottom}>
          <span style={styles.chatItemTime}>{formatTime(chat.timestamp)}</span>
          <button
            style={styles.deleteBtn}
            onClick={(e) => handleDeleteChat(e, chat.id)}
          >
            🗑
          </button>
        </div>
      </div>
    ))}
  </div>

</div>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
  <button
    className="toggle-btn"
    onClick={() => setSidebarOpen(!sidebarOpen)}
    style={{
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "4px 8px",
      fontSize: "16px",
      cursor: "pointer",
      color: "#555",
    }}
  >
    ☰
  </button>
  <div style={styles.headerDot} />
  <span style={styles.headerTitle}>Chat Now</span>
</div>

        {/* Messages area */}
        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.empty}>Ask me anything...</div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.bubble,
                ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.bubble, ...styles.aiBubble, opacity: 0.5 }}>
              Thinking...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={styles.inputRow}>
          <textarea
            style={styles.textarea}
            rows={1}
            placeholder="Type a message... (Enter to send)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            Send
          </button>
        </div>

</div>
      </div>
    </main>
  );
}

const styles = {
 page: {
  backgroundColor: "#f5f5f0",
  fontFamily: "'Georgia', serif",
},
  layout: {
  display: "flex",
  width: "100%",
  height: "100vh",
},
  container: {
  flex: 1,
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
},
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #ebebeb",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#fafaf8",
  },
  headerDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#4a90d9",
  },
  headerTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
    letterSpacing: "0.3px",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: "40px",
    fontSize: "15px",
    fontStyle: "italic",
  },
  bubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "14px",
    fontSize: "15px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
  },
  userBubble: {
    backgroundColor: "#4a90d9",
    color: "#ffffff",
    alignSelf: "flex-end",
    borderBottomRightRadius: "4px",
  },
  sidebar: {
  width: "260px",
  minWidth: "260px",
  height: "100vh",
  backgroundColor: "#ffffff",
  borderRight: "1px solid #ebebeb",
  display: "flex",
  flexDirection: "column",
},
sidebarHeader: {
  padding: "20px",
  borderBottom: "1px solid #ebebeb",
},
sidebarTitle: {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
},
newChatSidebarBtn: {
  margin: "16px",
  padding: "10px",
  backgroundColor: "#4a90d9",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontSize: "14px",
  cursor: "pointer",
  fontFamily: "inherit",
},
chatList: {
  flex: 1,
  overflowY: "auto",
  padding: "8px",
},
noChats: {
  textAlign: "center",
  color: "#aaa",
  fontSize: "14px",
  marginTop: "32px",
  fontStyle: "italic",
},
chatItem: {
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "4px",
  backgroundColor: "transparent",
},
chatItemActive: {
  backgroundColor: "#eef4fc",
},
chatItemTitle: {
  fontSize: "14px",
  color: "#1a1a1a",
  marginBottom: "4px",
  fontWeight: "500",
},
chatItemBottom: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},
chatItemTime: {
  fontSize: "12px",
  color: "#aaa",
},
deleteBtn: {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  opacity: 0.5,
  padding: "2px 4px",
},
  aiBubble: {
    backgroundColor: "#f0f0eb",
    color: "#1a1a1a",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "4px",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    padding: "16px 24px",
    borderTop: "1px solid #ebebeb",
    backgroundColor: "#fafaf8",
  },
  textarea: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "none",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4a90d9",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};