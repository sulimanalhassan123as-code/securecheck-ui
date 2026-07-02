export default function DeepScanReport({ report }) {
  if (!report) return null;

  const {
    siteSummary,
    pageTitle,
    technologies = [],
    missingSecurityHeaders = [],
    exposedSecrets = [],
    crawledPageCount,
    securityScore,
  } = report;

  return (
    <div className="bg-[#111827] border border-purple-800 rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs text-purple-400 uppercase tracking-wider">
          🧠 Deep Website Intelligence Report
        </h3>
        <span className="text-xs px-3 py-1 rounded bg-purple-600/20 border border-purple-500 text-purple-300">
          Score: {securityScore ?? 'N/A'}
        </span>
      </div>

      {pageTitle && (
        <p className="text-sm text-gray-400 mb-1">
          <span className="text-gray-500">Page:</span> {pageTitle}
        </p>
      )}
      <p className="text-sm text-gray-500 mb-4">
        Crawled {crawledPageCount ?? 0} page(s) via Apify recon.
      </p>

      {siteSummary && (
        <div className="mb-4 p-3 rounded-lg bg-[#0a0f1d] border border-gray-800 text-sm text-gray-300 leading-relaxed">
          {siteSummary}
        </div>
      )}

      {technologies.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[11px] uppercase text-gray-500 mb-2">Detected Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((t, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-cyan-600/20 border border-cyan-500 text-cyan-300 text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingSecurityHeaders.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[11px] uppercase text-gray-500 mb-2">Missing Security Headers</h4>
          <div className="flex flex-wrap gap-2">
            {missingSecurityHeaders.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-orange-600/20 border border-orange-500 text-orange-300 text-xs">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {exposedSecrets.length > 0 && (
        <div>
          <h4 className="text-[11px] uppercase text-red-400 mb-2">⚠️ Potential Exposed Secrets</h4>
          <div className="space-y-2">
            {exposedSecrets.map((s, i) => (
              <div key={i} className="p-2 rounded bg-red-950/40 border border-red-800 text-xs text-red-300">
                <b>{s.label}</b> in <span className="text-red-400">{s.foundIn}</span>: <code>{s.sample}...</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
