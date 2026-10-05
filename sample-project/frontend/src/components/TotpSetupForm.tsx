import { useState, type FormEvent, type ReactNode } from 'react'
import { TextField } from '../ui/form'

/** QR code + confirmation code for enrolling an authenticator app (used at login and in the profile). */
export default function TotpSetupForm({
  qr,
  secret,
  onConfirm,
  children,
}: {
  qr: string
  secret: string
  onConfirm: (code: string) => void
  /** Buttons rendered at the bottom of the form (submit + optional cancel). */
  children: ReactNode
}) {
  const [code, setCode] = useState('')
  return (
    <form
      className="space-y-4"
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        onConfirm(code)
      }}
    >
      <ol className="text-sm text-text-muted space-y-1 list-decimal pl-4">
        <li>Abre uma aplicação autenticadora (Google Authenticator, Microsoft Authenticator, 1Password…).</li>
        <li>Lê o código QR abaixo.</li>
        <li>Introduz o código de 6 dígitos que a aplicação mostrar.</li>
      </ol>
      <div className="flex flex-col items-center gap-2">
        <img src={qr} alt="Código QR para configurar a aplicação autenticadora" className="w-44 h-44 rounded-xl border border-border bg-white p-2" />
        <p className="text-xs text-text-muted text-center break-all">
          Chave manual: <code className="font-mono text-text-base">{secret}</code>
        </p>
      </div>
      <TextField
        label="Código"
        value={code}
        onChange={setCode}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={7}
        required
        className="tracking-[0.4em] text-center font-mono text-base"
      />
      {children}
    </form>
  )
}
