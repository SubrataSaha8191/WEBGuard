import { useState, useEffect } from "react";
import API from "./services/api";

import URLForm from "./components/URLForm";
import ResultCard from "./components/ResultCard";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("pg-theme") || "dark");
  const [scanHistory, setScanHistory] = useState([]);
  const [stats, setStats] = useState({
    scansToday: 0,
    threatsCaught: 0,
    falsePositives: 0,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pg-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleScan = async (url) => {
    try {
      setLoading(true);
      setResult(null);
      const response = await API.post("/scan-url", { url });
      const scan = response.data;
      setResult(scan);
      setScanHistory((prev) => [scan, ...prev].slice(0, 5));
      setStats((prev) => ({
        scansToday: prev.scansToday + 1,
        threatsCaught: prev.threatsCaught + (scan.prediction !== "safe" ? 1 : 0),
        falsePositives:
          prev.falsePositives +
          (scan.prediction === "safe" && scan.ml_prediction === "phishing" ? 1 : 0),
      }));
    } catch (err) {
      console.error(err);
      alert("Error scanning URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col items-stretch">
      {/* Header Bar */}
      <header className="w-full flex justify-between items-center mb-6 p-4 retro-card">
        <div className="flex items-center gap-3">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h1 className="text-2xl md:text-3xl m-0 leading-none">WEBGuard DASHBOARD</h1>
        </div>
        
        <button 
          onClick={toggleTheme} 
          className="retro-button p-2 px-4 text-sm whitespace-nowrap"
          title="Toggle Theme"
        >
          {theme === "dark" ? "LIGHT MODE" : "DARK MODE"}
        </button>
      </header>

      {/* Main Content Grid - Full Width, 3 Columns on Large Screens */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Input & Stats */}
        <div className="md:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="retro-card p-6">
            <h2 className="text-xl mb-4 border-b-4 border-[var(--border-color)] pb-2 uppercase">SCAN CENTER</h2>
            <p className="mb-6 text-sm font-bold opacity-80">Enter a URL to perform deep analysis with our ML engine.</p>
            <URLForm onScan={handleScan} loading={loading} />
          </div>

          <div className="retro-card p-6 flex-grow" style={{ backgroundColor: "var(--primary)", color: "var(--header-text)" }}>
            <h2 className="text-xl mb-4 border-b-4 border-current pb-2 uppercase">QUICK STATS</h2>
            <div className="flex flex-col gap-4 font-bold text-sm">
              <div className="flex justify-between border-b-2 border-dotted border-current pb-2">
                <span>SCANS TODAY:</span>
                <span>{stats.scansToday}</span>
              </div>
              <div className="flex justify-between border-b-2 border-dotted border-current pb-2">
                <span>THREATS CAUGHT:</span>
                <span>{stats.threatsCaught}</span>
              </div>
              <div className="flex justify-between border-b-2 border-dotted border-current pb-2">
                <span>FALSE POSITIVES:</span>
                <span>{stats.falsePositives}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>SYSTEM STATUS:</span>
                <span className="text-green-300 animate-pulse">ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Main Report */}
        <div className="md:col-span-8 xl:col-span-6 flex flex-col gap-6">
          <div className="retro-card p-6 flex-1 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-end mb-6 border-b-4 border-[var(--border-color)] pb-2">
              <h2 className="text-2xl uppercase m-0 leading-none">ANALYSIS REPORT</h2>
              <span className="text-xs font-bold opacity-50 uppercase">LIVE FEED</span>
            </div>
            
            <div className="flex-1 flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : result ? (
                <ResultCard result={result} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="mb-4">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <p className="text-2xl font-bold uppercase tracking-widest font-[var(--font-heading)]">WAITING FOR INPUT</p>
                  <p className="font-bold">Run a scan to populate this dashboard.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: History & Insights */}
        <div className="md:col-span-12 xl:col-span-3 flex flex-col md:flex-row xl:flex-col gap-6">
          
          <div className="retro-card p-6 flex-1">
            <h2 className="text-xl mb-4 border-b-4 border-[var(--border-color)] pb-2 uppercase">RECENT SCANS</h2>
            <ul className="flex flex-col gap-3 font-bold text-xs uppercase">
              {scanHistory.length > 0 ? (
                scanHistory.map((scan) => (
                  <li key={scan.url + scan.threat_score} className="flex justify-between items-center">
                    <span className="truncate w-32" title={scan.url}>{scan.url}</span>
                    <span className={`px-2 py-1 border-2 border-current ${scan.prediction === "safe" ? "bg-safe text-[var(--safe-color)]" : "bg-danger text-[var(--danger-color)]"}`}>
                      {scan.prediction === "safe" ? "SAFE" : "THREAT"}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-[var(--text-main)] opacity-70">No scans yet. Run one to populate history.</li>
              )}
            </ul>
          </div>

          <div className="retro-card p-6 flex-1">
            <h2 className="text-xl mb-4 border-b-4 border-[var(--border-color)] pb-2 uppercase">THREAT TRENDS</h2>
            <div className="flex flex-col gap-4 text-xs font-bold">
              {(() => {
                const history = scanHistory.length > 0 ? scanHistory : result ? [result] : [];
                const total = history.length || 1;
                const spear = Math.round((history.filter((scan) => scan.prediction !== "safe").length / total) * 100);
                const malware = Math.round((history.filter((scan) => scan.deep_prediction === "phishing").length / total) * 100);
                const credential = Math.round((history.filter((scan) => (scan.features?.suspicious_word_count || 0) > 0).length / total) * 100);

                return (
                  <>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>SPEAR PHISHING</span>
                        <span>{spear}%</span>
                      </div>
                      <div className="w-full h-3 border-2 border-[var(--border-color)] bg-[var(--bg-color)]">
                        <div className="h-full bg-danger" style={{ width: `${spear}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>MALWARE DROP</span>
                        <span>{malware}%</span>
                      </div>
                      <div className="w-full h-3 border-2 border-[var(--border-color)] bg-[var(--bg-color)]">
                        <div className="h-full bg-warning" style={{ width: `${malware}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>CREDENTIAL THEFT</span>
                        <span>{credential}%</span>
                      </div>
                      <div className="w-full h-3 border-2 border-[var(--border-color)] bg-[var(--bg-color)]">
                        <div className="h-full" style={{ width: `${credential}%`, backgroundColor: "var(--primary)" }}></div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
