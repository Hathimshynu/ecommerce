export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-3">
      <div className="card grid animate-pulse gap-6 p-6 md:grid-cols-[5fr_7fr]">
        <div className="aspect-square rounded bg-gray-100" />
        <div className="space-y-4">
          <div className="h-6 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-8 w-1/3 rounded bg-gray-200" />
          <div className="h-40 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
