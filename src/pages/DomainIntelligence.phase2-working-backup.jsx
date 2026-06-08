import { useState } from "react";
import Footer from "../components/Footer";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function DomainIntelligence() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const analyzeDomain = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE}/domain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          domain
        })
      });

      const data = await res.json();

      setReport(data);
    } catch (err) {
      setReport({
        success: false,
        error: err.message
      });
    }

    setLoading(false);
  };

  const copyReport = async () => {
    if (!report) return;

    await navigator.clipboard.writeText(
      JSON.stringify(report, null, 2)
    );

    alert("Report copied");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col">

      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold">
          🌐 Domain Intelligence
        </h1>

        <p className="text-gray-400 mt-2">
          Analyze domain ownership and registration intelligence.
        </p>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">

        <div className="bg-[#111827] rounded-2xl p-6 border border-gray-700">

          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="google.com"
            className="w-full p-4 rounded-xl bg-[#0a0f1d] border border-gray-700"
          />

          <button
            onClick={analyzeDomain}
            disabled={loading}
            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 rounded-xl py-3 font-bold"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Domain"}
          </button>

        </div>

        {report && (
          <div className="mt-6 bg-[#111827] rounded-2xl p-6 border border-gray-700">

            {report.success ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Intelligence Report
                </h2>

                <div className="space-y-3">

                  <p>
                    <strong>Domain:</strong>{" "}
                    {report.domain}
                  </p>

                  <p>
                    <strong>Registrar:</strong>{" "}
                    {report.registrar}
                  </p>

                  <p>
                    <strong>Risk Level:</strong>{" "}
                    {report.riskLevel}
                  </p>

                  <p>
                    <strong>Created:</strong>{" "}
                    {report.creationDate}
                  </p>

                  <p>
                    <strong>Expires:</strong>{" "}
                    {report.expirationDate}
                  </p>

                  <p>
                    <strong>Name Servers:</strong>{" "}
                    {Array.isArray(report.nameServers)
                      ? report.nameServers.join(", ")
                      : report.nameServers}
                  </p>

                </div>

                <button
                  onClick={copyReport}
                  className="mt-6 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg"
                >
                  Copy Report
                </button>
              </>
            ) : (
              <div>
                Error: {report.error}
              </div>
            )}

          </div>
        )}

      </div>

      <div className="text-center text-gray-500 py-4">
        Powered by Suleiman Alhassan
      </div>

      <Footer />

    </div>
  );
}
