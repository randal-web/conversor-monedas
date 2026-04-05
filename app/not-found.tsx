import Link from "next/link"
import { getParesPopulares } from "@/lib/calculadoras"

export default function NotFound() {
  const populares = getParesPopulares(6)

  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Página no encontrada
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        La conversión que buscas no existe o la URL es incorrecta.
      </p>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Prueba con estas conversiones populares:
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {populares.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 dark:border-gray-700 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            >
              {p.origen} → {p.destino}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
      >
        Ir al inicio
      </Link>
    </div>
  )
}
