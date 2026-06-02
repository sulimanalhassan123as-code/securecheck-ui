export default function Home() {
  const cards = [
    "Security Scanner",
    "Technology Intelligence",
    "Domain Intelligence",
    "API Intelligence",
    "Payment Lab",
    "System Management"
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white p-6">
      <h1 className="text-4xl font-bold mb-2">
        Cyber-Zero Developer Hub
      </h1>

      <p className="text-gray-400 mb-8">
        Developer Intelligence Platform
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card}
            className="bg-[#111827] border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition cursor-pointer"
          >
            <h2 className="text-lg font-semibold">{card}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
