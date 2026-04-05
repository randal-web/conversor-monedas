import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllSlugs, getParBySlug } from "@/lib/calculadoras"
import { monedas } from "@/data/calculadoras"
import { getTipoCambio, convertir, formatearMonto, tiempoDesdeActualizacion } from "@/lib/tipos-de-cambio"
import ConversorWidget from "@/components/ConversorWidget"
import ArticuloSEO from "@/components/ArticuloSEO"
import AdSenseAd from "@/components/AdSenseAd"
import GraficoHistorico from "@/components/GraficoHistorico"
import { getHistorico } from "@/lib/historico"

export const revalidate = 21600 // REVALIDATE_SECONDS (6h)

type Props = {
  params: Promise<{ par: string }>
}

export async function generateStaticParams() {
  return getAllSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { par: slug } = await params
  const par = getParBySlug(slug)
  if (!par) return {}

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://divisas.globalmanager.online"
  const canonical = `${baseUrl}/${par.slug}`

  return {
    title: par.titulo,
    description: par.descripcion,
    keywords: par.keywords,
    alternates: { canonical },
    openGraph: {
      title: par.titulo,
      description: par.descripcion,
      url: canonical,
      siteName: "Conversor de Divisas",
      type: "website",
      locale: "es_MX",
    },
  }
}

const MONTOS_FAQ = [100, 500, 1000]

export default async function ParPage({ params }: Props) {
  const { par: slug } = await params
  const par = getParBySlug(slug)
  if (!par) notFound()

  const tipoCambio = await getTipoCambio("USD")
  const rates = tipoCambio.rates

  const tasaOrigen = rates[par.origen] ?? 1
  const tasaDestino = rates[par.destino] ?? 1

  const mOrigen = monedas[par.origen]
  const mDestino = monedas[par.destino]

  const historico = await getHistorico(par.origen, par.destino, 30)

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://divisas.globalmanager.online"
  const canonical = `${baseUrl}/${par.slug}`

  // FAQ schema
  const faqEntries = MONTOS_FAQ.map((monto) => {
    const resultado = convertir(monto, tasaOrigen, tasaDestino)
    return {
      "@type": "Question" as const,
      name: `¿Cuánto es ${monto} ${mOrigen?.nombre ?? par.origen} en ${mDestino?.nombre ?? par.destino} hoy?`,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: `${monto} ${par.origen} equivalen a aproximadamente ${formatearMonto(resultado, par.destino)} ${par.destino} al tipo de cambio actual.`,
      },
    }
  })

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: par.titulo,
      description: par.descripcion,
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntries,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `Convertir ${par.origen}`,
          item: `${baseUrl}/#${par.origen}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${par.origen} a ${par.destino}`,
          item: canonical,
        },
      ],
    },
  ]

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          {par.titulo}
        </h1>

        <ConversorWidget
          origenCodigo={par.origen}
          destinoCodigo={par.destino}
          rates={rates}
          base={tipoCambio.base}
          timestamp={tipoCambio.timestamp}
        />

        <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          Actualizado: {tiempoDesdeActualizacion(tipoCambio.timestamp)}
        </p>

        {historico.length > 1 && (
          <div className="mt-6">
            <GraficoHistorico
              data={historico}
              origen={par.origen}
              destino={par.destino}
            />
          </div>
        )}

        <AdSenseAd slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_1 ?? ""} />

        <ArticuloSEO par={par} rates={rates} />

        {/* FAQ section visible */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqEntries.map((faq, i) => (
              <details
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200">
                  {faq.name}
                </summary>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>

        <AdSenseAd slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_2 ?? ""} />
      </div>

      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
