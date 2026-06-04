import { useState } from "react";

export default function TechnologyIntelligence() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [technologies, setTechnologies] = useState([]);

  const analyzeSite = () => {
    if (!url.trim()) {
      alert("Enter a website URL");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setTechnologies([
        "React",
        "Cloudflare",
        "JavaScript",
        "Tailwind CSS",
        "Vercel"
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Technology Intelligence
        </h1>

        <p className="text-gray-400 mb-8">
          Detect frameworks, libraries and technologies.
        </p>

        <div className="bg-[#0f172a] border border-cyan-900 rounded-2xl p-6 mb-6">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-[#050b1a] border border-gray-700 rounded-lg px-4 py-3 mb-4"
          />

          <button
            onClick={analyzeSite}
            className="w-full bg-cyan-600 hover:bg-cyan-500 rounded-lg py-3 font-semibold"
          >
            Analyze Technology Stack
          </button>

          {loading && (
            <div className="mt-4 text-cyan-400 animate-pulse">
              Analyzing technologies...
            </div>
          )}
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-cyan-400 font-bold mb-4">
            Detected Technologies
          </h2>

          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-300"
              >
                {tech}
              </div>
            ))}
          </div>

          {technologies.length === 0 && (
            <p className="text-gray-400">
              No technologies detected yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
