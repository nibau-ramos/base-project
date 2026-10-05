import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../styleguide/features/theme/ThemeToggle'
import PoweredBy from '../ui/PoweredBy'
import BrandLogo from './BrandLogo'

// Shell for login, OTP, forgot and reset password, based on the style guide's login example.
export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <div className="flex justify-end p-3">
        <ThemeToggle />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-10">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <Link to="/" className="flex justify-center mb-7">
            <BrandLogo size="lg" />
          </Link>
          <h1 className="text-xl font-bold text-text-base">{title}</h1>
          {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        <PoweredBy />
      </main>
    </div>
  )
}
