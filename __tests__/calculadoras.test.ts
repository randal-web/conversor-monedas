import { describe, it, expect } from "vitest"
import { getParBySlug, getAllSlugs, getParesPopulares, getParesByOrigen, getOrigenesUnicos } from "@/lib/calculadoras"
import { pares } from "@/data/calculadoras"

describe("getParBySlug", () => {
  it("returns a par for a valid slug", () => {
    const par = getParBySlug("convertir-pesos-a-dolares")
    expect(par).toBeDefined()
    expect(par?.origen).toBe("MXN")
    expect(par?.destino).toBe("USD")
  })

  it("returns undefined for invalid slug", () => {
    expect(getParBySlug("nonexistent-slug")).toBeUndefined()
  })
})

describe("getAllSlugs", () => {
  it("returns all pairs as {par} objects", () => {
    const slugs = getAllSlugs()
    expect(slugs.length).toBe(pares.length)
    expect(slugs[0]).toHaveProperty("par")
  })

  it("each slug is a non-empty string", () => {
    const slugs = getAllSlugs()
    slugs.forEach((s) => {
      expect(typeof s.par).toBe("string")
      expect(s.par.length).toBeGreaterThan(0)
    })
  })
})

describe("getParesPopulares", () => {
  it("returns the requested number of pairs", () => {
    const top5 = getParesPopulares(5)
    expect(top5).toHaveLength(5)
  })

  it("returns pairs sorted by busquedasMes descending", () => {
    const top = getParesPopulares(10)
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].busquedasMes).toBeGreaterThanOrEqual(top[i].busquedasMes)
    }
  })
})

describe("getParesByOrigen", () => {
  it("returns all pairs for MXN origin", () => {
    const mxnPares = getParesByOrigen("MXN")
    expect(mxnPares.length).toBeGreaterThan(0)
    mxnPares.forEach((p) => expect(p.origen).toBe("MXN"))
  })

  it("returns empty array for unknown code", () => {
    expect(getParesByOrigen("INVALID")).toEqual([])
  })
})

describe("getOrigenesUnicos", () => {
  it("returns unique origin codes", () => {
    const origenes = getOrigenesUnicos()
    const unique = new Set(origenes)
    expect(origenes.length).toBe(unique.size)
  })

  it("includes MXN as an origin", () => {
    expect(getOrigenesUnicos()).toContain("MXN")
  })
})
