import { useEffect, useRef } from "react";

export default function ResultStage({ scanning, children, scanLabel = "ANALYZING..." }) {
  const beamsRef = useRef(null);

  useEffect(() => {
    const container = beamsRef.current;
    if (!container) return;
    container.innerHTML = "";
    const colors = [
      "rgba(8,180,220,0.45)", "rgba(99,102,241,0.4)",
      "rgba(34,211,238,0.35)", "rgba(16,185,129,0.3)",
      "rgba(8,180,220,0.3)", "rgba(139,92,246,0.35)"
    ];
    const count = 7;
    const w = container.offsetWidth || 320;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("div");
      b.className = "rbeam";
      b.style.cssText = `left:${8 + i * (w / count)}px;--rc:${colors[i % colors.length]};--rbd:${2.5 + i * 0.35}s;--rbdelay:${i * 0.3}s;`;
      container.appendChild(b);
    }
  }, [scanning]);

  return (
    <div className="result-stage">
      {/* Beams layer — always present, dims when results show */}
      <div
        ref={beamsRef}
        className={`result-beams${!scanning && children ? " dim" : ""}`}
      />

      {/* Spinner while scanning */}
      {scanning && (
        <div className="scanning-label">
          <div className="scan-ring" />
          <div className="scan-text">{scanLabel}</div>
        </div>
      )}

      {/* Results */}
      {!scanning && children && (
        <div className="result-content">{children}</div>
      )}
    </div>
  );
}
