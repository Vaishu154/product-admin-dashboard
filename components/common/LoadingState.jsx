export default function LoadingState({ message = "Loading..." }) {
  return (
    <div
      className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-8 text-slate-600"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
