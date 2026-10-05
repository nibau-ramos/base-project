import { useBranding } from '../lib/branding'

/** The project's branding logo, or a monogram + title in the primary color when none is uploaded
 *  (same fallback as the style guide's login example). */
export default function BrandLogo({ size = 'md', showTitle = false }: { size?: 'sm' | 'md' | 'lg'; showTitle?: boolean }) {
  const { branding } = useBranding()
  const heights = { sm: 'h-6', md: 'h-8', lg: 'h-10' }
  const title = branding.projectTitle

  if (branding.logoUrl) {
    // Client logos are usually drawn for light backgrounds, so in dark mode they sit on a light tile.
    return (
      <span className="flex items-center gap-2.5 min-w-0">
        <img
          src={branding.logoUrl}
          alt={branding.clientName || title}
          className={`${heights[size]} w-auto max-w-40 object-contain dark:bg-white dark:rounded-md dark:px-1.5 dark:py-0.5 dark:box-content`}
        />
        {showTitle && <span className="font-semibold text-text-base truncate">{title}</span>}
      </span>
    )
  }

  const box = { sm: 'w-7 h-7 text-sm', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' }
  return (
    <span className="flex items-center gap-2.5 min-w-0">
      <span className={`${box[size]} rounded-xl flex items-center justify-center flex-shrink-0 bg-primary text-white font-bold shadow-sm`}>
        {(title || 'P').charAt(0).toUpperCase()}
      </span>
      <span className="font-bold text-text-base truncate">{title}</span>
    </span>
  )
}
