export default function LoadingState({ message = "Loading...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div
        className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-slate-50 text-slate-600"
        role="status"
        aria-live="polite"
      >
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white p-8 text-slate-600 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
