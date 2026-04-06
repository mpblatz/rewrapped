export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-8 text-center">
      <p className="text-text font-semibold text-[13px] mb-1">
        Something went wrong
      </p>
      <p className="text-text-muted text-[11px] mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-accent text-white rounded-lg text-[11px] font-semibold hover:bg-link-hover transition-colors duration-200 cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}
