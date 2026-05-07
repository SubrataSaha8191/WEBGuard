import RiskMeter from "./RiskMeter";

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className={`p-6 rounded-2xl mt-6 border transition-all duration-500 shadow-xl ${
      result.prediction === "phishing"
        ? "bg-red-950/40 border-red-500"
        : "bg-green-950/30 border-green-500"
    }`}>
      <h2 className="text-2xl font-bold mb-4">
        {result.prediction === "phishing"
          ? "⚠️ Phishing Detected"
          : "✅ Safe URL"}
      </h2>

      <p className="mb-2">
        Confidence:{" "}
        <span className="font-bold">
          {result.confidence}%
        </span>
      </p>

      <RiskMeter
        confidence={result.confidence}
        prediction={result.prediction}
      />

      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          Feature Analysis
        </h3>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(result.features).map(([key, value]) => (
            <div
              key={key}
              className="bg-black/30 border border-slate-800 p-3 rounded-xl"
            >
              <span className="text-cyan-400 text-center mb-8 tracking-wide">
                {key}
              </span>
              <br />
              <span>{value.toString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}