import Link from "next/link"
import { getParesPopulares, getOrigenesUnicos, getParesByOrigen } from "@/lib/calculadoras"
import { pares, monedas } from "@/data/calculadoras"
import { getTipoCambio } from "@/lib/tipos-de-cambio"
import ConversorWidget from "@/components/ConversorWidget"
import TablaTipos from "@/components/TablaTipos"

export const revalidate = 21600 // REVALIDATE_SECONDS (6h)

export default async function Home() {
  const tipoCambio = await getTipoCambio("USD")
  const populares = getParesPopulares(12)
  const origenes = getOrigenesUnicos()

  return (
    <>
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Conversor de divisas y tipos de cambio
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Convierte entre las principales monedas del mundo con tipos de cambio
          actualizados. Rápido, preciso y gratuito.
        </p>
      </section>

      {/* Hero converter: USD ↔ MXN */}
      <section className="mx-auto mb-12 max-w-3xl">
        <ConversorWidget
          origenCodigo="USD"
          destinoCodigo="MXN"
          rates={tipoCambio.rates}
          base={tipoCambio.base}
          timestamp={tipoCambio.timestamp}
        />
      </section>

      {/* Popular pairs grid */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Conversiones más populares
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {populares.map((p) => {
            const mO = monedas[p.origen]
            const mD = monedas[p.destino]
            return (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-700"
              >
                <span className="text-2xl">{mO?.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {p.origen} → {p.destino}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mO?.nombre} a {mD?.nombre}
                  </p>
                </div>
                <span className="text-2xl">{mD?.emoji}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Exchange rates table */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Tipos de cambio respecto al USD hoy
        </h2>
        <TablaTipos rates={tipoCambio.rates} base="USD" />
      </section>

      {/* All pairs grouped by origin */}
      {origenes.map((codigo) => {
        const m = monedas[codigo]
        const paresOrigen = getParesByOrigen(codigo)
        if (!m || paresOrigen.length === 0) return null
        return (
          <section key={codigo} id={codigo} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              {m.emoji} Convertir desde {m.nombre} ({codigo})
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {paresOrigen.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-700"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {p.titulo.split("—")[0].trim()}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {p.descripcion}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
