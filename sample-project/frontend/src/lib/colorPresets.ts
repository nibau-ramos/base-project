import type { ThemeColors } from '../store/themeSlice'

// Ready-made 4-color schemes for the branding settings and the style guide.
// Each one keeps the style guide's roles: primary = brand/buttons (works with white text), secondary = very dark
// tone for dark surfaces/text, neutral = mid grey with a hint of the brand hue, accent = contrasting highlight.
export interface ColorPreset {
  id: string
  name: string
  description: string
  colors: ThemeColors
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'enso',
    name: 'ENSO',
    description: 'Azul petróleo da ENSO com laranja de destaque.',
    colors: { primary: '#0086ac', secondary: '#0f172a', neutral: '#6b7280', accent: '#f97316' },
  },
  {
    id: 'oceano',
    name: 'Oceano',
    description: 'Azul profundo e turquesa, sóbrio e institucional.',
    colors: { primary: '#1d4ed8', secondary: '#0b1a33', neutral: '#64748b', accent: '#14b8a6' },
  },
  {
    id: 'floresta',
    name: 'Floresta',
    description: 'Verdes naturais com dourado, para sustentabilidade e saúde.',
    colors: { primary: '#15803d', secondary: '#13231a', neutral: '#6b7266', accent: '#ca8a04' },
  },
  {
    id: 'terracota',
    name: 'Terracota',
    description: 'Barro quente com verde-água, acolhedor e mediterrânico.',
    colors: { primary: '#c2410c', secondary: '#2a1810', neutral: '#78716c', accent: '#0f766e' },
  },
  {
    id: 'ameixa',
    name: 'Ameixa',
    description: 'Violeta com rosa, criativo e tecnológico.',
    colors: { primary: '#7c3aed', secondary: '#1c1330', neutral: '#71717a', accent: '#db2777' },
  },
  {
    id: 'rubi',
    name: 'Rubi',
    description: 'Vermelho intenso com âmbar, para marcas fortes.',
    colors: { primary: '#be123c', secondary: '#1f1216', neutral: '#737373', accent: '#f59e0b' },
  },
  {
    id: 'grafite',
    name: 'Grafite',
    description: 'Cinzentos neutros com azul elétrico, minimalista.',
    colors: { primary: '#334155', secondary: '#020617', neutral: '#6b7280', accent: '#0ea5e9' },
  },
]

export const sameColors = (a: ThemeColors, b: ThemeColors) =>
  (Object.keys(a) as (keyof ThemeColors)[]).every((k) => a[k].toLowerCase() === b[k].toLowerCase())
