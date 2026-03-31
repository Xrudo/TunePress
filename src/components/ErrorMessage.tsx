interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="rule-thick pb-6 pt-4">
        <p className="kicker text-scarlet mb-2">Error</p>
        <h2 className="headline text-2xl mb-3">Could not load content</h2>
        <p className="font-body text-sm text-smudge mb-6">{message}</p>
        <button className="btn-outline" onClick={onRetry}>Try again</button>
      </div>
    </div>
  );
}
