import { useState, useEffect } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://securecheck-api.onrender.com/api";

/**
 * Lightweight SVG-based security score timeline chart.
 * Fetches score history for a given URL and renders a sparkline-style chart.
 */
export default function ScoreTimeline({ targetUrl, adminToken, adminKey }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const headers = adminToken
        ? { Authorization: `Bearer ${adminToken}`, "x-admin-key": adminKey }
        : {};
      const res = await fetch(
        `${API_BASE}/analyzer/score-timeline?targetUrl=${encodeURIComponent(targetUrl)}`,
        { headers }
      );
      const data = await res.json();
      if (data.success) setTimeline(data.timeline);
    } catch (e) {
      console.error("Timeline fetch failed:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && timeline.length === 0) loadTimeline();
  }, [open]); // eslint-disable-line

  if (!targetUrl) return null;

  const width = 500;
  const height = 160;
  const pad = 30;

  const scores = timeline.map((t) => t.score);
  const minScore = Math.min(...scores, 0);
  const maxScore = Math.max(...scores, 100);
  const range = maxScore - minScore || 100;

  const points = timeline.map((t, i) => {
    const x = pad + (i / Math.max(timeline.length - 1, 1)) * (width - pad * 2);
    const y = height - pad - ((t.score - minScore) / range) * (height - pad * 2);
    return { x, y, ...t };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1]?.x} ${height - pad} L ${pad} ${height - pad} Z`
    : "";

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-3 mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-cyan-400 font-medium hover:text-cyan-300"
      >
        {open ? "▼" : "▶"} Score Timeline
      </button>
      {open && (
        <div className="mt-2">
          {loading ? (
            <div className="text-xs text-gray-500 py-4 text-center">Loading timeline...</div>
          ) : timeline.length === 0 ? (
            <div className="text-xs text-gray-500 py-4 text-center">No scan history for this URL yet.</div>
          ) : (
            <>
              <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((s) => {
                  const y = height - pad - (s / 100) * (height - pad * 2);
                  return (
                    <g key={s}>
                      <line x1={pad} y1={y} x2={width - pad} y2={y} stroke="#1f2937" strokeWidth="1" />
                      <text x={pad - 8} y={y + 3} fill="#64748b" fontSize="8" textAnchor="end">
                        {s}
                      </text>
                    </g>
                  );
                })}
                {/* Area fill */}
                {areaD && <path d={areaD} fill="url(#scoreGrad)" />}
                {/* Line */}
                {pathD && (
                  <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" />
                )}
                {/* Points */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="3" fill={p.score >= 80 ? "#10b981" : p.score >= 60 ? "#f59e0b" : "#ef4444"} />
                    <title>{`${new Date(p.date).toLocaleDateString()}: ${p.score}/100 (${p.totalFindings} findings)`}</title>
                  </g>
                ))}
              </svg>
              <div className="text-[10px] text-gray-500 mt-1 flex justify-between px-7">
                <span>Oldest</span>
                <span>Most Recent</span>
              </div>
              {timeline.length > 1 && (
                <div className="text-[10px] text-gray-400 mt-1">
                  Trend:{" "}
                  {scores[scores.length - 1] > scores[0] ? (
                    <span className="text-emerald-400">↑ Improving (+{scores[scores.length - 1] - scores[0]} pts)</span>
                  ) : scores[scores.length - 1] < scores[0] ? (
                    <span className="text-red-400">↓ Declining ({scores[scores.length - 1] - scores[0]} pts)</span>
                  ) : (
                    <span className="text-gray-400">→ Stable</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
