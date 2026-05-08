export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-16 h-16 border-8 border-[var(--border-color)] border-t-[var(--primary)] rounded-full animate-spin mb-6" />
      <p className="text-2xl font-bold font-[var(--font-heading)] uppercase tracking-widest text-[var(--test-main)]">
        ANALYZING DATA...
      </p>
    </div>
  );
}
