"use client"

import { useState, useCallback, useId } from "react"
import { monedas } from "@/data/calculadoras"
import { convertir, formatearMonto, tiempoDesdeActualizacion } from "@/lib/tipos-de-cambio"

type Props = {
  origenCodigo: string
  destinoCodigo: string
  rates: Record<string, number>
  base: string
  timestamp: number
}

const codigosMoneda = Object.keys(monedas)

export default function ConversorWidget({
  origenCodigo,
  destinoCodigo,
  rates,
  base,
  timestamp,
}: Props) {
  const uid = useId()
  const [origen, setOrigen] = useState(origenCodigo)
  const [destino, setDestino] = useState(destinoCodigo)
  const [cantidadOrigen, setCantidadOrigen] = useState("1")
  const [cantidadDestino, setCantidadDestino] = useState("")
  const [ultimoEditado, setUltimoEditado] = useState<"origen" | "destino">("origen")
  const [errorOrigen, setErrorOrigen] = useState("")
  const [errorDestino, setErrorDestino] = useState("")
  const [copiado, setCopiado] = useState(false)

  const tasaOrigen = rates[origen] ?? 1
  const tasaDestino = rates[destino] ?? 1

  const tasa = tasaDestino / tasaOrigen
  const tasaInversa = tasaOrigen / tasaDestino

  const monedaOrigen = monedas[origen]
  const monedaDestino = monedas[destino]

  const validarInput = (val: string): boolean => {
    if (val === "" || val === "." || val === ",") return true
    return /^[0-9]*[.,]?[0-9]*$/.test(val)
  }

  const calcularDestino = useCallback(
    (val: string) => {
      const num = parseFloat(val.replace(/,/g, "."))
      if (!isNaN(num) && num >= 0) {
        const resultado = convertir(num, tasaOrigen, tasaDestino)
        setCantidadDestino(formatearMonto(resultado, destino))
      } else {
        setCantidadDestino("")
      }
    },
    [tasaOrigen, tasaDestino, destino]
  )

  const calcularOrigen = useCallback(
    (val: string) => {
      const num = parseFloat(val.replace(/,/g, "."))
      if (!isNaN(num) && num >= 0) {
        const resultado = convertir(num, tasaDestino, tasaOrigen)
        setCantidadOrigen(formatearMonto(resultado, origen))
      } else {
        setCantidadOrigen("")
      }
    },
    [tasaOrigen, tasaDestino, origen]
  )

  const handleOrigenChange = (val: string) => {
    if (!validarInput(val)) {
      setErrorOrigen("Solo se permiten números")
      setTimeout(() => setErrorOrigen(""), 2000)
      return
    }
    setErrorOrigen("")
    setCantidadOrigen(val)
    setUltimoEditado("origen")
    calcularDestino(val)
  }

  const handleDestinoChange = (val: string) => {
    if (!validarInput(val)) {
      setErrorDestino("Solo se permiten números")
      setTimeout(() => setErrorDestino(""), 2000)
      return
    }
    setErrorDestino("")
    setCantidadDestino(val)
    setUltimoEditado("destino")
    calcularOrigen(val)
  }

  const swap = () => {
    setOrigen(destino)
    setDestino(origen)
    if (ultimoEditado === "origen") {
      const num = parseFloat(cantidadOrigen.replace(/,/g, "."))
      if (!isNaN(num)) {
        const resultado = convertir(num, tasaDestino, tasaOrigen)
        setCantidadDestino(formatearMonto(resultado, origen))
      }
    } else {
      const num = parseFloat(cantidadDestino.replace(/,/g, "."))
      if (!isNaN(num)) {
        const resultado = convertir(num, tasaOrigen, tasaDestino)
        setCantidadOrigen(formatearMonto(resultado, destino))
      }
    }
  }

  const handleOrigenSelect = (codigo: string) => {
    setOrigen(codigo)
    const newTasaOrigen = rates[codigo] ?? 1
    const num = parseFloat(cantidadOrigen.replace(/,/g, "."))
    if (!isNaN(num)) {
      const resultado = convertir(num, newTasaOrigen, tasaDestino)
      setCantidadDestino(formatearMonto(resultado, destino))
    }
  }

  const handleDestinoSelect = (codigo: string) => {
    setDestino(codigo)
    const newTasaDestino = rates[codigo] ?? 1
    const num = parseFloat(cantidadOrigen.replace(/,/g, "."))
    if (!isNaN(num)) {
      const resultado = convertir(num, tasaOrigen, newTasaDestino)
      setCantidadDestino(formatearMonto(resultado, codigo))
    }
  }

  const resultadoNum = parseFloat(cantidadOrigen.replace(/,/g, "."))
  const resultadoFinal =
    !isNaN(resultadoNum) && resultadoNum >= 0
      ? formatearMonto(convertir(resultadoNum, tasaOrigen, tasaDestino), destino)
      : "0"

  const copiarResultado = async () => {
    const texto = `${monedaDestino?.simbolo ?? ""}${resultadoFinal} ${destino}`
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Inputs row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Origen */}
        <div className="flex-1">
          <label htmlFor={`${uid}-origen-select`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            De
          </label>
          <select
            id={`${uid}-origen-select`}
            value={origen}
            onChange={(e) => handleOrigenSelect(e.target.value)}
            aria-label="Moneda de origen"
            className="mb-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            {codigosMoneda.map((c) => (
              <option key={c} value={c}>
                {monedas[c].emoji} {c} — {monedas[c].nombre}
              </option>
            ))}
          </select>
          <div className="relative">
            <input
              id={`${uid}-origen-input`}
              type="text"
              inputMode="decimal"
              value={cantidadOrigen}
              onChange={(e) => handleOrigenChange(e.target.value)}
              placeholder="0"
              aria-label={`Cantidad en ${monedaOrigen?.nombre ?? origen}`}
              aria-invalid={!!errorOrigen}
              aria-describedby={errorOrigen ? `${uid}-error-origen` : undefined}
              className={`h-14 w-full rounded-lg border px-4 text-2xl font-semibold focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-gray-100 ${
                errorOrigen
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200 dark:border-gray-600"
              }`}
            />
            {errorOrigen && (
              <p id={`${uid}-error-origen`} className="absolute -bottom-5 left-1 text-xs text-red-500" role="alert">
                {errorOrigen}
              </p>
            )}
          </div>
        </div>

        {/* Swap button */}
        <button
          onClick={swap}
          className="flex h-14 w-14 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 bg-gray-50 text-xl transition-colors hover:bg-green-50 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none md:self-end dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Intercambiar monedas"
        >
          ↔
        </button>

        {/* Destino */}
        <div className="flex-1">
          <label htmlFor={`${uid}-destino-select`} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            A
          </label>
          <select
            id={`${uid}-destino-select`}
            value={destino}
            onChange={(e) => handleDestinoSelect(e.target.value)}
            aria-label="Moneda de destino"
            className="mb-2 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            {codigosMoneda.map((c) => (
              <option key={c} value={c}>
                {monedas[c].emoji} {c} — {monedas[c].nombre}
              </option>
            ))}
          </select>
          <div className="relative">
            <input
              id={`${uid}-destino-input`}
              type="text"
              inputMode="decimal"
              value={cantidadDestino}
              onChange={(e) => handleDestinoChange(e.target.value)}
              placeholder="0"
              aria-label={`Cantidad en ${monedaDestino?.nombre ?? destino}`}
              aria-invalid={!!errorDestino}
              aria-describedby={errorDestino ? `${uid}-error-destino` : undefined}
              className={`h-14 w-full rounded-lg border px-4 text-2xl font-semibold focus:ring-2 focus:outline-none dark:bg-gray-700 dark:text-gray-100 ${
                errorDestino
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200 dark:border-gray-600"
              }`}
            />
            {errorDestino && (
              <p id={`${uid}-error-destino`} className="absolute -bottom-5 left-1 text-xs text-red-500" role="alert">
                {errorDestino}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-8 rounded-xl bg-green-50 p-6 text-center dark:bg-green-950">
        <div className="flex items-center justify-center gap-2">
          <p className="text-5xl font-bold text-green-600 dark:text-green-400">
            {monedaDestino?.simbolo}
            {resultadoFinal}
          </p>
          <button
            onClick={copiarResultado}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-100 hover:text-green-600 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none dark:hover:bg-green-900 dark:hover:text-green-400"
            aria-label="Copiar resultado al portapapeles"
          >
            {copiado ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {copiado && (
          <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400" role="status">
            ¡Copiado!
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span aria-hidden="true">{monedaOrigen?.emoji}</span> 1 {origen} = {formatearMonto(tasa, destino)}{" "}
          {destino} <span aria-hidden="true">{monedaDestino?.emoji}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span aria-hidden="true">{monedaDestino?.emoji}</span> 1 {destino} ={" "}
          {formatearMonto(tasaInversa, origen)} {origen} <span aria-hidden="true">{monedaOrigen?.emoji}</span>
        </p>
      </div>

      {/* Timestamp */}
      <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
        Actualizado: {tiempoDesdeActualizacion(timestamp)} · Fuente: {base} via
        open.er-api.com
      </p>
    </div>
  )
}
