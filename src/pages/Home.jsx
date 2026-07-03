import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function Home() {
  const navigate = useNavigate();
  const [operatorName, setOperatorName] = useState("");
  const [operatorLevel, setOperatorLevel] = useState("");
  const [operatorPurpose, setOperatorPurpose] = useState("");
  const [customCards, setCustomCards] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("cyberzero_onboarded")) navigate("/welcome");
    setOperatorName(localStorage.getItem("cyberzero_name") || "Operator");
    setOperatorLevel(localStorage.getItem("cyberzero_level") || "Unknown");
    setOperatorPurpose(localStorage.getItem("cyberzero_purpose") || "Unassigned");

    // Pull any admin-added feature tiles — new cards show up here instantly,
    // no app update needed.
    fetch(`${API_BASE}/cards`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCustomCards(
            data.cards.map((c) => ({
              name: c.name,
              path: c.link,
              icon: c.icon,
              desc: c.desc,
              bg: c.bg,
              accent: c.accent,
              external: /^https?:\/\//.test(c.link),
            }))
          );
        }
      })
      .catch(() => {});
  }, [navigate]);

  const cards = [
    { name: "Security Scanner",       path: "/scanner",    icon: "🛡️", desc: "Scan websites and apps for vulnerabilities.",         bg: "#1e40af", accent: "#60a5fa" },
    { name: "Technology Intelligence", path: "/technology", icon: "🔬", desc: "Detect framework footprints and system stacks.",       bg: "#065f46", accent: "#34d399" },
    { name: "Domain Intelligence",     path: "/domain",     icon: "🌐", desc: "WHOIS, DNS and domain risk analysis.",                 bg: "#1d4ed8", accent: "#93c5fd" },
    { name: "API Intelligence",        path: "/api",        icon: "🔌", desc: "Inspect endpoints, protocols and security rules.",     bg: "#4338ca", accent: "#a5b4fc" },
    { name: "System Management",       path: "/system",     icon: "⚙️", desc: "Manage runtime, resources and cluster state.",        bg: "#374151", accent: "#d1d5db" },
    { name: "AI Assistant",            path: "/ai",         icon: "🤖", desc: "Never Hide AI — neural security intelligence.",       bg: "#6d28d9", accent: "#c4b5fd" },
    { name: "Community",               path: "/community",  icon: "💬", desc: "Post questions, get answers from the network.",        bg: "#0369a1", accent: "#7dd3fc" },
    ...customCards,
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f0fdf4 70%, #faf5ff 100%)",
      fontFamily: "Inter, sans-serif",
      color: "#0f172a",
      padding: "0 0 40px",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Subtle grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(to right,rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.06) 1px,transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Soft color orbs */}
      <div style={{ position:"absolute", top:-80, left:"20%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, right:"10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", top:"40%", left:0, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.08),transparent 70%)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 1 }}>

        {/* ── Top Nav ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 0 18px", borderBottom:"1.5px solid rgba(99,102,241,0.15)", marginBottom:28
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:42, height:42, borderRadius:14,
              background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
              boxShadow:"0 4px 16px rgba(79,70,229,0.3)"
            }}>🛡️</div>
            <div>
              <div style={{ fontWeight:900, fontSize:18, letterSpacing:"-0.5px" }}>
                <span style={{ color:"#0f172a" }}>Secure</span>
                <span style={{ color:"#4f46e5" }}>Check AI</span>
              </div>
              <div style={{ fontSize:9, fontWeight:700, color:"#64748b", letterSpacing:3, textTransform:"uppercase", marginTop:-2 }}>Security Ops Command</div>
            </div>
          </div>
          <div style={{
            background:"rgba(16,185,129,0.1)", border:"1.5px solid rgba(16,185,129,0.3)",
            borderRadius:12, padding:"7px 14px", display:"flex", alignItems:"center", gap:8
          }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:10, fontWeight:800, color:"#059669", letterSpacing:2, textTransform:"uppercase" }}>System Active</span>
          </div>
        </div>

        {/* ── Operator Profile Panel ── */}
        <div style={{
          background:"#fff", border:"1.5px solid rgba(99,102,241,0.2)",
          borderRadius:24, padding:"24px 28px", marginBottom:24,
          boxShadow:"0 4px 32px rgba(99,102,241,0.1)",
          display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:20
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{
              width:60, height:60, borderRadius:18,
              background:"linear-gradient(135deg,#e0f2fe,#ede9fe)",
              border:"2px solid rgba(99,102,241,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:26
            }}>👤</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#0891b2", display:"inline-block" }} />
                <span style={{ fontSize:10, fontWeight:800, color:"#0891b2", letterSpacing:3, textTransform:"uppercase" }}>Authenticated Operator</span>
              </div>
              <div style={{ fontSize:26, fontWeight:900, color:"#0f172a", letterSpacing:-0.5 }}>
                Welcome back, <span style={{ background:"linear-gradient(90deg,#4f46e5,#0891b2)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{operatorName}</span>
              </div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:3 }}>Cyber-Zero Intelligence Platform is standing by.</div>
            </div>
          </div>

          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[
              { label:"Clearance Level", value: operatorLevel, color:"#4f46e5" },
              { label:"Primary Mission", value: operatorPurpose, color:"#7c3aed" },
              { label:"Network Status",  value: "Secure ✓", color:"#059669" },
            ].map((m, i) => (
              <div key={i} style={{
                background:"#f8fafc", border:"1.5px solid #e2e8f0",
                borderRadius:14, padding:"12px 18px", minWidth:130
              }}>
                <div style={{ fontSize:9, fontWeight:800, color:"#94a3b8", letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>{m.label}</div>
                <div style={{ fontWeight:900, color: m.color, fontSize:14 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <div style={{
          background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
          borderRadius:24, padding:"28px 32px", marginBottom:28,
          boxShadow:"0 8px 40px rgba(79,70,229,0.25)", color:"#fff", position:"relative", overflow:"hidden"
        }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-30, left:"30%", width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
              borderRadius:999, padding:"5px 14px", marginBottom:14
            }}>
              <span style={{ fontSize:10, fontWeight:800, letterSpacing:3, textTransform:"uppercase" }}>Central Intelligence Suite</span>
            </div>
            <div style={{ fontSize:36, fontWeight:900, letterSpacing:-1, lineHeight:1.15, marginBottom:10 }}>
              Cyber-Zero <span style={{ color:"#bfdbfe" }}>Developer Hub</span>
            </div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.8)", maxWidth:580 }}>
              Unified security workspaces for vulnerability assessment, technology footprint discovery, endpoint protection, and neural development guidance.
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14, marginBottom:28 }}>
          {[
            { label:"Modules Active", value:"8", color:"#4f46e5" },
            { label:"Scans Today",    value:"0", color:"#059669" },
            { label:"Threats Found",  value:"0", color:"#dc2626" },
            { label:"AI Queries",     value:"0", color:"#7c3aed" },
          ].map((s, i) => (
            <div key={i} style={{
              background:"#fff", border:"1.5px solid #e2e8f0",
              borderTop:`3px solid ${s.color}`,
              borderRadius:16, padding:"16px", textAlign:"center",
              boxShadow:"0 2px 12px rgba(0,0,0,0.05)"
            }}>
              <div style={{ fontSize:28, fontWeight:900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Module Cards ── */}
        <div style={{ marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:800, color:"#64748b", letterSpacing:3, textTransform:"uppercase", marginBottom:16 }}>Intelligence Modules</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14 }}>
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={() => (card.external ? window.open(card.path, "_blank") : navigate(card.path))}
                style={{
                  background: card.bg,
                  borderRadius:20, padding:"20px 16px",
                  cursor:"pointer", color:"#fff",
                  boxShadow:`0 4px 20px rgba(0,0,0,0.18)`,
                  transition:"transform 0.15s ease, box-shadow 0.15s ease",
                  border:`1px solid rgba(255,255,255,0.12)`,
                  position:"relative", overflow:"hidden"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.18)"; }}
                onTouchStart={e => { e.currentTarget.style.transform="scale(0.97)"; }}
                onTouchEnd={e => { e.currentTarget.style.transform="scale(1)"; }}
              >
                <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
                <div style={{ fontSize:28, marginBottom:10 }}>{card.icon}</div>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:5, lineHeight:1.3 }}>{card.name}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.72)", lineHeight:1.5 }}>{card.desc}</div>
                <div style={{
                  marginTop:14, display:"inline-flex", alignItems:"center", gap:4,
                  background:"rgba(255,255,255,0.15)", borderRadius:999,
                  padding:"4px 12px", fontSize:10, fontWeight:700
                }}>Open →</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        textAlign:"center", marginTop:48, padding:"20px 16px",
        borderTop:"1px solid rgba(99,102,241,0.1)", color:"#94a3b8", fontSize:12
      }}>
        <div style={{ fontWeight:700, color:"#64748b", marginBottom:4 }}>
          🛡️ SecureCheck AI · Built by <span style={{ color:"#4f46e5" }}>Suleiman Alhassan</span>
        </div>
        <div>📞 +233 599 931 348 &nbsp;|&nbsp; +233 248 503 631</div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}


