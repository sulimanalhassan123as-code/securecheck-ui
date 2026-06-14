import { useState, useRef, useEffect } from "react";
import PageShell from "../components/PageShell";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

const QUICK_PROMPTS = [
  "Explain SQL injection",
  "What is XSS and how to fix it?",
  "Review API security best practices",
  "Generate secure login code",
  "How to prevent CSRF attacks?",
];

export default function AiAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customMsg = null) => {
    const userMsg = (customMsg || message).trim();
    if (!userMsg) return;
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/assistant-v2/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      let reply = data.reply || "No response received.";

      if (data.type === "WEB_SCAN" && data.scanId) {
        reply = "🔍 Web scan queued. Analyzing target...";
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        setLoading(false);
        // Poll for result
        let scanData = null;
        for (let i = 0; i < 12; i++) {
          await new Promise(r => setTimeout(r, 2500));
          const sr = await fetch(`${API_BASE}/scans/${data.scanId}`);
          scanData = await sr.json();
          if (scanData?.status === "COMPLETED") break;
        }
        if (scanData?.status === "COMPLETED") {
          const f = scanData.findings || [];
          reply = `🌐 Website Security Report\n\nTarget: ${scanData.targetUrl}\nScore: ${scanData.securityScore}/100\nFindings: ${f.length}\n\n${
            f.map((x, i) => `${i + 1}. [${x.severity}] ${x.title}\n   → ${x.recommendation}`).join("\n\n")
          }`;
          setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: reply }]);
        }
        return;
      }

      if (data.type === "CODE_ANALYSIS" && data.report) {
        const r = data.report;
        reply = `🛡 Code Analysis — Score: ${r.securityScore}/100\n\n${
          (r.findings || []).map((f, i) => `${i + 1}. [${f.severity}] ${f.title}\n${f.description}\n💡 ${f.recommendation}`).join("\n\n")
        }`;
      }

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ Connection error: ${e.message}` }]);
    }
    setLoading(false);
  };

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); alert("Copied!"); } catch { /**/ }
  };

  return (
    <PageShell title="AI Assistant" icon="🤖">
      {/* Quick prompts */}
      {messages.length === 0 && (
        <div className="mb-4">
          <div className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Quick Questions</div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-[rgba(8,145,178,0.2)] text-[#22d3ee] hover:bg-[rgba(8,145,178,0.1)] transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="rounded-2xl border border-[rgba(8,145,178,0.12)] bg-white/2 flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: 300 }}>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="flex items-start gap-2 mt-2">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)" }}>🤖</div>
              <div className="rounded-[10px_10px_10px_2px] px-3 py-2.5 text-[13px] leading-relaxed max-w-[85%] text-white/80"
                style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.2)" }}>
                👋 I am Cyber-Zero AI — your elite security intelligence assistant. Ask me anything about cybersecurity, code vulnerabilities, or type a URL to scan it.
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-2"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-0.5"
                  style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)" }}>🤖</div>
              )}
              <div className={`rounded-[10px_10px_${msg.role === "user" ? "2px_10px" : "10px_2px"}] px-3 py-2.5 text-[13px] leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white"
                  : "text-white/85"
              }`} style={msg.role === "user"
                ? { background: "linear-gradient(135deg,#0891b2,#6366f1)" }
                : { background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.2)" }}>
                {msg.content}
                {msg.role === "assistant" && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => copyText(msg.content)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#0891b2]/30 hover:bg-[#0891b2]/50 text-[#22d3ee] transition-colors">Copy</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)" }}>🤖</div>
              <div className="rounded-[10px_10px_10px_2px] px-3 py-2.5"
                style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.2)" }}>
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-[#22d3ee]"
                      style={{ animation: `blink 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[rgba(8,145,178,0.1)] flex gap-2">
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about security, paste code, or type a URL to scan..."
            rows={2}
            className="flex-1 bg-white/4 border border-[rgba(8,145,178,0.15)] rounded-xl px-3 py-2.5 text-white text-[13px] outline-none resize-none focus:border-[#22d3ee] transition-colors placeholder-white/20" />
          <button onClick={() => sendMessage()} disabled={loading || !message.trim()}
            className="px-4 py-2 rounded-xl text-white font-bold text-base self-end transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)" }}>→</button>
        </div>
      </div>
    </PageShell>
  );
}
