import { Sun, Moon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { toggleDarkMode } from '../../../store/themeSlice'

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector((s) => s.theme.isDarkMode)

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      title={isDarkMode ? 'Mudar para light mode' : 'Mudar para dark mode'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        bg-surface border border-border text-text-base
        hover:bg-surface-hover transition-theme"
    >
      {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
      <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
    </button>
  )
}
