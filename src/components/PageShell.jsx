import { useNavigate } from "react-router-dom";

export default function PageShell({ title, icon, children }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#030f1a] text-white flex flex-col">
      {/* Top bar */}
      <div className="topbar-gradient sticky top-0 z-50 px-4 h-14 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate("/")}
          className="bg-[rgba(8,145,178,0.1)] border border-[rgba(8,145,178,0.2)] rounded-lg px-3 py-1.5 text-[#22d3ee] text-sm font-bold hover:bg-[rgba(8,145,178,0.2)] transition-colors"
        >
          ← Back
        </button>
        <span className="text-base font-bold">{icon} {title}</span>
      </div>
      {/* Content */}
      <div className="flex-1 px-4 py-5 max-w-3xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
