import RiskMeter from "./RiskMeter";

export default function ResultCard({ result }) {
  if (!result) return null;

  const isSafe = result.prediction === "safe";

  return (
    <div className={`p-6 border-4 border-[var(--border-color)] shadow-[6px_6px_0px_var(--border-color)] transition-all duration-300 ${
      isSafe ? "bg-safe" : "bg-danger"
    }`}>
      <div className="flex items-center gap-4 mb-4 pb-4 border-b-4 border-current">
        <div className="p-2 border-4 border-current bg-[var(--card-bg)] text-[var(--text-main)] rounded-full">
           {isSafe ? (
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="4" stroke="currentColor">
               <path strokeLinecap="square" strokeLinejoin="miter" d="M20 6L9 17l-5-5"/>
             </svg>
           ) : (
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="4" stroke="currentColor">
               <path strokeLinecap="square" strokeLinejoin="miter" d="M18 6L6 18M6 6l12 12"/>
             </svg>
           )}
        </div>
        <h2 className="text-3xl m-0 leading-none">
          {isSafe ? "SAFE URL" : "THREAT DETECTED"}
        </h2>
      </div>

      <div className="text-xl mb-4 font-bold border-4 border-current p-4 bg-[var(--card-bg)] text-[var(--text-main)] box-shadow-[4px_4px_0px_currentColor]">
        CONFIDENCE SCORE: {result.confidence}%
        <RiskMeter
          confidence={result.confidence}
          prediction={result.prediction}
        />
      </div>

      <div className="mt-6 border-4 border-current bg-[var(--card-bg)] text-[var(--text-main)] p-4">
        <h3 className="font-bold text-xl mb-4 border-b-4 border-[var(--border-color)] pb-2 uppercase tracking-wide">
          Feature Breakdown
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-bold">
          {Object.entries(result.features || {}).map(([key, value]) => (
            <div
              key={key}
              className="border-2 border-[var(--border-color)] p-3 break-words"
            >
              <div className="text-[var(--primary)] uppercase border-b-2 border-dotted border-[var(--border-color)] mb-2 pb-1">
                {key.replace(/_/g, ' ')}
              </div>
              <div className="text-lg">
                {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value.toString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
