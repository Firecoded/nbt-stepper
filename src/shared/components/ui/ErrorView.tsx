interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorView({
  title = 'Something went wrong',
  message = "We couldn't load your session. Please try again.",
  onRetry,
}: ErrorViewProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-nbt-bg px-4 text-center">
      <p className="font-semibold text-nbt-text">{title}</p>
      <p className="text-sm text-nbt-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl border border-nbt-border bg-nbt-surface px-5 py-2.5 text-sm font-medium text-nbt-text transition-colors hover:border-nbt-primary/50"
        >
          Try again
        </button>
      )}
    </div>
  );
}
