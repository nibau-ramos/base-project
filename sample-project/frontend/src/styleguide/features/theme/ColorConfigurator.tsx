import { RotateCcw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setColor, resetColors, ColorKey } from '../../../store/themeSlice'

const COLOR_LABELS: Record<ColorKey, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  neutral: 'Neutral',
  accent: 'Accent',
}

export default function ColorConfigurator() {
  const dispatch = useAppDispatch()
  const colors = useAppSelector((s) => s.theme.colors)

  return (
    <div className="flex items-center gap-3">
      {(Object.keys(COLOR_LABELS) as ColorKey[]).map((key) => (
        <label key={key} className="flex items-center gap-1.5 cursor-pointer group" title={COLOR_LABELS[key]}>
          <div className="relative">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => dispatch(setColor({ key, value: e.target.value }))}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div
              className="w-6 h-6 rounded-full border-2 border-border shadow-sm group-hover:scale-110 transition-transform"
              style={{ backgroundColor: colors[key] }}
            />
          </div>
          <span className="text-xs text-text-muted hidden lg:inline">{COLOR_LABELS[key]}</span>
        </label>
      ))}
      <button
        onClick={() => dispatch(resetColors())}
        title="Repor cores originais"
        className="p-1.5 rounded-lg text-text-muted hover:text-text-base hover:bg-surface-hover transition-theme"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  )
}
