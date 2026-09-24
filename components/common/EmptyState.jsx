export default function EmptyState({ title = "No products found.", message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
      <p className="text-lg font-medium text-slate-800">{title}</p>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
    </div>
  );
}
