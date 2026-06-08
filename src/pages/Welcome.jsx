import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

export default function Welcome() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  
  // PWA Installation States
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  // Ping backend to wake up sleeping instances
  useEffect(() => {
    fetch(`${API_BASE}/system`).catch(() => {});
  }, []);

  // Capture the PWA Install Prompt
  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
      // Update UI notify the user they can install the PWA
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installCyberZero = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choice = await installPrompt.userChoice;
    
    if (choice.outcome === "accepted") {
      setCanInstall(false); // Hide button if they accepted
    }
  };

  const continueToPlatform = () => {
    if (!name || !level || !purpose) {
      alert("⚠️ Operator initialization incomplete. Please fill all fields.");
      return;
    }

    setIsConnecting(true);

    // Simulated terminal connection delay for premium UX
    setTimeout(() => {
      localStorage.setItem("cyberzero_name", name);
      localStorage.setItem("cyberzero_level", level);
      localStorage.setItem("cyberzero_purpose", purpose);
      localStorage.setItem("cyberzero_onboarded", "true");
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0f1626] bg-gradient-to-tr from-[#0b0f19] via-[#131b30] to-[#0b0f19] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">

      {/* Dynamic Cybersecurity Digital Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Amplified High-Visibility Neon Environmental Ambient Lights */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/10 to-indigo-600/0 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/10 to-blue-600/0 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Glassmorphism Authentication Panel */}
      <div className="relative z-10 w-full max-w-xl">

        {/* Top Radar Scanner Decoration */}
        <div className="flex justify-center -mb-8 relative z-20">
          <div className="w-16 h-16 bg-[#0c1222] border border-slate-700 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/10 opacity-50 animate-pulse" />
            <span className="text-2xl relative z-10">🛡️</span>
            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="bg-[#141d31]/95 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] pt-12 pb-8 px-8 sm:px-10 shadow-2xl shadow-black/40">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-sm shadow-cyan-400" />
              <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-widest uppercase">System Link Established</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Operator <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Initialization</span>
            </h1>

            <p className="text-slate-400 text-sm font-medium">
              Configure your Cyber-Zero environmental variables to access the intelligence matrix.
            </p>
          </div>

          <div className="space-y-5">

            {/* Input: Operator Alias */}
            <div className="group">
              <label className="block mb-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
                1. Operator Alias
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your system identifier..."
                className="w-full bg-[#0c1222] text-white border border-slate-700/60 rounded-xl p-3.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner placeholder-slate-600 font-mono text-sm"
              />
            </div>

            {/* Input: Experience Level */}
            <div className="group">
              <label className="block mb-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
                2. Clearance Level
              </label>
              <div className="relative">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-[#0c1222] text-white border border-slate-700/60 rounded-xl p-3.5 appearance-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-inner font-mono text-sm cursor-pointer"
                >
                  <option value="" disabled>Select technical proficiency</option>
                  <option value="Beginner">Level 1 - Novice / Beginner</option>
                  <option value="Intermediate">Level 2 - Standard / Intermediate</option>
                  <option value="Advanced">Level 3 - Elite / Advanced</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Input: Deployment Purpose */}
            <div className="group">
              <label className="block mb-1.5 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-purple-400 transition-colors">
                3. Deployment Vector
              </label>
              <div className="relative">
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-[#0c1222] text-white border border-slate-700/60 rounded-xl p-3.5 appearance-none focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all shadow-inner font-mono text-sm cursor-pointer"
                >
                  <option value="" disabled>Select primary objective</option>
                  <option value="Developer">Software Engineering & Development</option>
                  <option value="Student">Cybersecurity Education</option>
                  <option value="Researcher">Vulnerability Research</option>
                  <option value="Business">Enterprise Security Auditing</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Action Triggers Grid */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={continueToPlatform}
                disabled={isConnecting}
                className={`w-full relative overflow-hidden rounded-xl py-4 font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                  isConnecting
                    ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                    : "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-white/10 active:scale-[0.98]"
                }`}
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Mounting Core...
                  </span>
                ) : (
                  "Authenticate & Enter Engine"
                )}
              </button>

              {/* Dynamic PWA Installation Button */}
              {canInstall && (
                <button
                  onClick={installCyberZero}
                  className="w-full relative overflow-hidden rounded-xl py-3 font-bold text-xs tracking-widest uppercase transition-all duration-300 bg-[#0c1222] text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span className="text-lg">📱</span> Install Native Application
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Decorative Terminal Footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] font-mono text-slate-500 tracking-widest">
            SECURECHECK OS // ENCRYPTED HANDSHAKE // v2.0
          </p>
        </div>

      </div>

      {/* Global CSS for the Radar Scanner line */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(64px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
