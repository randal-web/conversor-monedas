export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      {/* Title skeleton */}
      <div className="mb-6 h-9 w-3/4 rounded bg-gray-200" />

      {/* Converter widget skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-12 flex-1 rounded-lg bg-gray-200" />
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-12 flex-1 rounded-lg bg-gray-200" />
        </div>
        <div className="mx-auto h-14 w-2/3 rounded-lg bg-gray-100" />
      </div>

      {/* Timestamp skeleton */}
      <div className="mx-auto mt-3 h-4 w-40 rounded bg-gray-200" />

      {/* Ad skeleton */}
      <div className="my-6 h-24 rounded-lg bg-gray-100" />

      {/* Article skeleton */}
      <div className="mt-8 space-y-4">
        <div className="h-7 w-1/2 rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-4/5 rounded bg-gray-200" />
        </div>
      </div>

      {/* FAQ skeleton */}
      <div className="mt-8 space-y-3">
        <div className="h-7 w-48 rounded bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-lg border border-gray-200 bg-white"
          />
        ))}
      </div>
    </div>
  )
}
