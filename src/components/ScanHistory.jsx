import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

function scoreColor(score) {
  if (score >= 80) return "text-green-400 border-green-700 bg-green-950/40";
  if (score >= 50) return "text-yellow-400 border-yellow-700 bg-yellow-950/40";
  return "text-red-400 border-red-700 bg-red-950/40";
}

function sevBadge(sev) {
  const map = {
    CRITICAL: "bg-red-600",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-blue-500",
    INFO: "bg-gray-500",
  };
  return map[sev] || "bg-gray-600";
}

export default function ScanHistory({ refreshKey, onSelectScan }) {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/analyzer/history?limit=15`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) setScans(data.scans);
        else setError(data.error || "Failed to load history");
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 mt-6 text-gray-400 text-sm animate-pulse">
        Loading scan history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 mt-6 text-red-400 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 mt-6 text-gray-500 text-sm">
        No scans yet — run a scan above to start building history.
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 mt-6">
      <h3 className="text-lg font-bold text-cyan-400 mb-4">📜 Scan History</h3>
      <div className="space-y-2">
        {scans.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectScan?.(s.id)}
            className="w-full text-left flex items-center justify-between gap-3 bg-[#0b1224] hover:bg-[#111c33] border border-cyan-900/50 rounded-xl px-4 py-3 transition"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white truncate">{s.targetUrl}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(s.createdAt).toLocaleString()} · {s.scanType === "DEEP_WEBSITE_AUDIT" ? "🧠 Deep" : "⚡ Quick"} · {s.findingsCount} finding{s.findingsCount !== 1 ? "s" : ""}
              </div>
              {Object.keys(s.severityCounts).length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {Object.entries(s.severityCounts).map(([sev, count]) => (
                    <span key={sev} className={`text-[10px] font-bold text-white rounded px-1.5 py-0.5 ${sevBadge(sev)}`}>
                      {sev} × {count}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className={`text-sm font-bold border rounded-lg px-2.5 py-1 ${scoreColor(s.securityScore)}`}>
                {s.securityScore}/100
              </div>
              {s.scoreDelta !== null && s.scoreDelta !== 0 && (
                <span className={`text-[11px] font-semibold ${s.scoreDelta > 0 ? "text-green-400" : "text-red-400"}`}>
                  {s.scoreDelta > 0 ? "▲" : "▼"} {Math.abs(s.scoreDelta)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
