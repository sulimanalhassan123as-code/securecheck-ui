export default function TechnologyCard({ technologies = [] }) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 mt-6">
      <h3 className="text-xs text-cyan-400 uppercase mb-4 tracking-wider">
        Cyber-Zero Technology Intelligence
      </h3>

      {technologies.length === 0 ? (
        <div className="text-gray-400 text-sm">
          No technologies detected yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500 text-cyan-300 text-sm font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
