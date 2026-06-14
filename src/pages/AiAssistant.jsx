import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

const QUICK = [
  "What is SQL injection?",
  "How to fix XSS vulnerabilities?",
  "Best practices for API security",
  "How to prevent CSRF attacks?",
  "What is a buffer overflow?",
  "Explain JWT token security",
];

export default function AiAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 I'm Cyber-Zero AI — your elite security intelligence assistant.\n\nAsk me anything about cybersecurity, code vulnerabilities, or paste a URL to scan it." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const send = async (customMsg = null) => {
    const msg = (customMsg || input).trim();
    if (!msg || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "48px";
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/assistant-v2/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: newMessages.slice(-12).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (data.type === "WEB_SCAN" && data.scanId) {
        setMessages(prev => [...prev, { role: "assistant", content: "🔍 Scanning website... please wait" }]);
        setLoading(false);
        let scanData = null;
        for (let i = 0; i < 15; i++) {
          await new Promise(r => setTimeout(r, 2500));
          try {
            const sr = await fetch(`${API_BASE}/scans/${data.scanId}`);
            scanData = await sr.json();
            if (scanData?.status === "COMPLETED" || scanData?.status === "FAILED") break;
          } catch { break; }
        }
        if (scanData?.status === "COMPLETED") {
          const f = scanData.findings || [];
          const reply = `🌐 *Website Security Report*\n\nTarget: ${scanData.targetUrl}\nScore: ${scanData.securityScore}/100\nIssues found: ${f.length}\n\n${
            f.map((x, i) => `${i + 1}. [${x.severity}] ${x.title}\n   → ${x.recommendation}`).join("\n\n")
          }`;
          setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: reply }]);
        } else {
          setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: "⚠️ Scan timed out. Try again." }]);
        }
        return;
      }

      if (data.type === "CODE_ANALYSIS" && data.report) {
        const r = data.report;
        const reply = `🛡 *Code Analysis*\n\nSecurity Score: ${r.securityScore}/100\n\n${
          (r.findings || []).map((f, i) => `${i + 1}. [${f.severity}] ${f.title}\n${f.description}\n💡 ${f.recommendation}`).join("\n\n")
        }`;
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        setLoading(false);
        return;
      }

      const reply = data.reply || "No response received.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Connection error: ${e.message}\n\nMake sure the API engine is running.` }]);
    }
    setLoading(false);
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch { /**/ }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100dvh", height: "100vh",
      background: "#030f1a", overflow: "hidden"
    }}>
      {/* Top bar */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 12,
        padding: "0 16px", height: 56,
        background: "rgba(3,15,26,0.97)",
        borderBottom: "1px solid rgba(8,145,178,0.15)",
        backdropFilter: "blur(16px)"
      }}>
        <button onClick={() => navigate("/")} style={{
          background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.2)",
          borderRadius: 10, padding: "6px 14px", color: "#22d3ee",
          fontSize: 13, fontWeight: 700, cursor: "pointer"
        }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 16,
            background: "linear-gradient(135deg,#0891b2,#6366f1)"
          }}>🤖</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Cyber-Zero AI</div>
            <div style={{ fontSize: 10, color: "#22d3ee" }}>● Groq Llama 3.3 · Security Intelligence</div>
          </div>
        </div>
        <button onClick={() => setMessages([{ role: "assistant", content: "👋 Chat cleared. How can I help?" }])}
          style={{ background: "none", border: "none", color: "rgba(148,163,184,0.5)", fontSize: 13, cursor: "pointer" }}>
          Clear
        </button>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10,
        WebkitOverflowScrolling: "touch"
      }}>
        {/* Quick prompts shown only at start */}
        {messages.length === 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {QUICK.map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{
                fontSize: 12, padding: "7px 13px", borderRadius: 20,
                background: "rgba(8,145,178,0.08)",
                border: "1px solid rgba(8,145,178,0.2)",
                color: "#22d3ee", cursor: "pointer"
              }}>{q}</button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.2s ease" }}>
            {msg.role === "assistant" && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "88%" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                  background: "linear-gradient(135deg,#0891b2,#6366f1)", marginBottom: 2
                }}>🤖</div>
                <div>
                  <div className="chat-bubble-ai">{msg.content}</div>
                  <button onClick={() => copy(msg.content)} style={{
                    marginTop: 4, fontSize: 10, color: "rgba(148,163,184,0.4)",
                    background: "none", border: "none", cursor: "pointer", paddingLeft: 4
                  }}>Copy</button>
                </div>
              </div>
            )}
            {msg.role === "user" && (
              <div className="chat-bubble-user">{msg.content}</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
              background: "linear-gradient(135deg,#0891b2,#6366f1)"
            }}>🤖</div>
            <div className="chat-bubble-ai" style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#22d3ee",
                    animation: `blink 1.2s ease-in-out ${i*0.2}s infinite`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>

      {/* Input bar */}
      <div style={{
        flexShrink: 0,
        padding: "10px 12px 14px",
        background: "rgba(3,12,24,0.98)",
        borderTop: "1px solid rgba(8,145,178,0.12)",
        display: "flex", alignItems: "flex-end", gap: 10
      }}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={e => { setInput(e.target.value); autoResize(); }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about security, paste code, or type a URL..."
          rows={1}
          style={{ height: 48, flex: 1 }}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#0891b2,#6366f1)",
          border: "none", color: "#fff", fontSize: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: (loading || !input.trim()) ? 0.4 : 1,
          transition: "opacity 0.2s"
        }}>➤</button>
      </div>
    </div>
  );
}
