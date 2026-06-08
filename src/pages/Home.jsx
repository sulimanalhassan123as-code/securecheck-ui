import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardStatus from "../components/DashboardStatus";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  // Operator State Variables
  const [operatorName, setOperatorName] = useState("");
  const [operatorLevel, setOperatorLevel] = useState("");
  const [operatorPurpose, setOperatorPurpose] = useState("");

  useEffect(() => {
    const onboarded = localStorage.getItem("cyberzero_onboarded");

    if (!onboarded) {
      navigate("/welcome");
    }

    // Hydrate state with initialized operator data
    setOperatorName(localStorage.getItem("cyberzero_name") || "Operator");
    setOperatorLevel(localStorage.getItem("cyberzero_level") || "Unknown");
    setOperatorPurpose(localStorage.getItem("cyberzero_purpose") || "Unassigned");
  }, [navigate]);

  const cards = [
    { name: "Security Scanner", path: "/scanner", icon: "🛡️", desc: "Scan websites and applications for vulnerabilities.", accent: "cyan" },
    { name: "Technology Intelligence", path: "/technology", icon: "🔬", desc: "Detect framework footprints and system architecture stacks.", accent: "cyan" },
    { name: "Domain Intelligence", path: "/domain", icon: "🌐", desc: "Examine domain parameters and deep DNS intelligence mapping.", accent: "cyan" },
    { name: "API Intelligence", path: "/api", icon: "🔌", desc: "Inspect interface endpoints, protocols, and security rules.", accent: "indigo" },
    { name: "Payment Lab", path: "/payment", icon: "💳", desc: "Test processing configurations and compliance channels.", accent: "emerald" },
    { name: "System Management", path: "/system", icon: "⚙️", desc: "Manage host runtime, resource allocation, and cluster state.", accent: "slate" },
    { name: "AI Assistant", path: "/ai", icon: "🤖", desc: "Access real-time, neural guided security auditing directives.", accent: "purple" }
  ];

  return (
    <div className="min-h-screen bg-[#0f1626] bg-gradient-to-tr from-[#0b0f19] via-[#131b30] to-[#0b0f19] text-white p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">

      {/* Dynamic Cybersecurity Digital Grid Overlay Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Amplified High-Visibility Neon Environmental Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/20 to-indigo-600/0 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 to-blue-600/0 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* Tactical Navigation Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/60 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/10">
              <span className="text-lg">🛡️</span>
            </div>
            <div>
              <div className="font-black text-lg tracking-tight">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Secure</span>
                <span className="text-cyan-400">Check AI</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-widest -mt-0.5 uppercase">Security Ops Command</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#172237]/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider uppercase">System Active</span>
            </div>
          </div>
        </div>

        {/* 🔥 NEW UPGRADED OPERATOR PROFILE PANEL 🔥 */}
        <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-r from-cyan-500/30 via-blue-500/10 to-purple-500/30 shadow-2xl shadow-cyan-500/10">
          <div className="bg-[#141d31]/95 backdrop-blur-xl rounded-[calc(2rem-1px)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800/50">
            
            {/* Identity Block */}
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-[#0c1222] border border-cyan-500/30 flex items-center justify-center shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors" />
                  <span className="text-2xl relative z-10">👤</span>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-sm shadow-cyan-400" />
                   <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Authenticated Operator</span>
                 </div>
                 <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                   Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{operatorName}</span>
                 </h2>
                 <p className="text-slate-400 text-sm font-medium mt-1">
                   Cyber-Zero Intelligence Platform is standing by.
                 </p>
               </div>
            </div>

            {/* Clearance & Mission Metrics */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0">
               <div className="bg-[#0c1222] border border-slate-700/60 rounded-xl p-4 min-w-[140px] shadow-inner">
                 <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">Clearance Level</div>
                 <div className="text-indigo-400 font-black tracking-tight">{operatorLevel}</div>
               </div>
               <div className="bg-[#0c1222] border border-slate-700/60 rounded-xl p-4 min-w-[140px] shadow-inner">
                 <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">Primary Mission</div>
                 <div className="text-purple-400 font-black tracking-tight">{operatorPurpose}</div>
               </div>
               <div className="bg-[#0c1222] border border-slate-700/60 rounded-xl p-4 min-w-[140px] shadow-inner">
                 <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">Network Status</div>
                 <div className="text-emerald-400 font-black tracking-tight flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Secure
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Hero Command Hub Banner Panel */}
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-r from-slate-700/50 via-slate-800/20 to-slate-700/50 border border-slate-800/40 shadow-xl shadow-black/20">
          <div className="p-6 sm:p-8 rounded-[23px] bg-[#141d31]/95 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-widest uppercase">Central Intelligence Suite</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
                Cyber-Zero <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Developer Hub</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-medium">
                Unified security workspaces engineered for systemic vulnerability assessment, technology footprint discovery, endpoint protection mapping, and neural development guidance.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 border border-slate-800 bg-[#0c1222] p-4 rounded-xl self-start md:self-center space-y-1 w-full md:w-auto shadow-inner">
              <div>NODE LAYER: <span className="text-white font-bold">SECURECHECK_CORE</span></div>
              <div>UX MATRIX: <span className="text-cyan-400 font-bold">ILLUMINATED_SLATE</span></div>
            </div>
          </div>
        </div>

        {/* High-Visibility 3D Floating Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-[#162238] to-[#10192a] border border-slate-800 border-t-2 border-t-cyan-500/50 rounded-2xl p-4 shadow-xl shadow-black/30 hover:scale-[1.02] transition-transform duration-300">
            <span className="text-slate-400 text-[10px] font-mono block tracking-wider uppercase mb-1 font-bold">Total Audits</span>
            <div className="text-3xl font-black text-white font-mono tracking-tight">124</div>
            <span className="text-[9px] font-mono text-cyan-400 block mt-1">● Active Verification Scans</span>
          </div>

          <div className="bg-gradient-to-b from-[#162238] to-[#10192a] border border-slate-800 border-t-2 border-t-purple-500/50 rounded-2xl p-4 shadow-xl shadow-black/30 hover:scale-[1.02] transition-transform duration-300">
            <span className="text-slate-400 text-[10px] font-mono block tracking-wider uppercase mb-1 font-bold">Threat Vectors</span>
            <div className="text-3xl font-black text-purple-400 font-mono tracking-tight">38</div>
            <span className="text-[9px] font-mono text-slate-400 block mt-1">○ Contained Subsystem Entries</span>
          </div>

          <div className="bg-gradient-to-b from-[#162238] to-[#10192a] border border-slate-800 border-t-2 border-t-emerald-500/50 rounded-2xl p-4 shadow-xl shadow-black/30 hover:scale-[1.02] transition-transform duration-300">
            <span className="text-slate-400 text-[10px] font-mono block tracking-wider uppercase mb-1 font-bold">AI Precision</span>
            <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">99.8%</div>
            <span className="text-[9px] font-mono text-emerald-400 block mt-1">● Model Training Synchronized</span>
          </div>

          <div className="bg-gradient-to-b from-[#162238] to-[#10192a] border border-slate-800 border-t-2 border-t-amber-500/50 rounded-2xl p-4 shadow-xl shadow-black/30 hover:scale-[1.02] transition-transform duration-300">
            <span className="text-slate-400 text-[10px] font-mono block tracking-wider uppercase mb-1 font-bold">System Capacity</span>
            <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">100%</div>
            <span className="text-[9px] font-mono text-amber-400 block mt-1">● Cluster Infra Balanced</span>
          </div>
        </div>

        {/* Premium Cybersecurity Navigational Matrix Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const isAI = card.name === "AI Assistant";
            return (
              <Link
                key={card.name}
                to={card.path}
                className={`group relative border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden min-h-[220px] shadow-xl ${
                  isAI
                    ? "border-purple-500 shadow-purple-500/10 hover:shadow-purple-500/20 bg-gradient-to-b from-[#1a153b]/90 to-[#12142e]/95"
                    : "border-slate-800/80 bg-[#141d30]/80 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-[#18233a]/90 hover:shadow-cyan-500/5"
                }`}
              >
                {/* Visual Corner Light Flare for Hover Effect */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isAI ? "from-purple-500/10" : "from-cyan-500/10"
                }`} />

                <div>
                  {/* Icon Frame Accent */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border transition-colors ${
                    isAI
                      ? "bg-purple-500/10 border-purple-500/30 group-hover:bg-purple-500/20"
                      : "bg-[#0c1222] border-slate-800 group-hover:border-cyan-500/30"
                  }`}>
                    {card.icon}
                  </div>

                  <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors mb-1.5 flex items-center gap-2">
                    {card.name}
                    {isAI && <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-600 text-white px-1.5 py-0.5 rounded-md shadow-sm animate-pulse">Neural</span>}
                  </h2>

                  <p className="text-slate-300 text-xs font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Tactical Command Action Link Trigger Footer */}
                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                    isAI ? "text-purple-400 group-hover:text-purple-300" : "text-cyan-400 group-hover:text-cyan-300"
                  }`}>
                    Access Engine Console
                  </span>
                  <span className={`text-sm transform group-hover:translate-x-1.5 transition-transform ${
                    isAI ? "text-purple-400" : "text-cyan-400"
                  }`}>
                    ➔
                  </span>
                </div>

              </Link>
            );
          })}
        </div>

        {/* Background Status Log Elements */}
        <div className="bg-[#121a2c]/60 rounded-3xl p-2 border border-slate-800/60 shadow-lg">
          <DashboardStatus />
        </div>

        <Footer />

      </div>
    </div>
  );
}
