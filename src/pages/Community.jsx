import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const myName = typeof window !== "undefined" ? (localStorage.getItem("cyberzero_name") || "Anonymous") : "Anonymous";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("czCommunity") || "[]");
    setPosts(stored);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 110) + "px";
  };

  const postMsg = () => {
    if (!text.trim()) return;
    const newPost = {
      id: Date.now(),
      name: myName,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reply: "",
    };
    const updated = [...posts, newPost];
    localStorage.setItem("czCommunity", JSON.stringify(updated.slice(-100)));
    setPosts(updated);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "48px";
    // Notification
    const notifs = JSON.parse(localStorage.getItem("czNotifs") || "[]");
    notifs.unshift({ msg: `💬 ${myName} posted a question`, time: newPost.time });
    localStorage.setItem("czNotifs", JSON.stringify(notifs.slice(0, 50)));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postMsg(); }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100dvh", height: "100vh",
      background: "#0a1628", overflow: "hidden"
    }}>
      {/* WhatsApp-style header */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 12,
        padding: "0 14px", height: 60,
        background: "#0d2137",
        borderBottom: "1px solid rgba(8,145,178,0.15)"
      }}>
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", color: "#22d3ee",
          fontSize: 22, cursor: "pointer", padding: "4px 8px 4px 0"
        }}>←</button>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg,#0891b2,#6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
        }}>💬</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Community Hub</div>
          <div style={{ fontSize: 11, color: "#22d3ee" }}>{posts.length} message{posts.length !== 1 ? "s" : ""}</div>
        </div>
        <button onClick={() => {
          if (window.confirm("Clear all messages?")) {
            localStorage.removeItem("czCommunity");
            setPosts([]);
          }
        }} style={{ background: "none", border: "none", color: "rgba(148,163,184,0.4)", fontSize: 12, cursor: "pointer" }}>
          Clear
        </button>
      </div>

      {/* Chat messages */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8,
        WebkitOverflowScrolling: "touch",
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(8,145,178,0.03) 0%, transparent 60%)"
      }}>
        {posts.length === 0 && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            color: "rgba(148,163,184,0.35)", fontSize: 14, gap: 10, paddingTop: 60
          }}>
            <span style={{ fontSize: 40 }}>💬</span>
            <div>No messages yet</div>
            <div style={{ fontSize: 12 }}>Be the first to post a question</div>
          </div>
        )}

        {posts.map((p) => {
          const isMe = p.name === myName;
          return (
            <div key={p.id} style={{ display: "flex", flexDirection: "column",
              alignItems: isMe ? "flex-end" : "flex-start", gap: 2 }}>
              {/* Name tag for others */}
              {!isMe && (
                <div style={{ fontSize: 11, color: "#22d3ee", marginLeft: 10, fontWeight: 600 }}>{p.name}</div>
              )}
              <div className={isMe ? "chat-bubble-community-user" : "chat-bubble-admin"}>
                {p.text}
                <div style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.55)" : "rgba(148,163,184,0.45)",
                  marginTop: 4, textAlign: "right" }}>{p.time}</div>
              </div>
              {/* Admin reply */}
              {p.reply && (
                <div style={{ maxWidth: "80%", alignSelf: "flex-start" }}>
                  <div style={{ fontSize: 11, color: "#22d3ee", marginLeft: 10, fontWeight: 600, marginBottom: 2 }}>🛡 Admin</div>
                  <div className="chat-bubble-admin" style={{ borderColor: "rgba(34,211,238,0.3)" }}>
                    {p.reply}
                    <div style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", marginTop: 4, textAlign: "right" }}>Admin</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>

      {/* Input bar — WhatsApp style */}
      <div style={{
        flexShrink: 0,
        padding: "8px 12px 14px",
        background: "#0d2137",
        borderTop: "1px solid rgba(8,145,178,0.12)",
        display: "flex", alignItems: "flex-end", gap: 10
      }}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={text}
          onChange={e => { setText(e.target.value); autoResize(); }}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          rows={1}
          style={{ height: 48, flex: 1 }}
        />
        <button onClick={postMsg} disabled={!text.trim()} style={{
          width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#075e54,#128c7e)",
          border: "none", color: "#fff", fontSize: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: !text.trim() ? 0.4 : 1, transition: "opacity 0.2s"
        }}>➤</button>
      </div>
    </div>
  );
}
