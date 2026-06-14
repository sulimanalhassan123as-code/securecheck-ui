import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function AiAssistant() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const quickPrompts = [
    "Analyze this source code",
    "Explain this vulnerability",
    "Review API security",
    "Generate secure code",
    "Technology intelligence"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      const res = await fetch(`${API_BASE}/assistant-v2/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: newMessages.slice(-12).map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();

      let assistantContent = data.reply || "No response received.";

      if (data.type === "WEB_SCAN" && data.scanId) {
        assistantContent = "🔍 Scan started...\nCyber-Zero is analyzing the target. Please wait.";
        setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
        setLoading(false);

        let scanData = null;
        for (let i = 0; i < 12; i++) {
          await new Promise(r => setTimeout(r, 2500));
          try {
            const sr = await fetch(`${API_BASE}/scans/${data.scanId}`);
            scanData = await sr.json();
            if (scanData?.status === "COMPLETED" || scanData?.status === "FAILED") break;
          } catch { break; }
        }

        if (scanData?.status === "COMPLETED") {
          const f = scanData.findings || [];
          assistantContent = `🌐 Website Intelligence Report\n\n🎯 Target: ${scanData.targetUrl}\n🛡 Score: ${scanData.securityScore}/100\n🚨 Critical: ${f.filter(x=>x.severity==="CRITICAL").length}\n⚠ High: ${f.filter(x=>x.severity==="HIGH").length}\n\n${f.map((x,i)=>`Finding ${i+1}\n━━━━━━━━━━━━\nTitle: ${x.title}\nSeverity: ${x.severity}\nDescription: ${x.description}\nFix: ${x.recommendation}`).join("\n\n")}`;
        } else {
          assistantContent = "⚠️ Scan timed out or failed. Please try again.";
        }
        setMessages(prev => [...prev.slice(0,-1), { role: "assistant", content: assistantContent }]);
        return;
      }

      if (data.type === "CODE_ANALYSIS" && data.report) {
        const r = data.report;
        assistantContent = `🛡 Security Score: ${r.securityScore}/100\n\n${(r.findings||[]).map((f,i)=>`Finding ${i+1}\n━━━━━━━━━━━━\nTitle: ${f.title}\nSeverity: ${f.severity}\nDescription: ${f.description}\nFix: ${f.recommendation}`).join("\n\n")}`;
      }

      setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: `ERROR: ${err.message}` }]);
    }
    setLoading(false);
  };

  const copyMessage = async (text) => {
    try { await navigator.clipboard.writeText(text); alert("Copied!"); } catch { alert("Copy failed"); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:"#050b1a", color:"#fff", overflow:"hidden" }}>

      {/* Original-style header */}
      <div style={{ flexShrink:0, borderBottom:"1px solid #1e293b", background:"#0f172a", padding:"16px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>🤖 Cyber-Zero AI Assistant</h1>
            <p style={{ color:"#94a3b8", marginTop:4, fontSize:13 }}>Security • Development • Technology Intelligence</p>
          </div>
          <button onClick={() => navigate("/")} style={{
            background:"rgba(8,145,178,0.12)", border:"1px solid rgba(8,145,178,0.25)",
            borderRadius:10, padding:"7px 16px", color:"#22d3ee",
            fontSize:13, fontWeight:700, cursor:"pointer"
          }}>← Back</button>
        </div>
      </div>

      {/* Messages — full scroll area */}
      <div style={{
        flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12,
        WebkitOverflowScrolling:"touch"
      }}>
        {messages.length === 0 && (
          <div style={{ marginBottom:8 }}>
            <div style={{ color:"#94a3b8", marginBottom:10, fontSize:13 }}>Try one of these:</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {quickPrompts.map((p,i) => (
                <button key={i} onClick={() => sendMessage(p)} style={{
                  padding:"8px 16px", borderRadius:999, border:"1px solid #a855f7",
                  color:"#c4b5fd", background:"transparent", fontSize:13, cursor:"pointer"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            borderRadius:16, padding:"12px 16px",
            background: msg.role==="user" ? "rgba(8,145,178,0.15)" : "rgba(168,85,247,0.15)",
            border: msg.role==="user" ? "1px solid rgba(8,145,178,0.4)" : "1px solid rgba(168,85,247,0.4)",
            marginLeft: msg.role==="user" ? "10%" : 0,
            marginRight: msg.role==="user" ? 0 : "10%",
          }}>
            <div style={{ fontWeight:700, fontSize:12, marginBottom:6, color: msg.role==="user" ? "#22d3ee" : "#c4b5fd" }}>
              {msg.role==="user" ? "You" : "Cyber-Zero"}
            </div>
            <div style={{ whiteSpace:"pre-wrap", color:"#e2e8f0", lineHeight:1.6, fontSize:14 }}>{msg.content}</div>
            {msg.role==="assistant" && (
              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                <button onClick={() => copyMessage(msg.content)} style={{
                  fontSize:11, padding:"5px 12px", borderRadius:6, background:"#0891b2",
                  border:"none", color:"#fff", cursor:"pointer"
                }}>Copy</button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{
            borderRadius:16, padding:"12px 16px",
            background:"rgba(168,85,247,0.15)", border:"1px solid rgba(168,85,247,0.4)",
            marginRight:"10%"
          }}>
            <div style={{ fontWeight:700, fontSize:12, marginBottom:6, color:"#c4b5fd" }}>Cyber-Zero</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              {[0,1,2].map(j => (
                <div key={j} style={{
                  width:9, height:9, borderRadius:"50%", background:"#a855f7",
                  animation:`blink 1.2s ease-in-out ${j*0.2}s infinite`
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height:1 }} />
      </div>

      {/* Input bar — dark, text visible */}
      <div style={{
        flexShrink:0, borderTop:"1px solid #1e293b", background:"#0f172a",
        padding:"12px 16px 18px"
      }}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => { setMessage(e.target.value); autoResize(); }}
          onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); } }}
          placeholder="Ask Cyber-Zero anything..."
          rows={2}
          style={{
            width:"100%", background:"#0c1527", border:"1.5px solid #334155",
            borderRadius:14, padding:"13px 16px", color:"#e2e8f0", fontSize:15,
            resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.5,
            caretColor:"#22d3ee", boxSizing:"border-box", height:52,
            transition:"border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor="#0891b2"}
          onBlur={e => e.target.style.borderColor="#334155"}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
          style={{
            marginTop:10, width:"100%",
            background: (loading || !message.trim()) ? "#1e293b" : "linear-gradient(135deg,#7c3aed,#6366f1)",
            border:"none", borderRadius:12, padding:"13px", fontWeight:800,
            fontSize:14, color: (loading || !message.trim()) ? "#64748b" : "#fff",
            cursor: (loading || !message.trim()) ? "default" : "pointer",
            letterSpacing:1, transition:"all 0.2s"
          }}
        >{loading ? "Thinking..." : "Send Message"}</button>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>
    </div>
  );
}
