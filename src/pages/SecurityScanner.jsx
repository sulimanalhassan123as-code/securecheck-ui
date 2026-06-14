import { useState } from "react";
import ScannerForm from "../components/ScannerForm";
import ThreatMatrix from "../components/ThreatMatrix";
import TechnologyCard from "../components/TechnologyCard";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://securecheck-api.onrender.com/api";

export default function SecurityScanner() {
  const [targetUrl, setTargetUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [findings, setFindings] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  const runNetworkScan = async () => {
    if (!targetUrl.trim()) {
      alert("Please enter a target URL");
      return;
    }

    setIsScanning(true);
    setFindings([]);
    setTechnologies([]);

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
            isScanning={isScanning}
          />

          {isScanning && (
            <div className="mt-4 text-cyan-400 animate-pulse">
              Scanning target...
            </div>
          )}
        </div>

        <ThreatMatrix findings={findings} />

        <TechnologyCard technologies={technologies} />

      </div>
    </div>
  );
}
