"use client"

import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">
        Error al cargar los datos
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        No pudimos obtener los tipos de cambio en este momento. Esto suele ser
        un problema temporal con el servicio externo.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
