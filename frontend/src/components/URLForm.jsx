import { useState } from "react";

export default function URLForm({ onScan, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) return;

    onScan(url);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      <input
        type="text"
        placeholder="Enter URL to scan..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
          loading
            ? "bg-cyan-700 animate-pulse"
            : "bg-cyan-500 hover:bg-cyan-600 hover:scale-[1.01] cursor-pointer"
        }`}
      >
        {loading ? "Scanning..." : "Scan URL"}
      </button>
    </form>
  );
}