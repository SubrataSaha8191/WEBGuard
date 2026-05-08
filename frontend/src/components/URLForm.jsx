import { useState } from "react";

export default function URLForm({ onScan, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="retro-input p-3 w-full font-bold focus:ring-0"
      />

      <button
        type="submit"
        disabled={loading}
        className="retro-button p-3 w-full"
      >
        {loading ? "SCANNING..." : "ANALYZE URL"}
      </button>
    </form>
  );
}
