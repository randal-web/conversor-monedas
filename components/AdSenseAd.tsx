"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdSenseAd({
  slot,
  format = "auto",
}: {
  slot: string
  format?: string
}) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense not loaded (dev environment)
    }
  }, [])

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_ID

  if (!adClient) {
    return (
      <div className="my-6 flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500">
        Espacio publicitario
      </div>
    )
  }

  return (
    <div ref={adRef} className="my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
