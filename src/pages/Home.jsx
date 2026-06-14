import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const MODULES = [
  { path: "/scanner",    icon: "🛡️", name: "Security Scanner",       desc: "Scan for vulnerabilities & headers",      bg: "#0c2a36", glow: "#0891b2" },
  { path: "/technology", icon: "🔬", name: "Tech Intelligence",       desc: "Detect frameworks & architecture stacks", bg: "#0b2520", glow: "#10b981" },
  { path: "/domain",     icon: "🌐", name: "Domain Intelligence",     desc: "WHOIS, DNS & domain risk analysis",       bg: "#0d1a3a", glow: "#3b82f6" },
  { path: "/api",        icon: "🔌", name: "API Intelligence",        desc: "Inspect endpoints & security rules",      bg: "#1a0d3a", glow: "#7c3aed" },
  { path: "/payment",    icon: "💳", name: "Payment Lab",             desc: "Test payment configs — sandbox only",    bg: "#2a0d20", glow: "#be185d" },
  { path: "/system",     icon: "⚙️", name: "System Management",       desc: "Runtime, resources & cluster state",     bg: "#2a1a0d", glow: "#d97706" },
  { path: "/ai",         icon: "🤖", name: "AI Assistant",            desc: "Groq Llama 3.3 — security intelligence", bg: "#0d2a1a", glow: "#059669" },
  { path: "/community",  icon: "💬", name: "Community",               desc: "Post questions, get admin answers",      bg: "#1a0d2a", glow: "#8b5cf6" },
  { path: "/help",       icon: "📞", name: "Help & Contact",          desc: "WhatsApp support lines",                 bg: "#0d2a10", glow: "#22c55e" },
];

export default function Home() {
  const navigate = useNavigate();
  const [opName, setOpName] = useState("Operator");
  const [opLevel, setOpLevel] = useState("—");
  const [opPurpose, setOpPurpose] = useState("—");

  useEffect(() => {
    if (!localStorage.getItem("cyberzero_onboarded")) navigate("/welcome");
    setOpName(localStorage.getItem("cyberzero_name") || "Operator");
    setOpLevel(localStorage.getItem("cyberzero_level") || "—");
    setOpPurpose(localStorage.getItem("cyberzero_purpose") || "—");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#030f1a] text-white flex flex-col">
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{ backgroundImage: "linear-gradient(to right,#1e3a4a 1px,transparent 1px),linear-gradient(to bottom,#1e3a4a 1px,transparent 1px)", backgroundSize: "3.5rem 3.5rem" }} />

      {/* Top bar */}
      <div className="topbar-gradient sticky top-0 z-50 px-4 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)" }}>🛡️</div>
          <span className="font-black text-[15px]"><span className="text-[#22d3ee]">Secure</span>Check AI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-green-400 border border-green-400/20 bg-green-400/8 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />LIVE
          </div>
          <button onClick={() => { localStorage.clear(); navigate("/welcome"); }}
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors px-2">Logout</button>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 max-w-3xl mx-auto w-full relative z-10">
        {/* Operator card */}
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap"
          style={{ background: "linear-gradient(135deg,rgba(8,145,178,0.1),rgba(99,102,241,0.07))", border: "1px solid rgba(8,145,178,0.2)" }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)" }}>👤</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-[#22d3ee] tracking-widest uppercase mb-0.5">● Authenticated Operator</div>
            <div className="text-[18px] font-black truncate">Welcome back, <span className="text-[#22d3ee]">{opName}</span></div>
            <div className="text-[11px] text-white/40 mt-0.5">Cyber-Zero Intelligence Platform is standing by</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ val: opLevel, lbl: "Clearance" }, { val: opPurpose, lbl: "Mission" }, { val: "SECURE", lbl: "Network", green: true }].map(s => (
              <div key={s.lbl} className="bg-white/4 border border-white/7 rounded-xl p-2.5 text-center min-w-[80px]">
                <div className={`text-[13px] font-black ${s.green ? "text-green-400" : "text-[#22d3ee]"}`}>{s.val}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-wide mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="text-[11px] font-bold text-white/30 tracking-[2px] uppercase mb-3">Intelligence Modules</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {MODULES.map(m => (
            <Link key={m.path} to={m.path}
              className="module-card no-underline"
              style={{ "--glow": m.glow }}>
              <div className="module-card-inner" style={{ "--card-bg": m.bg }}>
                <span className="text-[22px]">{m.icon}</span>
                <div className="text-[13px] font-black text-white leading-tight">{m.name}</div>
                <div className="text-[10px] text-white/40 leading-relaxed">{m.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-white/25 border-t border-white/5 pt-4 mt-2">
          🛡 <strong className="text-white/40">SecureCheck AI</strong> · Built by{" "}
          <strong className="text-[#22d3ee]">Suleiman Alhassan</strong><br />
          <div className="flex gap-4 justify-center mt-2 flex-wrap">
            <a href="https://wa.me/233599931348" target="_blank" rel="noreferrer" className="text-green-400 no-underline text-[11px]">📱 +233 599 931 348</a>
            <a href="https://wa.me/233248503631" target="_blank" rel="noreferrer" className="text-green-400 no-underline text-[11px]">📱 +233 248 503 631</a>
          </div>
        </div>
      </div>
    </div>
  );
}
