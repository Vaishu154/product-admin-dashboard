export default function ErrorState({
  title = "Something went wrong.",
  message,
  onRetry,
  retryLabel = "Retry",
  isRetrying = false,
}) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800"
      role="alert"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      {message ? <p className="mt-2 text-sm text-red-700">{message}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-400"
        >
          {isRetrying ? "Retrying..." : retryLabel}
        </button>
      ) : null}
    </div>
  );
}
