import { useNavigate } from "react-router-dom";

const features = [
  { icon: "🛡️", title: "Security Scanner", desc: "Deep vulnerability scanning with real HTTP header analysis. Get a security score for any website instantly." },
  { icon: "🔬", title: "Tech Intelligence", desc: "Detect what framework, CMS, CDN or database any website is running — without touching their code." },
  { icon: "🌐", title: "Domain Intelligence", desc: "Full WHOIS, DNS record lookup, SSL certificate check and domain risk analysis in one click." },
  { icon: "🔌", title: "API Intelligence", desc: "Inspect API endpoints, detect exposed routes and map security rules of any web service." },
  { icon: "🤖", title: "AI Assistant", desc: "Ask Cyber-Zero anything about security. Paste code, paste a URL — get expert analysis powered by Groq Llama 3.3." },
  { icon: "💳", title: "Payment Lab", desc: "Test payment gateway configurations and compliance settings in a safe sandbox environment." },
];

const steps = [
  { n: "01", title: "Create your operator profile", desc: "Set your alias and clearance level. Takes 20 seconds." },
  { n: "02", title: "Choose a module", desc: "Pick any intelligence module from the dashboard." },
  { n: "03", title: "Enter a target URL", desc: "Paste any website URL and hit scan." },
  { n: "04", title: "Read the report", desc: "Get a detailed security score, findings, and exact fix recommendations." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight:"100vh", fontFamily:"Inter,sans-serif", color:"#0f172a",
      background:"linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 40%,#f0fdf4 70%,#faf5ff 100%)",
      overflowX:"hidden"
    }}>

      {/* ── NAV ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.85)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(99,102,241,0.12)",
        padding:"0 24px", height:60,
        display:"flex", alignItems:"center", justifyContent:"space-between"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18
          }}>🛡️</div>
          <div style={{ fontWeight:900, fontSize:17 }}>
            <span style={{ color:"#0f172a" }}>Secure</span>
            <span style={{ color:"#4f46e5" }}>Check AI</span>
          </div>
        </div>
        <button onClick={() => navigate("/welcome")} style={{
          background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
          border:"none", borderRadius:12, padding:"9px 22px",
          color:"#fff", fontWeight:800, fontSize:13, cursor:"pointer",
          boxShadow:"0 4px 16px rgba(79,70,229,0.3)"
        }}>Launch App →</button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        maxWidth:900, margin:"0 auto", padding:"72px 24px 60px", textAlign:"center"
      }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:"rgba(79,70,229,0.08)", border:"1px solid rgba(79,70,229,0.2)",
          borderRadius:999, padding:"6px 18px", marginBottom:24
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:11, fontWeight:800, color:"#4f46e5", letterSpacing:2, textTransform:"uppercase" }}>Free Developer Tool · No Login Required to Try</span>
        </div>

        <h1 style={{
          fontSize:"clamp(36px,7vw,68px)", fontWeight:900, lineHeight:1.1,
          letterSpacing:-2, marginBottom:20, color:"#0f172a"
        }}>
          The Cybersecurity<br />
          <span style={{ background:"linear-gradient(90deg,#4f46e5,#7c3aed,#0891b2)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Intelligence Platform
          </span><br />
          Built for Developers
        </h1>

        <p style={{
          fontSize:18, color:"#475569", maxWidth:600, margin:"0 auto 36px",
          lineHeight:1.7
        }}>
          Scan any website for vulnerabilities, detect tech stacks, analyze domains,
          and get AI-powered security recommendations — all in one place.
        </p>

        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={() => navigate("/welcome")} style={{
            background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
            border:"none", borderRadius:16, padding:"16px 36px",
            color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer",
            boxShadow:"0 8px 32px rgba(79,70,229,0.35)", letterSpacing:0.5
          }}>Start Scanning Free →</button>
          <button onClick={() => navigate("/welcome")} style={{
            background:"rgba(255,255,255,0.8)", border:"1.5px solid rgba(99,102,241,0.25)",
            borderRadius:16, padding:"16px 36px",
            color:"#4f46e5", fontWeight:800, fontSize:16, cursor:"pointer"
          }}>View Demo</button>
        </div>

        {/* Social proof bar */}
        <div style={{
          marginTop:48, display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap"
        }}>
          {[
            { value:"100/100", label:"Max Security Score" },
            { value:"8",       label:"Intelligence Modules" },
            { value:"Free",    label:"No Credit Card" },
            { value:"AI",      label:"Powered by Groq" },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:"#4f46e5" }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        background:"#fff", padding:"72px 24px",
        borderTop:"1px solid rgba(99,102,241,0.08)",
        borderBottom:"1px solid rgba(99,102,241,0.08)"
      }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#4f46e5", letterSpacing:3, textTransform:"uppercase", marginBottom:12 }}>What It Does</div>
            <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"#0f172a", letterSpacing:-1, margin:0 }}>
              Every tool a security developer needs
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
            {features.map((f,i) => (
              <div key={i} style={{
                background:"#f8fafc", border:"1.5px solid #e2e8f0",
                borderRadius:20, padding:"24px",
                transition:"box-shadow 0.2s, transform 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 32px rgba(79,70,229,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="none"; }}
              >
                <div style={{ fontSize:32, marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontWeight:800, fontSize:16, marginBottom:8, color:"#0f172a" }}>{f.title}</div>
                <div style={{ fontSize:13, color:"#64748b", lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"72px 24px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#4f46e5", letterSpacing:3, textTransform:"uppercase", marginBottom:12 }}>How It Works</div>
            <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"#0f172a", letterSpacing:-1, margin:0 }}>
              From zero to security report in 60 seconds
            </h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {steps.map((s,i) => (
              <div key={i} style={{
                display:"flex", alignItems:"flex-start", gap:20,
                background:"#fff", border:"1.5px solid #e2e8f0",
                borderRadius:20, padding:"22px 24px"
              }}>
                <div style={{
                  width:48, height:48, flexShrink:0, borderRadius:14,
                  background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:900, fontSize:14, color:"#fff"
                }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:16, marginBottom:5, color:"#0f172a" }}>{s.title}</div>
                  <div style={{ fontSize:13, color:"#64748b" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background:"linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)",
        padding:"72px 24px", textAlign:"center", color:"#fff"
      }}>
        <h2 style={{ fontSize:"clamp(28px,5vw,48px)", fontWeight:900, letterSpacing:-1, margin:"0 0 16px" }}>
          Ready to scan your first website?
        </h2>
        <p style={{ fontSize:16, color:"rgba(255,255,255,0.8)", marginBottom:36 }}>
          Free. No account needed. Results in seconds.
        </p>
        <button onClick={() => navigate("/welcome")} style={{
          background:"#fff", border:"none", borderRadius:16,
          padding:"16px 48px", color:"#4f46e5",
          fontWeight:900, fontSize:16, cursor:"pointer",
          boxShadow:"0 8px 32px rgba(0,0,0,0.2)"
        }}>Launch SecureCheck AI →</button>
        <div style={{ marginTop:24, fontSize:13, color:"rgba(255,255,255,0.6)" }}>
          Built by Suleiman Alhassan · +233 599 931 348
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
