export default function RiskMeter({ confidence, prediction }) {
  const isSafe = prediction !== "phishing";
  
  return (
    <div className="mt-4">
      <div className="w-full border-4 border-[var(--border-color)] h-6 bg-[var(--bg-color)] relative">
        <div
          className="h-full border-r-4 border-[var(--border-color)] relative"
          style={{ 
            width: `${confidence}%`,
             backgroundColor: isSafe ? "var(--safe-bg)" : "var(--danger-bg)"
          }}
        >
            <div className="absolute inset-y-0 right-0 w-2 bg-[var(--border-color)] opacity-50 mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
}
