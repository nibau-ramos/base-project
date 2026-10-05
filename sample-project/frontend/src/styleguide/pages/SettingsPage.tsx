import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, RotateCcw, Check, X, RefreshCw } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setColor, setColors, resetColors, setLogoUrl, type ColorKey } from '../../store/themeSlice'
import { extractColorsFromImage, suggestThemeColors } from '../../lib/colorExtraction'

const COLOR_ORDER: ColorKey[] = ['primary', 'secondary', 'neutral', 'accent']

const COLOR_META: Record<ColorKey, { label: string; description: string }> = {
  primary:   { label: 'Primary',   description: 'Cor de marca — botões, links, estados activos' },
  secondary: { label: 'Secondary', description: 'Fundos escuros, texto sobre fundo claro' },
  neutral:   { label: 'Neutral',   description: 'Cinza médio — bordas, ícones, texto secundário' },
  accent:    { label: 'Accent',    description: 'Acento — CTAs secundários, badges, destaques' },
}

/* ─── ColorCard ─────────────────────────────────────────────────────────── */

function ColorCard({ colorKey }: { colorKey: ColorKey }) {
  const dispatch = useAppDispatch()
  const color = useAppSelector((s) => s.theme.colors[colorKey])
  const pickerRef = useRef<HTMLInputElement>(null)
  const [hexInput, setHexInput] = useState(color)

  useEffect(() => { setHexInput(color) }, [color])

  const handlePicker = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setColor({ key: colorKey, value: e.target.value }))

  const handleHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInput(val)
    if (/^#[0-9a-fA-F]{6}$/.test(val)) dispatch(setColor({ key: colorKey, value: val }))
  }

  const handleHexBlur = () => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hexInput)) setHexInput(color)
  }

  const { label, description } = COLOR_META[colorKey]

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
      {/* Swatch */}
      <button
        className="relative w-full h-28 group focus:outline-none"
        style={{ backgroundColor: color }}
        onClick={() => pickerRef.current?.click()}
        title="Clica para editar"
      >
        <input
          ref={pickerRef}
          type="color"
          value={color}
          onChange={handlePicker}
          className="sr-only"
        />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm">
            Editar cor
          </span>
        </span>
      </button>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={hexInput}
            onChange={handleHex}
            onBlur={handleHexBlur}
            maxLength={7}
            className="flex-1 text-sm font-mono text-text-base bg-transparent border-none outline-none focus:ring-0 min-w-0"
          />
          <button
            onClick={() => pickerRef.current?.click()}
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 ring-1 ring-border"
            style={{ backgroundColor: color }}
            title="Escolher cor"
          />
        </div>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* ─── SuggestionBanner ───────────────────────────────────────────────────── */

interface SuggestionBannerProps {
  suggested: Record<ColorKey, string>
  onApply: () => void
  onDismiss: () => void
}

function SuggestionBanner({ suggested, onApply, onDismiss }: SuggestionBannerProps) {
  return (
    <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-sm font-semibold text-text-base">Sugestão de esquema de cores</p>
          <p className="text-xs text-text-muted mt-0.5">
            Cores extraídas automaticamente do logotipo. Revê e aplica se concordares.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-base transition-theme flex-shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {COLOR_ORDER.map((key) => (
          <div key={key} className="flex flex-col gap-1.5">
            <div
              className="h-10 rounded-lg border border-white/20 shadow-sm"
              style={{ backgroundColor: suggested[key] }}
            />
            <span className="text-xs font-mono font-semibold uppercase tracking-wide text-text-muted">
              {COLOR_META[key].label}
            </span>
            <span className="text-xs font-mono text-text-base">{suggested[key]}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onApply}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-white transition-theme"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Check size={14} /> Aplicar sugestão
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-sm font-medium rounded-lg text-text-muted hover:bg-surface-hover transition-theme border border-border"
        >
          Manter cores actuais
        </button>
      </div>
    </div>
  )
}

/* ─── LogoSection ────────────────────────────────────────────────────────── */

function LogoSection() {
  const dispatch = useAppDispatch()
  const logoUrl = useAppSelector((s) => s.theme.logoUrl)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggested, setSuggested] = useState<Record<ColorKey, string> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 4 * 1024 * 1024) return  // 4MB limit

    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      dispatch(setLogoUrl(dataUrl))

      // Extract colors via canvas
      const img = new Image()
      img.onload = () => {
        const colors = extractColorsFromImage(img)
        if (colors.length >= 2) {
          setSuggested(suggestThemeColors(colors))
        } else {
          setSuggested(null)
        }
        setIsProcessing(false)
      }
      img.onerror = () => setIsProcessing(false)
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [dispatch])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    dispatch(setLogoUrl(null))
    setSuggested(null)
  }

  const handleApply = () => {
    if (suggested) {
      dispatch(setColors(suggested))
      setSuggested(null)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-sm font-semibold text-text-base mb-4">Logotipo</h2>

      {!logoUrl ? (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer transition-theme
            ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-surface-hover'
            }`}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-hover">
            {isProcessing
              ? <RefreshCw size={18} className="text-primary animate-spin" style={{ color: 'var(--color-primary)' }} />
              : <Upload size={18} className="text-text-muted" />
            }
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-base">
              {isProcessing ? 'A processar...' : 'Arrasta o logotipo aqui'}
            </p>
            <p className="text-xs text-text-muted mt-1">ou clica para seleccionar · SVG, PNG, JPG · máx. 4MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>
      ) : (
        /* Logo preview */
        <div>
          <div className="flex items-start gap-4 flex-wrap">
            {/* Light background preview */}
            <div className="flex-1 min-w-32">
              <div className="rounded-xl border border-border bg-white flex items-center justify-center p-6 h-28">
                <img src={logoUrl} alt="Logo preview — fundo claro" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-xs text-text-muted text-center mt-1.5">Fundo claro</p>
            </div>
            {/* Dark background preview */}
            <div className="flex-1 min-w-32">
              <div className="rounded-xl border border-border bg-slate-900 flex items-center justify-center p-6 h-28">
                <img src={logoUrl} alt="Logo preview — fundo escuro" className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-xs text-text-muted text-center mt-1.5">Fundo escuro</p>
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border
                  text-text-muted hover:text-text-base hover:bg-surface-hover transition-theme"
              >
                <Upload size={12} /> Substituir
              </button>
              <button
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border
                  text-red-600 hover:bg-red-50 transition-theme"
              >
                <X size={12} /> Remover
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>
          </div>

          {/* Suggestion */}
          {suggested && (
            <SuggestionBanner
              suggested={suggested}
              onApply={handleApply}
              onDismiss={() => setSuggested(null)}
            />
          )}

          {isProcessing && (
            <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
              <RefreshCw size={14} className="animate-spin" />
              A analisar cores do logotipo...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── SettingsPage ───────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const dispatch = useAppDispatch()

  return (
    <div>
      <PageHeader
        title="Configuração"
        description="Personaliza o logotipo e o esquema de cores deste style guide."
      />

      <div className="space-y-6">
        {/* Logo */}
        <LogoSection />

        {/* Colors */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-text-base">Esquema de cores</h2>
            <button
              onClick={() => dispatch(resetColors())}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border
                text-text-muted hover:text-text-base hover:bg-surface-hover transition-theme"
            >
              <RotateCcw size={12} /> Repor padrão
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {COLOR_ORDER.map((key) => (
              <ColorCard key={key} colorKey={key} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
