export type Moneda = {
  codigo: string
  nombre: string
  simbolo: string
  pais: string
  emoji: string
}

export type ParDivisas = {
  slug: string
  origen: string
  destino: string
  titulo: string
  descripcion: string
  keywords: string[]
  busquedasMes: number
}

export type TipoCambio = {
  base: string
  rates: Record<string, number>
  timestamp: number
}
