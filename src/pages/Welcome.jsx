import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/system`).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); setCanInstall(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setCanInstall(false);
  };

  const continueToPlatform = () => {
    if (!name || !level || !purpose) { alert("⚠️ Please fill all fields to continue."); return; }
    setIsConnecting(true);
    setTimeout(() => {
      localStorage.setItem("cyberzero_name", name);
      localStorage.setItem("cyberzero_level", level);
      localStorage.setItem("cyberzero_purpose", purpose);
      localStorage.setItem("cyberzero_onboarded", "true");
      navigate("/dashboard");
    }, 700);
  };

  const inputStyle = {
    width:"100%", background:"#f8fafc", border:"1.5px solid #e2e8f0",
    borderRadius:14, padding:"13px 16px", color:"#0f172a", fontSize:14,
    outline:"none", fontFamily:"inherit", boxSizing:"border-box",
    transition:"border-color 0.2s, box-shadow 0.2s"
  };

  const labelStyle = {
    display:"block", marginBottom:6, fontSize:10, fontWeight:800,
    color:"#64748b", letterSpacing:3, textTransform:"uppercase"
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f0fdf4 70%, #faf5ff 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, fontFamily:"Inter,sans-serif", position:"relative", overflow:"hidden"
    }}>

      {/* Orbs */}
      <div style={{ position:"absolute", top:-80, left:"20%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, right:"15%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)", pointerEvents:"none" }} />

      {/* Card */}
      <div style={{
        position:"relative", zIndex:1, width:"100%", maxWidth:480,
        background:"#fff", borderRadius:28,
        border:"1.5px solid rgba(99,102,241,0.2)",
        boxShadow:"0 20px 60px rgba(99,102,241,0.15)",
        overflow:"hidden"
      }}>
        {/* Top gradient strip */}
        <div style={{ height:5, background:"linear-gradient(90deg,#4f46e5,#7c3aed,#0891b2)" }} />

        <div style={{ padding:"36px 32px 32px" }}>
          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{
              width:64, height:64, borderRadius:20, margin:"0 auto 16px",
              background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:28, boxShadow:"0 8px 24px rgba(79,70,229,0.3)"
            }}>🛡️</div>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:6,
              background:"rgba(8,145,178,0.08)", border:"1px solid rgba(8,145,178,0.2)",
              borderRadius:999, padding:"5px 14px", marginBottom:12
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#0891b2", display:"inline-block", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:10, fontWeight:800, color:"#0891b2", letterSpacing:3, textTransform:"uppercase" }}>System Link Established</span>
            </div>
            <div style={{ fontSize:26, fontWeight:900, color:"#0f172a", letterSpacing:-0.5 }}>
              Operator <span style={{ background:"linear-gradient(90deg,#4f46e5,#0891b2)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Initialization</span>
            </div>
            <div style={{ fontSize:13, color:"#64748b", marginTop:6 }}>Configure your environment to access the intelligence matrix.</div>
          </div>

          {/* Fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={labelStyle}>1. Operator Alias</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your system identifier..."
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor="#4f46e5"; e.target.style.boxShadow="0 0 0 3px rgba(79,70,229,0.1)"; }}
                onBlur={e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>2. Clearance Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                style={{ ...inputStyle, appearance:"none", cursor:"pointer" }}
                onFocus={e => { e.target.style.borderColor="#7c3aed"; e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.1)"; }}
                onBlur={e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }}
              >
                <option value="" disabled>Select clearance level</option>
                <option value="Novice">Level 1 — Novice</option>
                <option value="Intermediate">Level 2 — Intermediate</option>
                <option value="Elite">Level 3 — Elite</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>3. Deployment Vector</label>
              <select
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                style={{ ...inputStyle, appearance:"none", cursor:"pointer" }}
                onFocus={e => { e.target.style.borderColor="#0891b2"; e.target.style.boxShadow="0 0 0 3px rgba(8,145,178,0.1)"; }}
                onBlur={e => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; }}
              >
                <option value="" disabled>Select primary objective</option>
                <option value="Development">Software Engineering</option>
                <option value="Education">Cybersecurity Education</option>
                <option value="Research">Vulnerability Research</option>
                <option value="Enterprise">Enterprise Security Auditing</option>
              </select>
            </div>

            <button
              onClick={continueToPlatform}
              disabled={isConnecting}
              style={{
                width:"100%", padding:"14px",
                background: isConnecting ? "#e2e8f0" : "linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
                border:"none", borderRadius:14, color: isConnecting ? "#94a3b8" : "#fff",
                fontWeight:800, fontSize:14, letterSpacing:1.5, textTransform:"uppercase",
                cursor: isConnecting ? "default" : "pointer",
                boxShadow: isConnecting ? "none" : "0 4px 20px rgba(79,70,229,0.35)",
                transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8
              }}
            >
              {isConnecting ? (
                <>
                  <span style={{ width:16, height:16, border:"2px solid #94a3b8", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
                  Mounting Core...
                </>
              ) : "Authenticate & Enter Engine"}
            </button>

            {canInstall && (
              <button onClick={installApp} style={{
                width:"100%", padding:"11px",
                background:"rgba(16,185,129,0.08)", border:"1.5px solid rgba(16,185,129,0.3)",
                borderRadius:14, color:"#059669", fontWeight:700, fontSize:13,
                cursor:"pointer", textTransform:"uppercase", letterSpacing:1
              }}>📲 Install App (PWA)</button>
            )}
          </div>
        </div>

        <div style={{
          background:"#f8fafc", borderTop:"1px solid #f1f5f9",
          padding:"14px 32px", textAlign:"center", fontSize:11, color:"#94a3b8"
        }}>
          🛡️ SecureCheck AI · Built by <span style={{ color:"#4f46e5", fontWeight:700 }}>Suleiman Alhassan</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin  { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #94a3b8 !important; }
        select option { color: #0f172a; background: #fff; }
      `}</style>
    </div>
  );
}
