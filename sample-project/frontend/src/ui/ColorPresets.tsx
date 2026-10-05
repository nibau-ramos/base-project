import { Check } from 'lucide-react'
import { COLOR_PRESETS, sameColors } from '../lib/colorPresets'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setColors, type ColorKey } from '../store/themeSlice'

const ORDER: ColorKey[] = ['primary', 'secondary', 'neutral', 'accent']

/** One-click color schemes. Applies the 4 colors to the live theme; saving (if any) is up to the page. */
export default function ColorPresets() {
  const dispatch = useAppDispatch()
  const current = useAppSelector((s) => s.theme.colors)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {COLOR_PRESETS.map((preset) => {
        const active = sameColors(preset.colors, current)
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => dispatch(setColors(preset.colors))}
            aria-pressed={active}
            title={preset.description}
            className={`group text-left rounded-xl border overflow-hidden transition-all duration-150 bg-bg
              hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
              ${active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}
          >
            <div className="flex h-10">
              {ORDER.map((key) => (
                <span key={key} className="flex-1" style={{ backgroundColor: preset.colors[key] }} />
              ))}
            </div>
            <div className="px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-text-base">{preset.name}</span>
                {active && <Check size={14} className="text-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-text-muted mt-0.5 leading-snug line-clamp-2">{preset.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
