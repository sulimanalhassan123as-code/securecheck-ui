export default function QuickFixCard({ finding }) {
  return (
    <div className="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
      <h5 className="text-cyan-300 text-xs uppercase tracking-wider mb-2">
        🤖 Quick Fix AI
      </h5>

      <p className="text-sm text-gray-300 mb-2">
        {finding?.recommendation || "No recommendation available yet."}
      </p>

      <div className="bg-black/30 rounded p-2 text-xs text-green-300 overflow-auto">
        {finding?.secureCodeExample || "No secure code example available."}
      </div>
    </div>
  );
}
