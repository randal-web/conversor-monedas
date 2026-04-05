import { pares } from "@/data/calculadoras"
import { ParDivisas } from "@/types"

export function getParBySlug(slug: string): ParDivisas | undefined {
  return pares.find((p) => p.slug === slug)
}

export function getAllSlugs(): { par: string }[] {
  return pares.map((p) => ({ par: p.slug }))
}

export function getParesPopulares(limit = 12): ParDivisas[] {
  return [...pares].sort((a, b) => b.busquedasMes - a.busquedasMes).slice(0, limit)
}

export function getParesByOrigen(codigo: string): ParDivisas[] {
  return pares.filter((p) => p.origen === codigo)
}

export function getOrigenesUnicos(): string[] {
  return [...new Set(pares.map((p) => p.origen))]
}
