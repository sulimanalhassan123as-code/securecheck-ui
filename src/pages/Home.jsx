import { Link } from "react-router-dom";
import DashboardStatus from "../components/DashboardStatus";
import Footer from "../components/Footer";

export default function Home() {
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
    <div className="min-h-screen bg-[#050b1a] text-white p-6 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Premium Multi-Layered Neon Ambient Backdrops */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-indigo-600/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">

        {/* Tactical Navigation Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-900 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
              <span className="text-lg">🛡️</span>
            </div>
            <div>
              <div className="font-black text-lg tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">Secure</span>
                <span className="text-cyan-400">Check AI</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-gray-500 block tracking-widest -mt-0.5 uppercase">Security Ops Command</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#0f172a]/80 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl shadow-inner flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider uppercase">System Online</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Command Cluster */}
        <div className="relative p-1 rounded-3xl bg-gradient-to-r from-gray-900 via-slate-800/40 to-gray-900 border border-gray-800/60 shadow-xl">
          <div className="p-6 sm:p-8 rounded-[22px] bg-[#090f1e]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">Central Intelligence Suite</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
                Cyber-Zero <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Developer Hub</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl font-medium">
                Unified security workspaces engineered for systemic vulnerability assessment, technology footprint discovery, endpoint protection mapping, and neural development guidance.
              </p>
            </div>
            <div className="text-[11px] font-mono text-gray-500 border border-gray-900 bg-[#040813] p-4 rounded-xl self-start md:self-center space-y-1 w-full md:w-auto">
              <div>NODE LAYER: <span className="text-white font-bold">SECURECHECK_CORE</span></div>
              <div>UX REVISION: <span className="text-cyan-400 font-bold">v2.0 // PREMIUM</span></div>
            </div>
          </div>
        </div>

        {/* 3D-Shadow High-Visibility Metric Panels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1d] border border-gray-900 border-t-2 border-t-cyan-500/40 rounded-2xl p-4 shadow-xl shadow-black/50 hover:border-cyan-500/20 transition-all duration-300">
            <span className="text-gray-500 text-[10px] font-mono block tracking-wider uppercase mb-1">Total Audits</span>
            <div className="text-3xl font-black text-white font-mono tracking-tight">124</div>
            <span className="text-[9px] font-mono text-cyan-400 block mt-1">● Active Verification Scans</span>
          </div>

          <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1d] border border-gray-900 border-t-2 border-t-purple-500/40 rounded-2xl p-4 shadow-xl shadow-black/50 hover:border-purple-500/20 transition-all duration-300">
            <span className="text-gray-500 text-[10px] font-mono block tracking-wider uppercase mb-1">Threat Vectors</span>
            <div className="text-3xl font-black text-purple-400 font-mono tracking-tight">38</div>
            <span className="text-[9px] font-mono text-gray-400 block mt-1">○ Contained / Isolated Node Entries</span>
          </div>

          <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1d] border border-gray-900 border-t-2 border-t-emerald-500/40 rounded-2xl p-4 shadow-xl shadow-black/50 hover:border-emerald-500/20 transition-all duration-300">
            <span className="text-gray-500 text-[10px] font-mono block tracking-wider uppercase mb-1">AI Precision</span>
            <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">99.8%</div>
            <span className="text-[9px] font-mono text-emerald-500 block mt-1">● Model Training Matrix Synchronized</span>
          </div>

          <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1d] border border-gray-900 border-t-2 border-t-amber-500/40 rounded-2xl p-4 shadow-xl shadow-black/50 hover:border-amber-500/20 transition-all duration-300">
            <span className="text-gray-500 text-[10px] font-mono block tracking-wider uppercase mb-1">System Capacity</span>
            <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">100%</div>
            <span className="text-[9px] font-mono text-amber-400 block mt-1">● Cluster Infrastructure Balanced</span>
          </div>

        </div>

        {/* Premium Cybersecurity Navigational Matrix Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const isAI = card.name === "AI Assistant";
            return (
              <Link
                key={card.name}
                to={card.path}
                className={`group relative bg-[#0f172a]/60 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden min-h-[220px] shadow-lg ${
                  isAI 
                    ? "border-purple-500/50 shadow-purple-500/10 hover:shadow-purple-500/20 bg-gradient-to-b from-[#120d2d]/80 to-[#0c0e22]/90" 
                    : "border-gray-900 hover:border-cyan-500/40 hover:shadow-cyan-500/5"
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
                      : "bg-[#050b1a] border-gray-800 group-hover:border-cyan-500/30"
                  }`}>
                    {card.icon}
                  </div>

                  <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-white mb-1.5 flex items-center gap-2">
                    {card.name}
                    {isAI && <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-500 text-white px-1.5 py-0.5 rounded-md shadow-sm animate-pulse">Neural</span>}
                  </h2>

                  <p className="text-gray-400 text-xs font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Tactical Command Action Link Trigger Footer */}
                <div className="mt-5 pt-3 border-t border-gray-900/60 flex items-center justify-between">
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
        <div className="bg-[#0f172a]/30 rounded-3xl p-2 border border-gray-900">
          <DashboardStatus />
        </div>

        <Footer />

      </div>
    </div>
  );
}
