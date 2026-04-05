export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <section className="mb-10 text-center">
        <div className="mx-auto mb-4 h-10 w-3/4 rounded bg-gray-200" />
        <div className="mx-auto h-5 w-1/2 rounded bg-gray-200" />
      </section>

      {/* Converter widget skeleton */}
      <section className="mx-auto mb-12 max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-12 flex-1 rounded-lg bg-gray-200" />
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="h-12 flex-1 rounded-lg bg-gray-200" />
          </div>
          <div className="mx-auto h-14 w-2/3 rounded-lg bg-gray-100" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="mb-12">
        <div className="mb-6 h-8 w-64 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 h-5 w-24 rounded bg-gray-200" />
              <div className="h-4 w-36 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
