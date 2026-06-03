import { Activity } from 'lucide-react';

export default function ScannerForm({
  targetUrl,
  setTargetUrl,
  runNetworkScan,
  isScanning
}) {
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

      <button
        onClick={runNetworkScan}
        disabled={isScanning}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium text-sm transition-colors flex items-center justify-center gap-2"
      >
        <Activity className="w-4 h-4" />
        Initialize Endpoint Scan
      </button>
    </div>
  );
}
