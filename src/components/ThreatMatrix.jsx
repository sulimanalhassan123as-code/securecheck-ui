import QuickFixCard from "./QuickFixCard";

export default function ThreatMatrix({ findings = [] }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
      <h3 className="text-xs text-cyan-400 uppercase mb-4 tracking-wider">
        Threat Matrix Results
      </h3>

      {findings.length === 0 ? (
        <div className="text-gray-400 text-sm">
          No findings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {findings.map((finding, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg p-4 bg-[#0a0f1d]"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-white">
                  {finding.title}
                </h4>

                <span className="text-xs px-2 py-1 rounded bg-red-600 text-white">
                  {finding.severity}
                </span>
              </div>
<p className="text-sm text-gray-300 mb-3">
  {finding.description}
</p>

<div className="flex flex-wrap gap-2 mb-3">
  <div className="px-3 py-1 rounded bg-cyan-600/20 border border-cyan-500 text-cyan-300 text-xs">
    Confidence: {finding.confidence || "HIGH"}
  </div>
  <div className="px-3 py-1 rounded bg-purple-600/20 border border-purple-500 text-purple-300 text-xs">
    Component: {finding.affectedComponent || "Network"}
  </div>
</div>
<QuickFixCard finding={finding} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
