import { ParDivisas } from "@/types"
import { monedas } from "@/data/calculadoras"
import { convertir, formatearMonto } from "@/lib/tipos-de-cambio"

type Props = {
  par: ParDivisas
  rates: Record<string, number>
}

const MONTOS_REFERENCIA = [1, 5, 10, 50, 100, 500, 1000, 5000]

export default function ArticuloSEO({ par, rates }: Props) {
  const mOrigen = monedas[par.origen]
  const mDestino = monedas[par.destino]
  const tasaOrigen = rates[par.origen] ?? 1
  const tasaDestino = rates[par.destino] ?? 1

  const nombreOrigen = mOrigen?.nombre ?? par.origen
  const nombreDestino = mDestino?.nombre ?? par.destino
  const paisOrigen = mOrigen?.pais ?? ""
  const paisDestino = mDestino?.pais ?? ""
  const simboloDestino = mDestino?.simbolo ?? ""

  return (
    <article className="prose prose-gray mx-auto mt-8 max-w-none">
      {/* Tabla de referencia */}
      <h2>Tabla de conversión {par.origen} a {par.destino}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-gray-300 px-4 py-2 font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300">
                {mOrigen?.emoji} {par.origen}
              </th>
              <th className="border-b border-gray-300 px-4 py-2 font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-300">
                {mDestino?.emoji} {par.destino}
              </th>
            </tr>
          </thead>
          <tbody>
            {MONTOS_REFERENCIA.map((monto) => {
              const resultado = convertir(monto, tasaOrigen, tasaDestino)
              return (
                <tr key={monto} className="even:bg-gray-50 dark:even:bg-gray-800">
                  <td className="border-b border-gray-200 px-4 py-2 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    {mOrigen?.simbolo}{formatearMonto(monto, par.origen)} {par.origen}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                    {simboloDestino}{formatearMonto(resultado, par.destino)} {par.destino}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Artículo SEO */}
      <h2>¿Cómo convertir {nombreOrigen} a {nombreDestino}?</h2>
      <p>
        Convertir {nombreOrigen} ({par.origen}) a {nombreDestino} ({par.destino}) es una de las conversiones de divisas más buscadas por personas que realizan comercio internacional, envían remesas, viajan o simplemente necesitan conocer el valor de su dinero en otra moneda. El tipo de cambio entre el {nombreOrigen} y el {nombreDestino} fluctúa constantemente debido a factores económicos, políticos y de mercado.
      </p>
      <p>
        Para realizar la conversión solo necesitas conocer el tipo de cambio actual. Nuestra calculadora obtiene las tasas actualizadas automáticamente y te muestra el resultado en tiempo real. Simplemente ingresa la cantidad en {nombreOrigen} y obtendrás la equivalencia en {nombreDestino} al instante, o viceversa gracias al conversor bidireccional.
      </p>

      <h2>¿Para qué sirve este conversor de {par.origen} a {par.destino}?</h2>
      <p>
        Este conversor es útil en múltiples escenarios: si viajas de {paisOrigen} a {paisDestino} y necesitas saber cuánto valen tus {nombreOrigen} al llegar, si recibes pagos en {par.destino} y quieres saber su equivalencia en {par.origen}, si realizas compras en línea en tiendas internacionales, o si trabajas como freelancer y recibes pagos en divisas extranjeras. También es una herramienta valiosa para inversionistas que siguen el comportamiento del tipo de cambio.
      </p>
      <p>
        Las tasas de cambio que mostramos provienen de fuentes abiertas y se actualizan periódicamente. Sin embargo, ten en cuenta que el tipo de cambio real que obtengas al realizar una operación bancaria o en casa de cambio puede incluir comisiones o spreads adicionales. Te recomendamos usar esta herramienta como referencia y verificar con tu institución financiera antes de realizar operaciones importantes.
      </p>

      <h2>Factores que influyen en el tipo de cambio {par.origen}/{par.destino}</h2>
      <p>
        El tipo de cambio entre estas dos monedas se ve afectado por diversos factores: las decisiones de política monetaria de los bancos centrales de {paisOrigen} y {paisDestino}, la balanza comercial entre ambas economías, los flujos de inversión extranjera, la inflación relativa, los precios de materias primas y el sentimiento general del mercado. Eventos geopolíticos y decisiones económicas importantes también pueden generar movimientos significativos en el tipo de cambio.
      </p>
    </article>
  )
}
