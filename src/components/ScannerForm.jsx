import { Activity, ShieldAlert } from 'lucide-react';

export default function ScannerForm({
  targetUrl,
  setTargetUrl,
  runNetworkScan,
  runDeepScan,
  isScanning,
  isDeepScanning
}) {
  const busy = isScanning || isDeepScanning;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Target Domain URL
        </label>

        <input
          type="url"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full bg-[#0a0f1d] border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-gray-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={runNetworkScan}
          disabled={busy}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4" />
          {isScanning ? 'Scanning...' : 'Quick Header Scan'}
        </button>

        {runDeepScan && (
          <button
            onClick={runDeepScan}
            disabled={busy}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            {isDeepScanning ? 'Deep Scanning...' : '🧠 Deep Analysis'}
          </button>
        )}
      </div>
      <p className="text-[11px] text-gray-500">
        Quick scan checks response headers only. Deep Analysis crawls the site, pulls public JS/CSS files,
        detects the tech stack, and runs AI-powered logic + vulnerability analysis (takes ~30-90s).
      </p>
    </div>
  );
}
