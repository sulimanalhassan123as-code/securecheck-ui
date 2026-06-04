import { Link } from "react-router-dom";

export default function Home() {
  const cards = [
    { name: "Security Scanner", path: "/scanner", icon: "🛡️", desc: "Scan websites and applications" },
    { name: "Technology Intelligence", path: "/technology", icon: "🔬", desc: "Detect frameworks and stacks" },
    { name: "Domain Intelligence", path: "/domain", icon: "🌐", desc: "Domain and DNS intelligence" },
    { name: "API Intelligence", path: "/api", icon: "🔌", desc: "Inspect APIs and endpoints" },
    { name: "Payment Lab", path: "/payment", icon: "💳", desc: "Test payment integrations" },
    { name: "System Management", path: "/system", icon: "⚙️", desc: "Manage platform resources" },
    { name: "AI Assistant", path: "/ai", icon: "🤖", desc: "AI-powered security guidance" }
  ];

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              🛡️
            </div>

            <div className="font-bold text-lg">
              <span className="text-purple-400">Secure</span>Check AI
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-xs animate-pulse">
              ● System Online
            </div>
          </div>
        </div>

        <div className="mb-10">
          <span className="px-4 py-1 rounded-full border border-cyan-500 text-cyan-400 text-xs">
            CYBER DEFENSE PLATFORM
          </span>

          <h1 className="text-5xl font-bold mt-4">
            Cyber-Zero
            <span className="text-cyan-400"> Developer Hub</span>
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Unified workspaces for security scanning, intelligence gathering,
            API analysis, payment testing and AI-powered development.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
            <div className="text-cyan-400 text-2xl font-bold">124</div>
            <div className="text-gray-400 text-sm">Scans</div>
          </div>

          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
            <div className="text-purple-400 text-2xl font-bold">38</div>
            <div className="text-gray-400 text-sm">Threats</div>
          </div>

          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
            <div className="text-green-400 text-2xl font-bold">99%</div>
            <div className="text-gray-400 text-sm">AI Accuracy</div>
          </div>

          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4">
            <div className="text-yellow-400 text-2xl font-bold">100%</div>
            <div className="text-gray-400 text-sm">System Health</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.name}
              to={card.path}
              className="group bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-300"
            >
              <div className="text-5xl mb-4">{card.icon}</div>

              <h2 className="text-xl font-bold mb-2">
                {card.name}
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                {card.desc}
              </p>

              <p className="text-cyan-400 text-sm">
                Open workspace →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          Powered by Suleiman Alhassan
        </div>

      </div>
    </div>
  );
}
