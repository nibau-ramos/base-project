import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Adapted from the ENSO style guide. Differences: the "default" colors are the project's branding colors
// (loaded from the API), and the dark-mode choice is remembered in the browser.

export type ColorKey = 'primary' | 'secondary' | 'neutral' | 'accent'
export type ThemeColors = Record<ColorKey, string>

export interface ThemeState {
  colors: ThemeColors
  /** Colors saved in the branding settings; "reset" in the style guide goes back to these. */
  brandColors: ThemeColors
  isDarkMode: boolean
  /** Logo preview used only inside the style guide's configuration page. */
  logoUrl: string | null
}

export const DEFAULT_COLORS: ThemeColors = {
  primary: '#0086ac',
  secondary: '#0f172a',
  neutral: '#6b7280',
  accent: '#f97316',
}

const DARK_MODE_KEY = 'theme:dark'

function readDarkMode(): boolean {
  try {
    const saved = localStorage.getItem(DARK_MODE_KEY)
    if (saved !== null) return saved === '1'
  } catch {
    // storage unavailable (private mode, blocked): fall through to the system preference
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function applyColorToDOM(key: ColorKey, value: string) {
  document.documentElement.style.setProperty(`--color-${key}`, value)
}

function applyColorsToDOM(colors: ThemeColors) {
  ;(Object.keys(colors) as ColorKey[]).forEach((key) => applyColorToDOM(key, colors[key]))
}

function applyDarkModeToDOM(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
  try {
    localStorage.setItem(DARK_MODE_KEY, isDark ? '1' : '0')
  } catch {
    // not critical
  }
}

const initialState: ThemeState = {
  colors: { ...DEFAULT_COLORS },
  brandColors: { ...DEFAULT_COLORS },
  isDarkMode: readDarkMode(),
  logoUrl: null,
}

applyColorsToDOM(initialState.colors)
applyDarkModeToDOM(initialState.isDarkMode)

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColor(state, action: PayloadAction<{ key: ColorKey; value: string }>) {
      const { key, value } = action.payload
      state.colors[key] = value
      applyColorToDOM(key, value)
    },
    setColors(state, action: PayloadAction<ThemeColors>) {
      state.colors = action.payload
      applyColorsToDOM(action.payload)
    },
    /** Called whenever branding is loaded or saved. */
    setBrandColors(state, action: PayloadAction<ThemeColors>) {
      state.brandColors = action.payload
      state.colors = action.payload
      applyColorsToDOM(action.payload)
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode
      applyDarkModeToDOM(state.isDarkMode)
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload
      applyDarkModeToDOM(state.isDarkMode)
    },
    resetColors(state) {
      state.colors = { ...state.brandColors }
      applyColorsToDOM(state.colors)
    },
    setLogoUrl(state, action: PayloadAction<string | null>) {
      state.logoUrl = action.payload
    },
  },
})

export const { setColor, setColors, setBrandColors, toggleDarkMode, setDarkMode, resetColors, setLogoUrl } =
  themeSlice.actions
export default themeSlice.reducer
