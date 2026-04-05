import { monedas } from "@/data/calculadoras"
import { formatearMonto } from "@/lib/tipos-de-cambio"

const LATAM_CODES = new Set(["MXN", "COP", "ARS", "BRL", "CLP"])

type Props = {
  rates: Record<string, number>
  base: string
}

export default function TablaTipos({ rates, base }: Props) {
  const codigos = Object.keys(monedas)

  // Sort: LATAM first, then alphabetical
  const sorted = [...codigos].sort((a, b) => {
    const aLatam = LATAM_CODES.has(a) ? 0 : 1
    const bLatam = LATAM_CODES.has(b) ? 0 : 1
    if (aLatam !== bLatam) return aLatam - bLatam
    return a.localeCompare(b)
  })

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Moneda</th>
            <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Código</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
              1 {base} =
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((codigo) => {
            const m = monedas[codigo]
            const rate = rates[codigo]
            if (!rate || codigo === base) return null
            return (
              <tr
                key={codigo}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                  {m.emoji} {m.nombre}
                </td>
                <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{codigo}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                  {m.simbolo}
                  {formatearMonto(rate, codigo)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
