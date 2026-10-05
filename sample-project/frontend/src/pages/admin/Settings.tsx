import { Check, Inbox, Mail, Palette, RefreshCw, RotateCcw, Send, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../../lib/api'
import { useCurrentUser } from '../../lib/auth'
import { useBranding } from '../../lib/branding'
import { useAppConfig } from '../../lib/config'
import { extractColorsFromImage, suggestThemeColors } from '../../lib/colorExtraction'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { resetColors, setColor, setColors, type ColorKey, type ThemeColors } from '../../store/themeSlice'
import { Button } from '../../ui/Button'
import ColorPresets from '../../ui/ColorPresets'
import { Alert, Spinner } from '../../ui/feedback'
import { Checkbox, PasswordField, SelectField, TextField } from '../../ui/form'
import { Card, PageHeader, Tabs } from '../../ui/layout'

/* ─── E-mail ─────────────────────────────────────────────────────────────── */

interface EmailSettingsData {
  host: string
  port: number | string
  protocol: string
  ssl: boolean
  ignoreCertificates: boolean
  user: string
  fromAddress: string
  hasPassword: boolean
}

function useStatus() {
  const [status, setStatus] = useState({ error: '', message: '', busy: false })
  const run = async (fn: () => Promise<string | void>) => {
    setStatus({ error: '', message: '', busy: true })
    try {
      setStatus({ error: '', message: (await fn()) || '', busy: false })
    } catch (err) {
      setStatus({ error: errorMessage(err), message: '', busy: false })
    }
  }
  return [status, run] as const
}

function EmailSettings() {
  const me = useCurrentUser()
  const { mailpitUrl } = useAppConfig()
  const [form, setForm] = useState<EmailSettingsData | null>(null)
  const [password, setPassword] = useState('')
  const [clearPassword, setClearPassword] = useState(false)
  const [testTo, setTestTo] = useState(me.email)
  const [status, run] = useStatus()
  const [testStatus, runTest] = useStatus()

  useEffect(() => {
    api<EmailSettingsData>('/settings/email').then(setForm)
  }, [])

  if (!form) return <Spinner />
  const set = <K extends keyof EmailSettingsData>(key: K, value: EmailSettingsData[K]) => setForm({ ...form, [key]: value })

  const save = (e: FormEvent) => {
    e.preventDefault()
    run(async () => {
      setForm(await api<EmailSettingsData>('/settings/email', { method: 'PUT', body: { ...form, password, clearPassword } }))
      setPassword('')
      setClearPassword(false)
      return 'Configuração guardada.'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-5 items-start">
      <Card title="Servidor de envio" description="Utilizado em todos os e-mails da plataforma.">
        <form onSubmit={save} className="space-y-4">
          <Alert>{status.error}</Alert>
          {status.message && <Alert type="success">{status.message}</Alert>}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_7rem] gap-4">
            <TextField label="Host" value={form.host} onChange={(v) => set('host', v)} placeholder="smtp.exemplo.pt" required />
            <TextField label="Porta" type="number" min={1} max={65535} value={String(form.port)} onChange={(v) => set('port', v)} required />
          </div>
          <SelectField label="Protocolo" value={form.protocol} onChange={(v) => set('protocol', v)} options={[{ value: 'smtp', label: 'SMTP' }]} />
          <div className="space-y-3">
            <Checkbox label="Usar SSL/TLS" description="Normalmente na porta 465." checked={form.ssl} onChange={(v) => set('ssl', v)} />
            <Checkbox
              label="Ignorar certificados inválidos"
              description="Só para servidores internos com certificados próprios."
              checked={form.ignoreCertificates}
              onChange={(v) => set('ignoreCertificates', v)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Utilizador" value={form.user} onChange={(v) => set('user', v)} autoComplete="off" />
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder={form.hasPassword ? '•••••••• (guardada)' : ''}
              hint={form.hasPassword ? 'Deixa vazio para manter a password guardada.' : undefined}
              disabled={clearPassword}
            />
          </div>
          {form.hasPassword && <Checkbox label="Remover a password guardada" checked={clearPassword} onChange={setClearPassword} />}
          <TextField
            label="E-mail do remetente"
            type="email"
            value={form.fromAddress}
            onChange={(v) => set('fromAddress', v)}
            placeholder="no-reply@exemplo.pt"
            required
          />
          <div className="flex justify-end pt-1">
            <Button type="submit" loading={status.busy}>Guardar</Button>
          </div>
        </form>
      </Card>

      <Card title="E-mail de teste" description="Envia um e-mail com a configuração guardada.">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            runTest(async () => (await api<{ message: string }>('/settings/email/test', { method: 'POST', body: { to: testTo } })).message)
          }}
        >
          {testStatus.error && <Alert title="O servidor devolveu um erro">{testStatus.error}</Alert>}
          {testStatus.message && <Alert type="success">{testStatus.message}</Alert>}
          <TextField label="Destinatário" type="email" value={testTo} onChange={setTestTo} required />
          <Button type="submit" variant="outline" block loading={testStatus.busy} icon={<Send size={15} />}>
            {testStatus.busy ? 'A enviar...' : 'Enviar teste'}
          </Button>
          {mailpitUrl && (
            <a
              href={mailpitUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Inbox size={14} /> Abrir Mailpit (e-mails de teste)
            </a>
          )}
        </form>
      </Card>
    </div>
  )
}

/* ─── Branding ───────────────────────────────────────────────────────────── */

const COLOR_ORDER: ColorKey[] = ['primary', 'secondary', 'neutral', 'accent']

const COLOR_META: Record<ColorKey, { label: string; description: string }> = {
  primary: { label: 'Primary', description: 'Cor de marca — botões, links, estados ativos' },
  secondary: { label: 'Secondary', description: 'Fundos escuros, texto sobre fundo claro' },
  neutral: { label: 'Neutral', description: 'Cinza médio — bordas, ícones, texto secundário' },
  accent: { label: 'Accent', description: 'Acento — CTAs secundários, badges, destaques' },
}

/** Color swatch card from the style guide configuration page. Changes preview live across the app. */
function ColorCard({ colorKey }: { colorKey: ColorKey }) {
  const dispatch = useAppDispatch()
  const color = useAppSelector((s) => s.theme.colors[colorKey])
  const pickerRef = useRef<HTMLInputElement>(null)
  const [hex, setHex] = useState(color)

  useEffect(() => setHex(color), [color])

  const { label, description } = COLOR_META[colorKey]
  return (
    <div className="rounded-xl border border-border bg-bg overflow-hidden flex flex-col">
      <button
        type="button"
        className="relative w-full h-20 group focus:outline-none"
        style={{ backgroundColor: color }}
        onClick={() => pickerRef.current?.click()}
        title="Clica para editar"
      >
        <input
          ref={pickerRef}
          type="color"
          value={color}
          onChange={(e) => dispatch(setColor({ key: colorKey, value: e.target.value }))}
          className="sr-only"
          tabIndex={-1}
        />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm">Editar cor</span>
        </span>
      </button>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-text-muted">{label}</span>
        <input
          type="text"
          value={hex}
          maxLength={7}
          aria-label={`Cor ${label}`}
          onChange={(e) => {
            setHex(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) dispatch(setColor({ key: colorKey, value: e.target.value.toLowerCase() }))
          }}
          onBlur={() => !/^#[0-9a-fA-F]{6}$/.test(hex) && setHex(color)}
          className="text-sm font-mono text-text-base bg-transparent border-none outline-none focus:ring-0 min-w-0 p-0"
        />
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function LogoCard({ onSuggestion }: { onSuggestion: (colors: ThemeColors | null) => void }) {
  const { branding, setBranding } = useBranding()
  const [dragging, setDragging] = useState(false)
  const [status, run] = useStatus()
  const fileRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    (file: File) =>
      run(async () => {
        const body = new FormData()
        body.append('logo', file)
        setBranding(await api('/settings/branding/logo', { method: 'POST', body }))
        // Suggest a palette from the new logo, as the style guide does.
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
          const colors = extractColorsFromImage(img)
          onSuggestion(colors.length >= 2 ? suggestThemeColors(colors) : null)
          URL.revokeObjectURL(url)
        }
        img.src = url
        return 'Logótipo atualizado.'
      }),
    [run, setBranding, onSuggestion],
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const fileInput = (
    <input
      ref={fileRef}
      type="file"
      accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) upload(file)
        e.target.value = ''
      }}
    />
  )

  return (
    <Card title="Logótipo" description="Aparece no login, no back-office, nos e-mails e como favicon.">
      <div className="space-y-4">
        <Alert>{status.error}</Alert>
        {status.message && <Alert type="success">{status.message}</Alert>}
        {!branding.logoUrl ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-theme
              ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-surface-hover'}`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-hover">
              {status.busy ? <RefreshCw size={18} className="text-primary animate-spin" /> : <Upload size={18} className="text-text-muted" />}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-base">{status.busy ? 'A carregar...' : 'Arrasta o logótipo aqui'}</p>
              <p className="text-xs text-text-muted mt-1">ou clica para selecionar · SVG, PNG, JPG, WEBP, ICO · máx. 1 MB</p>
            </div>
            {fileInput}
          </div>
        ) : (
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-32">
              <div className="rounded-xl border border-border bg-white flex items-center justify-center p-6 h-28">
                <img src={branding.logoUrl} alt="Logótipo em fundo claro" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-xs text-text-muted text-center mt-1.5">Fundo claro</p>
            </div>
            <div className="flex-1 min-w-32">
              <div className="rounded-xl border border-border bg-slate-900 flex items-center justify-center p-6 h-28">
                <img src={branding.logoUrl} alt="Logótipo em fundo escuro" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-xs text-text-muted text-center mt-1.5">Fundo escuro</p>
            </div>
            <div className="flex sm:flex-col gap-2 pt-1">
              <Button type="button" variant="subtle" size="sm" icon={<Upload size={12} />} onClick={() => fileRef.current?.click()} loading={status.busy}>
                Substituir
              </Button>
              <Button
                type="button"
                variant="destructive-outline"
                size="sm"
                icon={<X size={12} />}
                onClick={() =>
                  run(async () => {
                    setBranding(await api('/settings/branding/logo', { method: 'DELETE' }))
                    onSuggestion(null)
                    return 'Logótipo removido.'
                  })
                }
              >
                Remover
              </Button>
              {fileInput}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function BrandingSettings() {
  const dispatch = useAppDispatch()
  const { branding, setBranding } = useBranding()
  const colors = useAppSelector((s) => s.theme.colors)
  const [projectTitle, setProjectTitle] = useState(branding.projectTitle)
  const [clientName, setClientName] = useState(branding.clientName)
  const [suggested, setSuggested] = useState<ThemeColors | null>(null)
  const [status, run] = useStatus()

  useEffect(() => {
    setProjectTitle(branding.projectTitle)
    setClientName(branding.clientName)
  }, [branding.projectTitle, branding.clientName])

  // Colors preview live while editing; leaving without saving goes back to the saved ones.
  useEffect(() => () => {
    dispatch(resetColors())
  }, [dispatch])

  const dirtyColors = COLOR_ORDER.some((k) => colors[k] !== branding.colors[k])

  const save = (e: FormEvent) => {
    e.preventDefault()
    run(async () => {
      setBranding(await api('/settings/branding', { method: 'PUT', body: { projectTitle, clientName, colors } }))
      return 'Branding guardado.'
    })
  }

  return (
    <div className="space-y-5">
      <LogoCard onSuggestion={setSuggested} />

      <form onSubmit={save} className="space-y-5">
        <Card title="Identidade" description="Disponível no front-end, no back-end e nos e-mails.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField label="Título do projeto" value={projectTitle} onChange={setProjectTitle} required />
            <TextField label="Nome do cliente" value={clientName} onChange={setClientName} />
          </div>
        </Card>

        <Card
          title="Esquema de cores"
          description="As alterações são pré-visualizadas em toda a aplicação; só ficam ativas depois de guardar."
          actions={
            <Button type="button" variant="subtle" size="sm" icon={<RotateCcw size={12} />} disabled={!dirtyColors} onClick={() => dispatch(resetColors())}>
              Repor
            </Button>
          }
        >
          {suggested && (
            <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-text-base">Sugestão de esquema de cores</p>
                  <p className="text-xs text-text-muted mt-0.5">Cores extraídas automaticamente do logótipo.</p>
                </div>
                <button type="button" onClick={() => setSuggested(null)} className="p-1 rounded-lg text-text-muted hover:bg-surface-hover" aria-label="Fechar">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {COLOR_ORDER.map((key) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <div className="h-10 rounded-lg border border-white/20 shadow-sm" style={{ backgroundColor: suggested[key] }} />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wide text-text-muted">{COLOR_META[key].label}</span>
                    <span className="text-xs font-mono text-text-base">{suggested[key]}</span>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                size="sm"
                icon={<Check size={14} />}
                onClick={() => {
                  dispatch(setColors(suggested))
                  setSuggested(null)
                }}
              >
                Aplicar sugestão
              </Button>
            </div>
          )}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2.5">Esquemas prontos</p>
              <ColorPresets />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-2.5">Personalizar</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {COLOR_ORDER.map((key) => (
                  <ColorCard key={key} colorKey={key} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Alert>{status.error}</Alert>
        {status.message && <Alert type="success">{status.message}</Alert>}
        <div className="flex items-center gap-3">
          <Button type="submit" loading={status.busy}>Guardar branding</Button>
          {dirtyColors && <span className="text-xs text-amber-700 dark:text-amber-300">Tens alterações de cor por guardar.</span>}
        </div>
      </form>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const SECTIONS = {
  email: { label: 'E-mail', icon: <Mail size={15} />, Component: EmailSettings },
  branding: { label: 'Branding', icon: <Palette size={15} />, Component: BrandingSettings },
}

export default function Settings() {
  const { section = '' } = useParams()
  if (!(section in SECTIONS)) return <Navigate to="/admin/settings/email" replace />
  const { Component } = SECTIONS[section as keyof typeof SECTIONS]

  return (
    <>
      <PageHeader title="Settings" description="Configuração da plataforma, disponível para administradores." />
      <Tabs items={Object.entries(SECTIONS).map(([key, s]) => ({ to: `/admin/settings/${key}`, label: s.label, icon: s.icon }))} />
      <Component key={section} />
    </>
  )
}
