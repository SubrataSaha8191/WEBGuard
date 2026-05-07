export default function RiskMeter({ confidence, prediction }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between mb-2">
        <span>Risk Level</span>
        <span>{confidence}%</span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${
            prediction === "phishing"
              ? "bg-red-500"
              : "bg-green-500"
          }`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}