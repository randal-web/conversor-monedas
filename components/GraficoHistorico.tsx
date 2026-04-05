"use client"

import { useMemo } from "react"
import type { HistoricalRate } from "@/lib/historico"

type Props = {
  data: HistoricalRate[]
  origen: string
  destino: string
}

export default function GraficoHistorico({ data, origen, destino }: Props) {
  const { points, minRate, maxRate, minDate, maxDate, currentRate, changePercent } =
    useMemo(() => {
      if (data.length === 0)
        return { points: "", minRate: 0, maxRate: 0, minDate: "", maxDate: "", currentRate: 0, changePercent: 0 }

      const rates = data.map((d) => d.rate)
      const min = Math.min(...rates)
      const max = Math.max(...rates)
      const padding = (max - min) * 0.1 || 0.01
      const yMin = min - padding
      const yMax = max + padding

      const W = 600
      const H = 200

      const pts = data
        .map((d, i) => {
          const x = (i / (data.length - 1)) * W
          const y = H - ((d.rate - yMin) / (yMax - yMin)) * H
          return `${x},${y}`
        })
        .join(" ")

      const first = rates[0]
      const last = rates[rates.length - 1]
      const pct = ((last - first) / first) * 100

      return {
        points: pts,
        minRate: min,
        maxRate: max,
        minDate: data[0].date,
        maxDate: data[data.length - 1].date,
        currentRate: last,
        changePercent: pct,
      }
    }, [data])

  if (data.length < 2) return null

  const isPositive = changePercent >= 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {origen}/{destino} — Últimos 30 días
        </h3>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isPositive
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>

      <svg
        viewBox="0 0 600 200"
        className="w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Gráfico de ${origen} a ${destino} en los últimos 30 días`}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1="0"
            y1={pct * 200}
            x2="600"
            y2={pct * 200}
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-700"
            strokeWidth="1"
          />
        ))}
        {/* Rate line */}
        <polyline
          fill="none"
          stroke={isPositive ? "#16a34a" : "#dc2626"}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>

      <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{minDate}</span>
        <span>
          Mín: {minRate.toFixed(4)} · Máx: {maxRate.toFixed(4)}
        </span>
        <span>{maxDate}</span>
      </div>
    </div>
  )
}
