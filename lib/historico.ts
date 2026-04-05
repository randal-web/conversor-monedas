import { REVALIDATE_SECONDS } from "@/lib/constants"

export type HistoricalRate = {
  date: string
  rate: number
}

const HISTORICO_TIMEOUT_MS = 8_000

export async function getHistorico(
  origen: string,
  destino: string,
  dias: number = 30
): Promise<HistoricalRate[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - dias)

  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), HISTORICO_TIMEOUT_MS)

  try {
    const res = await fetch(
      `https://api.frankfurter.dev/${fmt(start)}..${fmt(end)}?from=${encodeURIComponent(origen)}&to=${encodeURIComponent(destino)}`,
      { next: { revalidate: REVALIDATE_SECONDS }, signal: controller.signal }
    )

    if (!res.ok) return []

    const data = await res.json()
    const rates: Record<string, Record<string, number>> = data.rates ?? {}

    return Object.entries(rates)
      .map(([date, rateObj]) => ({
        date,
        rate: rateObj[destino] ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return []
  } finally {
    clearTimeout(timeout)
  }
}
