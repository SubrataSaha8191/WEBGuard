import { useState } from "react";

import API from "./services/api";

import URLForm from "./components/URLForm";
import ResultCard from "./components/ResultCard";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (url) => {
    try {
      setLoading(true);

      const response = await API.post("/scan-url", {
        url,
      });

      setResult(response.data);

    } catch (error) {
      console.error(error);
      alert("Error scanning URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl">
        <h1 className="text-6xl font-extrabold mb-2 text-center tracking-tight">
          PhishGuard
        </h1>

        <p className="text-slate-400 text-center mb-8">
          AI-Powered Phishing Detection Platform
        </p>

        <URLForm
          onScan={handleScan}
          loading={loading}
        />

        <ResultCard result={result} />
      </div>
    </div>
  );
}