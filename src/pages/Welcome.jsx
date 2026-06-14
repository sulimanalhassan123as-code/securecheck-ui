import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [engineOnline, setEngineOnline] = useState(false);
  const [greeterText, setGreeterText] = useState("");
  const beamsRef = useRef(null);
  const greeterDone = useRef(false);

  // Redirect if already onboarded
  useEffect(() => {
    if (localStorage.getItem("cyberzero_onboarded")) navigate("/");
  }, [navigate]);

  // Ping Render to wake engine
  useEffect(() => {
    const ping = () => {
      fetch(API_BASE.replace("/api", "/"))
        .then(() => setEngineOnline(true))
        .catch(() => setTimeout(ping, 8000));
    };
    ping();
  }, []);

  // Login searchlight beams
  useEffect(() => {
    const container = beamsRef.current;
    if (!container) return;
    const positions = [5, 15, 25, 38, 50, 62, 72, 82, 92];
    positions.forEach((pos, i) => {
      const b = document.createElement("div");
      b.className = "login-beam";
      const rot = (i % 2 === 0 ? -1 : 1) * (2 + i * 1.5);
      b.style.cssText = `left:${pos}%;--bd:${3 + i * 0.3}s;--bdelay:${i * 0.28}s;--br:${rot}deg;`;
      container.appendChild(b);
    });
  }, []);

  // Typewriter greeter
  useEffect(() => {
    if (greeterDone.current) return;
    greeterDone.current = true;
    const returning = localStorage.getItem("cyberzero_name");
    const msg = returning
      ? `Welcome back, ${returning}! 👋 Cyber-Zero is ready. What are you working on today?`
      : "🛡 Cyber-Zero Intelligence Platform online. Configure your operator profile below to access the hub.";
    let i = 0;
    const t = setInterval(() => {
      setGreeterText(msg.slice(0, ++i));
      if (i >= msg.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, []);

  // Pre-fill for returning user
  useEffect(() => {
    const n = localStorage.getItem("cyberzero_name");
    const l = localStorage.getItem("cyberzero_level");
    const p = localStorage.getItem("cyberzero_purpose");
    if (n) setName(n);
    if (l) setLevel(l);
    if (p) setPurpose(p);
  }, []);

  const enter = () => {
    if (!name.trim() || !level || !purpose) {
      alert("Please fill all fields to continue.");
      return;
    }
    setConnecting(true);
    localStorage.setItem("cyberzero_name", name.trim());
    localStorage.setItem("cyberzero_level", level);
    localStorage.setItem("cyberzero_purpose", purpose);
    localStorage.setItem("cyberzero_onboarded", "true");
    // Track session
    const sessions = JSON.parse(localStorage.getItem("czSessions") || "[]");
    sessions.unshift({
      name: name.trim(), level,
      device: /Mobi/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      browser: getBrowser(),
      time: new Date().toLocaleTimeString(),
      section: "Home",
    });
    localStorage.setItem("czSessions", JSON.stringify(sessions.slice(0, 20)));
    pushNotif(`🟢 ${name.trim()} entered the platform`);
    setTimeout(() => navigate("/"), 700);
  };

  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Browser";
  }

  function pushNotif(msg) {
    const n = JSON.parse(localStorage.getItem("czNotifs") || "[]");
    n.unshift({ msg, time: new Date().toLocaleTimeString() });
    localStorage.setItem("czNotifs", JSON.stringify(n.slice(0, 50)));
  }

  return (
    <div className="min-h-screen bg-[#030f1a] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Searchlight beams */}
      <div ref={beamsRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />
      {/* Ambient orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "#0891b2", filter: "blur(90px)", opacity: 0.1, animation: "orbpulse 6s ease-in-out infinite" }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{ background: "#6366f1", filter: "blur(80px)", opacity: 0.1, animation: "orbpulse 6s ease-in-out infinite 3s" }} />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="rounded-[26px] p-[34px_28px_28px] border border-[rgba(8,180,220,0.22)]"
          style={{ background: "rgba(3,12,24,0.94)", backdropFilter: "blur(16px)", boxShadow: "0 0 80px rgba(8,145,178,0.1), 0 30px 60px rgba(0,0,0,0.6)" }}>

          {/* Shield icon */}
          <div className="flex justify-center mb-5">
            <div className="w-[68px] h-[68px] rounded-[18px] flex items-center justify-center text-[28px] relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)", boxShadow: "0 0 28px rgba(8,145,178,0.45), 0 0 60px rgba(8,145,178,0.12)" }}>
              🛡️
              <div className="absolute top-0 left-0 w-full h-[3px]"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)", animation: "scanline 2.2s ease-in-out infinite" }} />
            </div>
          </div>

          <div className="text-[22px] font-black text-center mb-1">
            <span className="text-[#22d3ee]">Secure</span>Check AI
          </div>
          <div className="text-[10px] text-center tracking-[2.5px] text-white/30 mb-5">
            CYBER-ZERO DEVELOPER HUB
          </div>

          {/* AI greeter */}
          <div className="rounded-xl p-3 mb-4 border border-[rgba(8,180,220,0.18)] text-[12px] leading-[1.8] min-h-[46px]"
            style={{ background: "rgba(0,0,0,0.35)", color: "#22d3ee", fontFamily: "Courier New, monospace" }}>
            &gt; {greeterText}<span className="animate-pulse">▌</span>
          </div>

          {/* Engine status */}
          <div className="flex items-center gap-2 text-[11px] text-white/35 rounded-lg p-2 mb-4 border border-white/5"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${engineOnline ? "bg-green-400" : "bg-yellow-400"}`}
              style={{ animation: engineOnline ? "none" : "blink 1s infinite" }} />
            {engineOnline ? "Engine online ✓" : "Waking up SecureCheck engine..."}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-white/6" />
            <span className="text-[10px] text-white/25 tracking-widest uppercase">Operator Profile</span>
            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* Fields */}
          {[
            { label: "👤 Operator Alias", type: "text", val: name, set: setName, ph: "Enter your name..." },
          ].map(({ label, type, val, set, ph }) => (
            <div key={label} className="mb-3">
              <label className="block text-[10px] font-bold text-white/35 tracking-[1.5px] uppercase mb-1.5">{label}</label>
              <input type={type} value={val} onChange={e => set(e.target.value)}
                placeholder={ph}
                className="w-full bg-white/4 border border-[rgba(8,145,178,0.16)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] focus:bg-[rgba(8,180,220,0.05)] focus:shadow-[0_0_0_3px_rgba(8,180,220,0.1)] transition-all placeholder-white/20" />
            </div>
          ))}
          <div className="mb-3">
            <label className="block text-[10px] font-bold text-white/35 tracking-[1.5px] uppercase mb-1.5">🔰 Clearance Level</label>
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="w-full bg-white/4 border border-[rgba(8,145,178,0.16)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-all appearance-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <option value="" disabled>Select clearance level</option>
              <option value="Novice">Level 1 — Novice</option>
              <option value="Intermediate">Level 2 — Intermediate</option>
              <option value="Elite">Level 3 — Elite</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-[10px] font-bold text-white/35 tracking-[1.5px] uppercase mb-1.5">🎯 Deployment Purpose</label>
            <select value={purpose} onChange={e => setPurpose(e.target.value)}
              className="w-full bg-white/4 border border-[rgba(8,145,178,0.16)] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#22d3ee] transition-all appearance-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <option value="" disabled>Select primary objective</option>
              <option value="Development">Software Engineering</option>
              <option value="Security Research">Security Research</option>
              <option value="Education">Cybersecurity Education</option>
              <option value="Enterprise Audit">Enterprise Auditing</option>
            </select>
          </div>

          <button onClick={enter} disabled={connecting}
            className="w-full py-4 rounded-[13px] text-white text-[15px] font-black tracking-wide relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#0891b2,#6366f1)", boxShadow: "0 4px 24px rgba(8,145,178,0.35)", animation: "none" }}>
            <span className="relative z-10">{connecting ? "⚡ Mounting Core..." : "⚡ Authenticate & Enter Engine"}</span>
            <div className="absolute top-[-50%] left-[-60%] w-[40%] h-[200%] pointer-events-none"
              style={{ background: "rgba(255,255,255,0.1)", transform: "skewX(-20deg)", animation: "btnshine 3s ease-in-out infinite" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
