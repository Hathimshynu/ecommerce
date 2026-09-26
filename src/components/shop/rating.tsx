export function RatingBadge({ rating, className = "" }: { rating: number; className?: string }) {
  const color = rating >= 4 ? "bg-success" : rating >= 3 ? "bg-lime-600" : rating >= 2 ? "bg-orange-500" : "bg-red-500";
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 text-xs font-semibold text-white ${color} ${className}`}>
      {rating.toFixed(1)}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3l5.4 4.7-1.6 7z" />
      </svg>
    </span>
  );
}
