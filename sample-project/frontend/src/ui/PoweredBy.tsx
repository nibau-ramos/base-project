import { useAppSelector } from '../store/hooks'

// Mandatory on the login page and in the back-office: "Powered by" on one line, the ENSO logo below.
// Uses the official ENSO ORIGINS mono logo (same files as the style guide), inverted in dark mode.
export default function PoweredBy({ className = '' }: { className?: string }) {
  const isDarkMode = useAppSelector((s) => s.theme.isDarkMode)
  return (
    <a
      href="https://enso-origins.com"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex flex-col items-center gap-1.5 text-[11px] text-text-muted hover:text-text-base transition-theme ${className}`}
    >
      <span>Powered by</span>
      <img
        src={isDarkMode ? '/enso/EnsoOrigins_logo_mono_neg_rgb.svg' : '/enso/EnsoOrigins_logo_mono_pos_rgb.svg'}
        alt="ENSO ORIGINS"
        className="h-6 w-auto"
      />
    </a>
  )
}
