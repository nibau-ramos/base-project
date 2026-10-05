import type { ColorKey } from '../store/themeSlice'

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [h * 360, s * 100, l * 100]
}

export function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0')).join('')
}

export function extractColorsFromImage(imgEl: HTMLImageElement): string[] {
  const canvas = document.createElement('canvas')
  const SIZE = 140
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return []
  ctx.drawImage(imgEl, 0, 0, SIZE, SIZE)

  let imageData: ImageData
  try {
    imageData = ctx.getImageData(0, 0, SIZE, SIZE)
  } catch {
    return []
  }

  const { data } = imageData
  const colorMap = new Map<string, number>()
  const STEP = 22

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3]
    if (a < 100) continue                        // skip transparent
    if (r > 238 && g > 238 && b > 238) continue  // skip near-white
    if (r < 12 && g < 12 && b < 12) continue     // skip pure-black noise
    const key = `${Math.round(r/STEP)*STEP},${Math.round(g/STEP)*STEP},${Math.round(b/STEP)*STEP}`
    colorMap.set(key, (colorMap.get(key) || 0) + 1)
  }

  const sorted = [...colorMap.entries()].sort((a, b) => b[1] - a[1])

  const unique: string[] = []
  for (const [key] of sorted) {
    const [r, g, b] = key.split(',').map(Number)
    const hex = rgbToHex(r, g, b)
    const tooClose = unique.some(u => {
      const [ur, ug, ub] = hexToRgb(u)
      return Math.abs(ur - r) + Math.abs(ug - g) + Math.abs(ub - b) < 55
    })
    if (!tooClose) unique.push(hex)
    if (unique.length >= 8) break
  }

  return unique
}

interface ColorInfo { hex: string; h: number; s: number; l: number }

export function suggestThemeColors(hexColors: string[]): Record<ColorKey, string> {
  if (hexColors.length === 0) {
    return { primary: '#0086ac', secondary: '#0f172a', neutral: '#6b7280', accent: '#f97316' }
  }

  const colors: ColorInfo[] = hexColors.map(hex => {
    const [r, g, b] = hexToRgb(hex)
    const [h, s, l] = rgbToHsl(r, g, b)
    return { hex, h, s, l }
  })

  // Primary: most saturated with viable lightness
  const primary = colors
    .filter(c => c.l > 18 && c.l < 80 && c.s > 12)
    .sort((a, b) => b.s - a.s)[0] ?? colors[0]

  // Secondary: darkest (good for text / dark backgrounds)
  const secondary = colors
    .filter(c => c.hex !== primary.hex)
    .sort((a, b) => a.l - b.l)[0] ?? colors[1] ?? primary

  // Neutral: least saturated remaining, mid-lightness
  const neutral = colors
    .filter(c => c.hex !== primary.hex && c.hex !== secondary.hex && c.l > 18 && c.l < 82)
    .sort((a, b) => a.s - b.s)[0]
    ?? colors.find(c => c.hex !== primary.hex && c.hex !== secondary.hex)
    ?? primary

  // Accent: high saturation, meaningfully different hue from primary (>40°)
  const hueDiff = (a: number, b: number) => {
    const d = Math.abs(a - b)
    return d > 180 ? 360 - d : d
  }
  const accent = colors
    .filter(c => {
      if ([primary.hex, secondary.hex, neutral.hex].includes(c.hex)) return false
      return hueDiff(c.h, primary.h) > 40 && c.s > 20
    })
    .sort((a, b) => b.s - a.s)[0]
    ?? colors.find(c => ![primary.hex, secondary.hex, neutral.hex].includes(c.hex))
    ?? primary

  return { primary: primary.hex, secondary: secondary.hex, neutral: neutral.hex, accent: accent.hex }
}
