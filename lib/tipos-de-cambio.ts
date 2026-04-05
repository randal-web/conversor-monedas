import { z } from "zod/v4"
import { TipoCambio } from "@/types"
import { REVALIDATE_SECONDS } from "@/lib/constants"

const ApiResponseSchema = z.object({
  base_code: z.string(),
  rates: z.record(z.string(), z.number()),
  time_last_update_unix: z.number(),
})

const API_TIMEOUT_MS = 10_000

export async function getTipoCambio(base: string): Promise<TipoCambio> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`,
      { next: { revalidate: REVALIDATE_SECONDS }, signal: controller.signal }
    )

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`)
    }

    const raw = await res.json()
    const data = ApiResponseSchema.parse(raw)

    return {
      base: data.base_code,
      rates: data.rates,
      timestamp: data.time_last_update_unix,
    }
  } finally {
    clearTimeout(timeout)
  }
}

export function convertir(
  cantidad: number,
  tasaOrigen: number,
  tasaDestino: number
): number {
  return cantidad * (tasaDestino / tasaOrigen)
}

const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "CLP", "KRW", "VND"])

export function formatearMonto(cantidad: number, codigoMoneda: string): string {
  if (ZERO_DECIMAL_CURRENCIES.has(codigoMoneda)) {
    return Math.round(cantidad).toLocaleString("es-MX")
  }
  if (cantidad >= 1) {
    return cantidad.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return cantidad.toLocaleString("es-MX", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function tiempoDesdeActualizacion(timestamp: number): string {
  const ahora = Date.now() / 1000
  const diff = ahora - timestamp
  const horas = Math.floor(diff / 3600)
  if (horas < 1) return "hace menos de 1 hora"
  if (horas === 1) return "hace 1 hora"
  if (horas < 24) return `hace ${horas} horas`
  const dias = Math.floor(horas / 24)
  if (dias === 1) return "hace 1 día"
  return `hace ${dias} días`
}
