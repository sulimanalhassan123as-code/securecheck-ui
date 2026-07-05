import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, getCurrentUser } from "../utils/auth";

// Google blocks OAuth sign-in inside "embedded" browsers (WhatsApp, Instagram,
// Facebook, TikTok, Line, WeChat in-app viewers) with error 403: disallowed_useragent.
// We can't override that — it's enforced by Google — but we CAN detect it and tell
// people exactly how to fix it before they hit the confusing Google error page.
function detectInAppBrowser() {
  const ua = navigator.userAgent || "";
  const markers = [
    { test: /FBAN|FBAV/i,        name: "Facebook" },
    { test: /Instagram/i,        name: "Instagram" },
    { test: /Line\//i,           name: "LINE" },
    { test: /MicroMessenger/i,   name: "WeChat" },
    { test: /TikTok|musical_ly/i, name: "TikTok" },
    { test: /WhatsApp/i,         name: "WhatsApp" },
    { test: /Telegram/i,         name: "Telegram" },
    { test: /Twitter/i,          name: "Twitter/X" },
    { test: /Snapchat/i,         name: "Snapchat" },
    { test: /Pinterest/i,        name: "Pinterest" },
    { test: /; wv\)/i,           name: "an in-app" }, // generic Android WebView marker (covers Telegram/others without a specific token)
  ];
  for (const m of markers) {
    if (m.test.test(ua)) return m.name;
  }
  return null;
}

const API_BASE = import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [inAppBrowserName, setInAppBrowserName] = useState(null);

  useEffect(() => {
    setInAppBrowserName(detectInAppBrowser());
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/system`).catch(() => {});
  }, []);

  useEffect(() => {
    const u = getCurrentUser();
    if (u) {
      setGoogleUser(u);
      setName((prev) => prev || u.name);
    }
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

  const continueWithGoogle = () => {
    signInWithGoogle("/welcome");
  };

  const continueToPlatform = () => {
    if (!name || !level || !purpose) { alert("⚠️ Please fill all fields to continue."); return; }
    setIsConnecting(true);
    setTimeout(() => {
      localStorage.setItem("cyberzero_name", name);
      localStorage.setItem("cyberzero_level", level);
      localStorage.setItem("cyberzero_purpose", purpose);
      localStorage.setItem("cyberzero_onboarded", "true");
      if (googleUser) {
        localStorage.setItem("cyberzero_google_email", googleUser.email || "");
      }
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

          {/* In-app browser warning — Google blocks OAuth sign-in here */}
          {inAppBrowserName && !googleUser && (
            <div style={{
              background:"rgba(245,158,11,0.1)", border:"1.5px solid rgba(245,158,11,0.3)",
              borderRadius:14, padding:"12px 14px", marginBottom:18, fontSize:12, color:"#92400e", lineHeight:1.5
            }}>
              <strong>⚠️ You're inside {inAppBrowserName}'s built-in browser.</strong><br/>
              Google blocks sign-in from in-app browsers for security. Tap the <strong>⋮ menu</strong> (or share icon) above and choose <strong>"Open in Chrome"</strong> or <strong>"Open in Safari"</strong> — then sign in there.
            </div>
          )}

          {/* Fields */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {googleUser ? (
              <div style={{
                display:"flex", alignItems:"center", gap:10,
                background:"rgba(16,185,129,0.08)", border:"1.5px solid rgba(16,185,129,0.25)",
                borderRadius:14, padding:"10px 14px"
              }}>
                {googleUser.avatarUrl && (
                  <img src={googleUser.avatarUrl} alt="" style={{ width:32, height:32, borderRadius:"50%" }} />
                )}
                <div style={{ fontSize:12, color:"#065f46" }}>
                  Signed in as <strong>{googleUser.name}</strong>
                </div>
              </div>
            ) : (
              <button
                onClick={continueWithGoogle}
                disabled={!!inAppBrowserName}
                title={inAppBrowserName ? "Open this page in Chrome/Safari first — Google blocks sign-in inside in-app browsers." : undefined}
                style={{
                  width:"100%", padding:"12px", display:"flex", alignItems:"center",
                  justifyContent:"center", gap:10, background: inAppBrowserName ? "#f1f5f9" : "#fff",
                  border:"1.5px solid #e2e8f0", borderRadius:14,
                  cursor: inAppBrowserName ? "not-allowed" : "pointer",
                  opacity: inAppBrowserName ? 0.55 : 1,
                  fontWeight:700, fontSize:13, color:"#0f172a"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.1-5.1C33.6 6.1 29.1 4.4 24 4.4 12.9 4.4 4 13.3 4 24.4s8.9 20 20 20c11.5 0 19.1-8.1 19.1-19.5 0-1.4-.1-2.5-.5-4.4z"/>
                  <path fill="#FF3D00" d="M6.3 14.6l6.6 4.8C14.6 15.7 18.9 12.4 24 12.4c3.1 0 5.8 1.1 8 3l5.1-5.1C33.6 6.1 29.1 4.4 24 4.4c-7.5 0-14 4.3-17.7 10.2z"/>
                  <path fill="#4CAF50" d="M24 44.4c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.5 2.1-7 2.1-5.2 0-9.6-3.4-11.2-8H6.5v5.2C10.2 40 16.6 44.4 24 44.4z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.2-2.2 4.1-4 5.4l6 5c-.4.4 6.7-4.9 6.7-14.9 0-1.4-.1-2.5-.4-3.6z"/>
                </svg>
                Sign in with Google
              </button>
            )}

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

