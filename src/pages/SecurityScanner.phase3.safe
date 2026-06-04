import { useState } from "react";
import ScannerForm from "../components/ScannerForm";
import ThreatMatrix from "../components/ThreatMatrix";
import TechnologyCard from "../components/TechnologyCard";

export default function SecurityScanner() {
  const [targetUrl, setTargetUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [findings, setFindings] = useState([]);
  const [technologies, setTechnologies] = useState([]);

  const runNetworkScan = () => {
    if (!targetUrl.trim()) {
      alert("Please enter a target URL");
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      setFindings([
        {
          title: "Security Headers Review",
          severity: "Low",
          description: "Some recommended security headers may be missing."
        },
        {
          title: "SSL/TLS Status",
          severity: "Info",
          description: "HTTPS detected and certificate appears valid."
        }
      ]);

      setTechnologies([
        "React",
        "Cloudflare",
        "JavaScript",
        "Tailwind CSS"
      ]);

      setIsScanning(false);
    }, 2500);
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
