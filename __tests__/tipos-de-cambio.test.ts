import { describe, it, expect } from "vitest"
import { convertir, formatearMonto, tiempoDesdeActualizacion } from "@/lib/tipos-de-cambio"

describe("convertir", () => {
  it("converts between currencies using cross rate", () => {
    // 100 MXN to USD: tasaOrigen=17.15 (MXN/USD), tasaDestino=1 (USD/USD)
    const result = convertir(100, 17.15, 1)
    expect(result).toBeCloseTo(5.83, 1)
  })

  it("converts 1:1 when same currency", () => {
    expect(convertir(100, 1, 1)).toBe(100)
  })

  it("handles zero amount", () => {
    expect(convertir(0, 17.15, 1)).toBe(0)
  })

  it("converts USD to MXN correctly", () => {
    // 1 USD to MXN: tasaOrigen=1, tasaDestino=17.15
    const result = convertir(1, 1, 17.15)
    expect(result).toBeCloseTo(17.15, 2)
  })

  it("handles cross rates (non-USD base)", () => {
    // 100 EUR to GBP: tasaOrigen=0.92 (EUR/USD), tasaDestino=0.79 (GBP/USD)
    const result = convertir(100, 0.92, 0.79)
    expect(result).toBeCloseTo(85.87, 1)
  })
})

describe("formatearMonto", () => {
  it("formats amounts >= 1 with 2 decimals", () => {
    const result = formatearMonto(1234.5678, "USD")
    expect(result).toMatch(/1.*234\.57|1.*234,57/)
  })

  it("formats amounts < 1 with 4 decimals", () => {
    const result = formatearMonto(0.0583, "USD")
    expect(result).toMatch(/0[.,]0583/)
  })

  it("formats JPY with zero decimals", () => {
    const result = formatearMonto(15234.78, "JPY")
    // Should round to 15235
    expect(result).toMatch(/15.*235/)
  })

  it("formats CLP with zero decimals", () => {
    const result = formatearMonto(945123.45, "CLP")
    expect(result).toMatch(/945.*123/)
  })

  it("formats KRW with zero decimals", () => {
    const result = formatearMonto(1350.6, "KRW")
    expect(result).toMatch(/1.*351/)
  })
})

describe("tiempoDesdeActualizacion", () => {
  it("returns 'hace menos de 1 hora' for recent timestamps", () => {
    const recent = Date.now() / 1000 - 1800 // 30 min ago
    expect(tiempoDesdeActualizacion(recent)).toBe("hace menos de 1 hora")
  })

  it("returns 'hace 1 hora' for 1-hour-old timestamps", () => {
    const oneHourAgo = Date.now() / 1000 - 3600
    expect(tiempoDesdeActualizacion(oneHourAgo)).toBe("hace 1 hora")
  })

  it("returns hours for multi-hour timestamps", () => {
    const fiveHoursAgo = Date.now() / 1000 - 18000
    expect(tiempoDesdeActualizacion(fiveHoursAgo)).toBe("hace 5 horas")
  })

  it("returns 'hace 1 día' for 24+ hour timestamps", () => {
    const oneDayAgo = Date.now() / 1000 - 86400
    expect(tiempoDesdeActualizacion(oneDayAgo)).toBe("hace 1 día")
  })

  it("returns days for multi-day timestamps", () => {
    const threeDaysAgo = Date.now() / 1000 - 259200
    expect(tiempoDesdeActualizacion(threeDaysAgo)).toBe("hace 3 días")
  })
})
