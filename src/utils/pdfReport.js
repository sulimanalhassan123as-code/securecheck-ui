import { jsPDF } from "jspdf";

/**
 * Generates a professional PDF security report for a scan.
 * @param scan - Full scan object from the API (includes findings array)
 */
export function generatePdfReport(scan) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  // ── Helper: ensure space, add page if needed
  const ensure = (need) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Header bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SecureCheck AI", margin, 35);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("Cyber-Zero Security Report", margin, 52);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleString(), pageW - margin - 120, 35);

  y = 90;
  doc.setTextColor(15, 23, 42);

  // ── Target info
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Scan Summary", margin, y);
  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const info = [
    ["Target URL", scan.targetUrl || "N/A"],
    ["Scan Type", scan.scanType || "N/A"],
    ["Scan Date", scan.createdAt ? new Date(scan.createdAt).toLocaleString() : "N/A"],
    ["Scan ID", scan.id || "N/A"],
    ["Status", scan.status || "N/A"],
    ["Scan Duration", scan.durationMs ? `${scan.durationMs}ms` : "N/A"],
  ];
  for (const [label, val] of info) {
    ensure(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(val), margin + 100, y);
    y += 16;
  }

  // ── Score badge
  y += 10;
  ensure(60);
  const score = scan.securityScore ?? 0;
  const scoreColor =
    score >= 80 ? [16, 185, 129] : score >= 60 ? [245, 158, 11] : score >= 40 ? [249, 115, 22] : [239, 68, 68];
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.roundedRect(margin, y, 200, 44, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("SECURITY SCORE", margin + 12, y + 16);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(`${score}/100`, margin + 12, y + 38);
  doc.setTextColor(15, 23, 42);
  y += 60;

  // ── Findings
  const findings = scan.findings || [];
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  ensure(20);
  doc.text(`Security Findings (${findings.length})`, margin, y);
  y += 8;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  if (findings.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text("No security issues were detected during this scan.", margin, y);
    y += 20;
  }

  const sevColors = {
    CRITICAL: [239, 68, 68],
    HIGH: [249, 115, 22],
    MEDIUM: [245, 158, 11],
    LOW: [59, 130, 246],
    INFO: [107, 114, 128],
  };

  for (const f of findings) {
    const color = sevColors[f.severity] || sevColors.INFO;

    // Severity badge
    ensure(80);
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, y, 70, 18, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(f.severity || "INFO", margin + 8, y + 12);

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    const titleLines = doc.splitTextToSize(f.title || "Untitled", pageW - margin - 80);
    doc.text(titleLines, margin + 80, y + 12);
    y += 20 + (titleLines.length - 1) * 12;

    // Description
    if (f.description) {
      ensure(30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const descLines = doc.splitTextToSize(f.description, pageW - margin * 2);
      doc.text(descLines, margin, y);
      y += descLines.length * 12 + 4;
    }

    // Recommendation
    if (f.recommendation) {
      ensure(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text("Fix:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(16, 185, 129);
      const recLines = doc.splitTextToSize(f.recommendation, pageW - margin * 2 - 20);
      doc.text(recLines, margin + 20, y);
      y += recLines.length * 12 + 4;
    }

    if (f.affectedComponent) {
      ensure(14);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Component: ${f.affectedComponent}`, margin, y);
      y += 12;
    }

    y += 10;
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y, pageW - margin, y);
    y += 12;
  }

  // ── Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SecureCheck AI · Cyber-Zero Intelligence Platform · Generated ${new Date().toLocaleString()}`,
      margin,
      pageH - 16
    );
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin - 50, pageH - 16);
  }

  // Download
  const filename = `securecheck-report-${scan.targetUrl?.replace(/[^a-z0-9]/gi, "-") || "scan"}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
