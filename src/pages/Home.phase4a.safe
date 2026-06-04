import { Link } from "react-router-dom";

export default function Home() {
  const cards = [
    { name: "Security Scanner", path: "/scanner", icon: "🛡️" },
    { name: "Technology Intelligence", path: "/technology", icon: "🔬" },
    { name: "Domain Intelligence", path: "/domain", icon: "🌐" },
    { name: "API Intelligence", path: "/api", icon: "🔌" },
    { name: "Payment Lab", path: "/payment", icon: "💳" },
    { name: "System Management", path: "/system", icon: "⚙️" },
    { name: "AI Assistant", path: "/ai", icon: "🤖" }
  ];

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              🛡️
            </div>

            <div className="font-bold text-lg">
              <span className="text-purple-400">Secure</span>Check AI
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
              Home
            </div>

            <div className="px-4 py-2 text-gray-400">
              Workspaces
            </div>

            <div className="px-4 py-2 text-gray-400">
              AI Assistant
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-xs">
              ● System Online
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
              SA
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

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.name}
              to={card.path}
              className="group bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all duration-300"
            >
              <div className="text-5xl mb-4">
                {card.icon}
              </div>

              <h2 className="text-xl font-bold mb-2">
                {card.name}
              </h2>

              <p className="text-gray-400 text-sm">
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
