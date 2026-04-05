import Link from "next/link"
import { getParesPopulares } from "@/lib/calculadoras"
import ThemeToggle from "@/components/ThemeToggle"

export default function NavBar() {
  const topPares = getParesPopulares(6)

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-green-600 dark:text-green-400">
          💱 Conversor de Divisas
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          {topPares.map((p) => (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="rounded-full px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-green-400"
            >
              {p.origen} → {p.destino}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
