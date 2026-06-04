import ScannerForm from "../components/ScannerForm";
import ThreatMatrix from "../components/ThreatMatrix";
import TechnologyCard from "../components/TechnologyCard";

export default function SecurityScanner() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white p-6">
      <h1 className="text-3xl font-bold mb-2">
        Security Scanner Workspace
      </h1>

      <p className="text-gray-400 mb-6">
        Cyber-Zero Security Analysis Engine
      </p>

      <div className="space-y-6">
        <ScannerForm
          targetUrl=""
          setTargetUrl={() => {}}
          runNetworkScan={() => {}}
          isScanning={false}
        />

        <ThreatMatrix findings={[]} />

        <TechnologyCard technologies={[]} />
      </div>
    </div>
  );
}
