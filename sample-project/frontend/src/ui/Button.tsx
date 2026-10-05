import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Variants and sizes from the style guide (/styleguide/buttons).
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'subtle' | 'destructive' | 'destructive-outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:opacity-90 active:scale-[0.98]',
  secondary: 'bg-secondary text-white hover:opacity-90 active:scale-[0.98] dark:bg-white/10',
  ghost: 'bg-transparent text-text-base hover:bg-surface-hover active:scale-[0.98]',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10 active:scale-[0.98]',
  subtle: 'bg-transparent border border-border text-text-muted hover:text-text-base hover:bg-surface-hover',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
  'destructive-outline':
    'bg-transparent border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2.5',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', block = false) {
  return `inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${variantClasses[variant]} ${sizeClasses[size]} ${block ? 'w-full' : ''}`
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  block?: boolean
}

export function Button({ variant, size = 'md', loading, icon, block, children, disabled, className = '', ...rest }: ButtonProps) {
  return (
    <button {...rest} disabled={disabled || loading} className={`${buttonClasses(variant, size, block)} ${className}`}>
      {loading ? <Loader2 size={size === 'sm' ? 12 : 15} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant,
  size,
  block,
  icon,
  children,
}: {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <Link to={to} className={buttonClasses(variant, size, block)}>
      {icon}
      {children}
    </Link>
  )
}

export function IconButton({
  label,
  tone = 'default',
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: 'default' | 'primary' | 'danger' }) {
  const tones = {
    default: 'hover:text-text-base hover:bg-surface-hover',
    primary: 'hover:text-primary hover:bg-primary/10',
    danger: 'hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30',
  }
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...rest}
      className={`p-2 rounded-lg text-text-muted transition-theme ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}
