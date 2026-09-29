import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function CyberAI() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kbReady, setKbReady] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const quickPrompts = [
    "Someone called asking for my MoMo OTP code",
    "Is this a scam? A company wants a fee to release my job offer",
    "My phone suddenly shows No Service - what do I do?",
    "How do I secure my Android phone properly?",
    "I clicked a phishing link and entered my password",
    "Explain ransomware protection for my small business",
    "How do I know if a website is safe before paying?",
    "Create an incident response plan for my company"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    fetch(`${API_BASE}/cyberai/kb/stats`)
      .then(r => r.json())
      .then(d => setKbReady(d.success ? true : false))
      .catch(() => setKbReady(false));
  }, []);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const sendMessage = async (customMessage = null) => {
    const userMessage = (customMessage || message).trim();
    if (!userMessage || loading) return;
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "52px";
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/cyberai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: newMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          userId: getCurrentUser()?.id || null,
          userEmail: getCurrentUser()?.email || null,
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || data.error || "No response received.",
        sources: data.sources || [],
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `ERROR: ${err.message}` }]);
    }
    setLoading(false);
  };

  const copyMessage = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#04120a", color: "#fff", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ flexShrink: 0, borderBottom: "1px solid #14532d", background: "#052e16", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#34d399" }}>[SHIELD] Cyber-Zero Guardian</h1>
            <p style={{ color: "#86efac", marginTop: 4, fontSize: 13 }}>
              Specialized cybersecurity AI - threats, scams, recovery, hardening
              {kbReady && <span style={{ color: "#22c55e" }}> | Knowledge base: ONLINE</span>}
            </p>
          </div>
          <button onClick={() => navigate("/dashboard")} style={{
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 10, padding: "7px 16px", color: "#34d399",
            fontSize: 13, fontWeight: 700, cursor: "pointer"
          }}>Back</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12,
        WebkitOverflowScrolling: "touch"
      }}>
        {messages.length === 0 && (
          <div>
            <div style={{
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 16, padding: "16px 18px", marginBottom: 14, lineHeight: 1.6, fontSize: 14, color: "#d1fae5"
            }}>
              I am the Guardian - a cybersecurity AI trained (specialized) on a curated knowledge base:
              MoMo fraud, SIM swap, phishing, ransomware, malware, passwords and MFA, OWASP web security,
              public Wi-Fi, email fraud, crypto scams, Ghana-specific scam patterns, incident response and
              small-business security. Ask me anything - I answer in your language.
            </div>
            <div style={{ color: "#86efac", marginBottom: 10, fontSize: 13 }}>Common situations:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)} style={{
                  padding: "8px 16px", borderRadius: 999, border: "1px solid #10b981",
                  color: "#a7f3d0", background: "transparent", fontSize: 13, cursor: "pointer"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            borderRadius: 16, padding: "12px 16px",
            background: msg.role === "user" ? "rgba(8,145,178,0.15)" : "rgba(16,185,129,0.1)",
            border: msg.role === "user" ? "1px solid rgba(8,145,178,0.4)" : "1px solid rgba(16,185,129,0.35)",
            marginLeft: msg.role === "user" ? "10%" : 0,
            marginRight: msg.role === "user" ? 0 : "10%",
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: msg.role === "user" ? "#22d3ee" : "#34d399" }}>
              {msg.role === "user" ? "You" : "Guardian"}
            </div>
            <div style={{ whiteSpace: "pre-wrap", color: "#e2e8f0", lineHeight: 1.6, fontSize: 14 }}>{msg.content}</div>
            {msg.role === "assistant" && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => copyMessage(msg.content)} style={{
                  fontSize: 11, padding: "5px 12px", borderRadius: 6, background: "#059669",
                  border: "none", color: "#fff", cursor: "pointer"
                }}>Copy</button>
                {(msg.sources || []).length > 0 && (
                  <span style={{ fontSize: 11, color: "#6ee7b7" }}>
                    Knowledge used: {msg.sources.map(s => s.title).join(" + ")}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{
            borderRadius: 16, padding: "12px 16px",
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.35)",
            marginRight: "10%"
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: "#34d399" }}>Guardian</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: 9, height: 9, borderRadius: "50%", background: "#10b981",
                  animation: `blink 1.2s ease-in-out ${j * 0.2}s infinite`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>

      {/* Input bar */}
      <div style={{
        flexShrink: 0, borderTop: "1px solid #14532d", background: "#052e16",
        padding: "12px 16px 18px"
      }}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => { setMessage(e.target.value); autoResize(); }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Describe the situation - I will analyze it..."
          rows={2}
          style={{
            width: "100%", background: "#032215", border: "1.5px solid #166534",
            borderRadius: 14, padding: "13px 16px", color: "#e2e8f0", fontSize: 15,
            resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5,
            caretColor: "#34d399", boxSizing: "border-box", height: 52,
            transition: "border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = "#10b981"}
          onBlur={e => e.target.style.borderColor = "#166534"}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
          style={{
            width: "100%", marginTop: 10, padding: "13px", borderRadius: 14,
            background: (loading || !message.trim()) ? "#14532d" : "#059669",
            color: "#ecfdf5", fontWeight: 800, fontSize: 15, border: "none",
            cursor: (loading || !message.trim()) ? "not-allowed" : "pointer"
          }}
        >{loading ? "Analyzing..." : "Send"}</button>
      </div>
    </div>
  );
}
