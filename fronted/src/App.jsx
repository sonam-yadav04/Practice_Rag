import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function serverCall(inputText) {
    try {
      const res = await axios.post(`http://localhost:8000/chat`, {
        message: inputText,
      });
      console.log(res.data);
      console.log("here")
      return res.data.res;
    } catch (err) {
      console.log(err);
      return "Sorry, I couldn't reach the server.";
    }
  }

  const generator = async (text) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const assistantMessage = await serverCall(text);
      setMessages((prev) => [
        ...prev,
        { type: "assistant", text: assistantMessage },
      ]);
    } catch (err) {
      console.log("frontend error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    const text = input.trim();
    if (!text) return;
    generator(text);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      generator(text);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoCircle}>✦</div>
          <div>
            <h1 style={styles.title}>ChatBot</h1>
            <p style={styles.subtitle}>Your intelligent AI companion</p>
          </div>
        </div>
        <span style={styles.badge}>● Online</span>
      </header>

      {/* Chat Area - the ONLY scrollable region */}
      <main style={styles.main}>
        <div style={styles.chatContainer}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💬</div>
              <h2 style={styles.emptyTitle}>Start a conversation</h2>
              <p style={styles.emptyText}>
                Ask me anything — I'm here to help!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent:
                  msg.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.type === "assistant" && (
                <div style={styles.avatarBot}>✦</div>
              )}
              <div
                style={
                  msg.type === "user" ? styles.bubbleUser : styles.bubbleBot
                }
              >
                {msg.text}
              </div>
              {msg.type === "user" && <div style={styles.avatarUser}>You</div>}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
              <div style={styles.avatarBot}>✦</div>
              <div style={styles.typingBubble}>
                <span style={styles.dot} />
                <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          {/* invisible anchor used to auto-scroll to the latest message */}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input Bar - normal flex item, NOT position:fixed, so it can never overlap */}
      <footer style={styles.footer}>
        <div style={styles.inputBox}>
          <textarea
            style={styles.textarea}
            value={input}
            placeholder="Type your message... (Shift+Enter for new line)"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            rows={2}
          />
          <button
            onClick={handleClick}
            disabled={loading || !input.trim()}
            style={{
              ...styles.sendBtn,
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            ➤
          </button>
        </div>
        <p style={styles.hint}>Shift + Enter for new line · Enter to send</p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        textarea::placeholder { color: #a78bfa; opacity: 0.7; }
        textarea:focus { outline: none; }
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-thumb { background: #7c3aed44; border-radius: 3px; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",           // fixed viewport height, not minHeight
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
    overflow: "hidden",        // page itself never scrolls
  },

  header: {
    background: "rgba(22, 89, 232, 0.06)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoCircle: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "0 0 16px #7c3aed88",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #a78bfa, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.5px",
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#a78bfa",
    marginTop: "2px",
  },
  badge: {
    fontSize: "12px",
    color: "#34d399",
    background: "rgba(52,211,153,0.12)",
    border: "1px solid rgba(52,211,153,0.3)",
    borderRadius: "20px",
    padding: "4px 12px",
  },

  main: {
    flex: 1,                   // takes all remaining space between header/footer
    overflowY: "auto",         // ONLY this area scrolls
    padding: "24px 16px",
  },
  chatContainer: {
    maxWidth: "780px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  emptyState: {
    textAlign: "center",
    marginTop: "80px",
    opacity: 0.6,
  },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#e9d5ff",
    margin: "0 0 8px",
  },
  emptyText: { fontSize: "14px", color: "#a78bfa" },

  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    animation: "fadeIn 0.25s ease",
  },
  avatarBot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
    boxShadow: "0 0 10px #7c3aed66",
  },
  avatarUser: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
    fontWeight: "700",
    flexShrink: 0,
    letterSpacing: "0.5px",
    boxShadow: "0 0 10px #06b6d466",
  },

  bubbleUser: {
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "18px 18px 4px 18px",
    maxWidth: "65%",
    fontSize: "14px",
    lineHeight: "1.6",
    boxShadow: "0 4px 14px rgba(6,182,212,0.3)",
    wordBreak: "break-word",
  },
  bubbleBot: {
    background: "rgba(124, 58, 237, 0.18)",   // more visible than the old near-black look
    border: "1px solid rgba(167,139,250,0.4)",
    color: "#f3e8ff",
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    maxWidth: "65%",
    fontSize: "14px",
    lineHeight: "1.6",
    minHeight: "1.6em",                        // keeps a visible shape even if text is briefly empty
    wordBreak: "break-word",
  },

  typingBubble: {
    background: "rgba(124, 58, 237, 0.18)",
    border: "1px solid rgba(167,139,250,0.4)",
    borderRadius: "18px 18px 18px 4px",
    padding: "14px 18px",
    display: "flex",
    gap: "5px",
    alignItems: "center",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#a78bfa",
    display: "inline-block",
    animation: "bounce 1.2s infinite ease-in-out",
  },

  footer: {
    flexShrink: 0,         
    background: "rgba(15,12,41,0.85)",
    backdropFilter: "blur(16px)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "14px 15px 15px",
  },
  inputBox: {
    maxWidth: "780px",
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(167,139,250,0.3)",
    borderRadius: "16px",
    padding: "10px 14px",
    boxShadow: "0 0 20px rgba(124,58,237,0.15)",
  },
  textarea: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#e9d5ff",
    fontSize: "14px",
    resize: "none",
    lineHeight: "1.6",
    fontFamily: "inherit",
    paddingTop: "2px",
  },
  sendBtn: {
    width: "35px",
    height: "30px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "transform 0.15s ease, opacity 0.2s",
    boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
  },
  hint: {
    textAlign: "center",
    fontSize: "11px",
    color: "#6d5a9e",
    margin: "8px 0 0",
  },
};

export default App;