export default function DashboardStatus() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      <div className="bg-[#0f172a] border border-purple-500/30 rounded-2xl p-6">
        <div className="text-purple-400 text-sm mb-2">
          AI PROTECTION
        </div>

        <div className="text-2xl font-bold mb-2">
          Active Protection
        </div>

        <div className="text-green-400 animate-pulse">
          ● Threat Detection Online
        </div>
      </div>

      <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-6">
        <div className="text-cyan-400 text-sm mb-2">
          REAL-TIME MONITOR
        </div>

        <div className="text-2xl font-bold mb-2">
          System Monitoring
        </div>

        <div className="text-gray-400">
          Watching scans, APIs and platform activity.
        </div>
      </div>
    </div>
  );
}
