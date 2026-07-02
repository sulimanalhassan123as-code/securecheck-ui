import { useState } from "react";
import ScannerForm from "../components/ScannerForm";
import ThreatMatrix from "../components/ThreatMatrix";
import TechnologyCard from "../components/TechnologyCard";
import DeepScanReport from "../components/DeepScanReport";
import ScanHistory from "../components/ScanHistory";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function SecurityScanner() {
  const [targetUrl, setTargetUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isDeepScanning, setIsDeepScanning] = useState(false);
  const [findings, setFindings] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [deepReport, setDeepReport] = useState(null);
  const [deepError, setDeepError] = useState("");
  const [historyKey, setHistoryKey] = useState(0);
  const [historyError, setHistoryError] = useState("");

  const runNetworkScan = async () => {
    if (!targetUrl.trim()) {
      alert("Please enter a target URL");
      return;
    }

    setIsScanning(true);
    setFindings([]);
    setTechnologies([]);
    setDeepReport(null);
    setDeepError("");

    try {
      const startRes = await fetch(`${API_BASE}/scans/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          targetUrl
        })
      });

      if (!startRes.ok) {
        throw new Error("Failed to start scan");
      }

      const startData = await startRes.json();

      if (!startData.scanId) {
        throw new Error("No scanId returned");
      }

      const scanId = startData.scanId;

      const pollInterval = setInterval(async () => {
        try {
          const scanRes = await fetch(
            `${API_BASE}/scans/${scanId}`
          );

          if (!scanRes.ok) {
            throw new Error("Failed to fetch scan");
          }

          const scanData = await scanRes.json();

          if (scanData.status === "COMPLETED") {
            clearInterval(pollInterval);

            setFindings(scanData.findings || []);

            setTechnologies([
              `Security Score: ${scanData.securityScore ?? 0}`,
              `Duration: ${scanData.durationMs ?? 0} ms`,
              scanData.scanType || "WEB_HEADERS",
              scanData.status
            ]);

            setIsScanning(false);
            setHistoryKey((k) => k + 1);
          }

          if (scanData.status === "FAILED") {
            clearInterval(pollInterval);
            alert("Scan failed.");
            setIsScanning(false);
          }
        } catch (err) {
          console.error(err);
          clearInterval(pollInterval);
          setIsScanning(false);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("Failed to connect to SecureCheck API.");
      setIsScanning(false);
    }
  };

  const runDeepScan = async () => {
    if (!targetUrl.trim()) {
      alert("Please enter a target URL");
      return;
    }

    setIsDeepScanning(true);
    setDeepReport(null);
    setDeepError("");
    setFindings([]);

    try {
      const res = await fetch(`${API_BASE}/analyzer/deep-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Deep scan failed");
      }

      setDeepReport(data);
      setFindings(data.findings || []);
      setHistoryKey((k) => k + 1);
    } catch (err) {
      console.error(err);
      setDeepError(err.message || "Deep analysis failed. The backend may be waking up — try again in a few seconds.");
    } finally {
      setIsDeepScanning(false);
    }
  };

  // Re-open a past scan from history without re-running it
  const openPastScan = async (scanId) => {
    setHistoryError("");
    try {
      const res = await fetch(`${API_BASE}/analyzer/scan/${scanId}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not load that scan");

      const scan = data.scan;
      setTargetUrl(scan.targetUrl || "");
      setFindings(scan.findings || []);

      if (scan.scanType === "DEEP_WEBSITE_AUDIT") {
        setDeepReport({
          securityScore: scan.securityScore,
          pageTitle: null,
          crawledPageCount: null,
          siteSummary: `Reopened from history — scanned ${new Date(scan.createdAt).toLocaleString()}.`,
          technologies: [],
          missingSecurityHeaders: [],
          exposedSecrets: [],
          findings: scan.findings || [],
        });
        setTechnologies([]);
      } else {
        setDeepReport(null);
        setTechnologies([
          `Security Score: ${scan.securityScore ?? 0}`,
          `Duration: ${scan.durationMs ?? 0} ms`,
          scan.scanType || "WEB_HEADERS",
          scan.status
        ]);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setHistoryError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Security Scanner Workspace
        </h1>

        <p className="text-gray-400 mb-8">
          Cyber-Zero Security Analysis Engine
        </p>

        <div className="bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 mb-6">
          <ScannerForm
            targetUrl={targetUrl}
            setTargetUrl={setTargetUrl}
            runNetworkScan={runNetworkScan}
            runDeepScan={runDeepScan}
            isScanning={isScanning}
            isDeepScanning={isDeepScanning}
          />

          {isScanning && (
            <div className="mt-4 text-cyan-400 animate-pulse">
              Scanning target...
            </div>
          )}

          {isDeepScanning && (
            <div className="mt-4 text-purple-400 animate-pulse">
              🧠 Crawling site, analyzing tech stack &amp; running AI logic review... this can take up to a minute.
            </div>
          )}

          {deepError && (
            <div className="mt-4 text-red-400 text-sm">
              ⚠️ {deepError}
            </div>
          )}
        </div>

        <DeepScanReport report={deepReport} />

        <ThreatMatrix findings={findings} />

        <TechnologyCard technologies={technologies} />

        {historyError && (
          <div className="mt-4 text-red-400 text-sm">⚠️ {historyError}</div>
        )}

        <ScanHistory refreshKey={historyKey} onSelectScan={openPastScan} />

      </div>
    </div>
  );
}
