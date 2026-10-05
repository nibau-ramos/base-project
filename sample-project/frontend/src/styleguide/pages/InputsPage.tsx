import { useState, useRef, useCallback } from 'react'
import { Eye, EyeOff, Mail, AlertCircle, Upload, FileText, Loader2, X, Plus } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'

function Input({
  label,
  placeholder,
  error,
  disabled,
  icon,
  type = 'text',
  hint,
}: {
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  icon?: React.ReactNode
  type?: string
  hint?: string
}) {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1 w-full max-w-xs">
      {label && <label className="text-sm font-medium text-text-base">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm bg-bg text-text-base
            placeholder:text-text-muted outline-none transition-theme
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-9' : ''}
            ${error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
              : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'}
          `}
        />
        {error && <AlertCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => setChecked(!checked)}
        className={`relative rounded-full transition-colors duration-200 flex-shrink-0`}
        style={{ width: 40, height: 22, backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-neutral)' + '66' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform duration-200
            ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
        />
      </div>
      <span className="text-sm text-text-base">{label}</span>
    </label>
  )
}

function Checkbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div
        onClick={() => setChecked(!checked)}
        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0
          ${checked ? 'border-primary' : 'border-border bg-bg'}`}
        style={checked ? { backgroundColor: 'var(--color-primary)' } : {}}
      >
        {checked && (
          <svg viewBox="0 0 12 10" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1,5 4,9 11,1" />
          </svg>
        )}
      </div>
      <span className="text-sm text-text-base">{label}</span>
    </label>
  )
}

function RadioGroup({ options }: { options: string[] }) {
  const [selected, setSelected] = useState(options[0])
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
          <div
            onClick={() => setSelected(opt)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${selected !== opt ? 'border-border' : ''}`}
            style={{ borderColor: selected === opt ? 'var(--color-primary)' : undefined }}
          >
            {selected === opt && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />}
          </div>
          <span className="text-sm text-text-base">{opt}</span>
        </label>
      ))}
    </div>
  )
}

/* ─── Drop Zone ─────────────────────────────────────────────────────────── */

type DropState = 'empty' | 'dragging' | 'processing' | 'selected' | 'error'

function DropZoneDemo() {
  const [state, setState] = useState<DropState>('empty')
  const [fileInfo, setFileInfo] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    const valid = /\.(csv|xlsx|xls)$/i.test(file.name)
    setFileInfo(valid ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB` : file.name)
    if (!valid) { setState('error'); return }
    setState('processing')
    setTimeout(() => setState('selected'), 1200)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
    else setState('empty')
  }, [processFile])

  const reset = () => { setState('empty'); setFileInfo('') }

  if (state === 'empty' || state === 'dragging') return (
    <div className="w-full max-w-md">
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setState('dragging') }}
        onDragLeave={() => setState('empty')}
        onDrop={handleDrop}
        className={`flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-theme
          ${state === 'dragging' ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-hover'}`}
      >
        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = '' }} />
        <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center">
          <Upload size={18} className={state === 'dragging' ? 'text-primary' : 'text-text-muted'}
            style={state === 'dragging' ? { color: 'var(--color-primary)' } : undefined} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-base">
            {state === 'dragging' ? 'Larga o ficheiro aqui' : 'Arrastar ou procurar'}
          </p>
          <p className="text-xs text-text-muted mt-0.5">CSV, XLSX · máx. 100MB</p>
        </div>
        <span className="px-4 py-1.5 text-xs font-medium rounded-lg border border-border text-text-muted bg-bg">
          Procurar ficheiro
        </span>
      </div>
    </div>
  )

  if (state === 'processing') return (
    <div className="w-full max-w-md flex flex-col items-center gap-3 p-8 rounded-xl border border-border bg-surface">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      <div className="text-center">
        <p className="text-sm font-medium text-text-base">A validar ficheiro...</p>
        <p className="text-xs text-text-muted mt-0.5">{fileInfo}</p>
      </div>
    </div>
  )

  if (state === 'selected') return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface">
        <FileText size={18} className="flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
        <p className="flex-1 text-sm text-text-base truncate">{fileInfo}</p>
        <button onClick={reset} className="text-text-muted hover:text-text-base transition-theme flex-shrink-0">
          <X size={15} />
        </button>
      </div>
      <p className="text-xs text-text-muted px-1">Ficheiro validado · clica × para remover</p>
    </div>
  )

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <X size={18} className="text-red-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Ficheiro inválido</p>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
            "{fileInfo}" não é suportado. Usa CSV ou XLSX.
          </p>
        </div>
      </div>
      <button onClick={reset} className="text-xs text-text-muted hover:text-text-base underline transition-theme">
        Tentar novamente
      </button>
    </div>
  )
}

/* ─── Image Upload ───────────────────────────────────────────────────────── */

function ImageSlot({ hasImage, onToggle, size = 'md' }: {
  hasImage: boolean; onToggle: () => void; size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-16 h-16' : 'w-24 h-24'
  return (
    <button
      onClick={onToggle}
      title={hasImage ? 'Clica para remover' : 'Clica para adicionar'}
      className={`relative rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-theme group ${dim}
        ${hasImage ? 'border-transparent' : 'border-border hover:border-primary/40 bg-surface'}`}
    >
      {hasImage ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-accent/60" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-theme">
            <X size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </>
      ) : (
        <Plus size={size === 'sm' ? 14 : 18} className="text-text-muted" />
      )}
    </button>
  )
}

function SingleImageDemo() {
  const [has, setHas] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <ImageSlot hasImage={has} onToggle={() => setHas(!has)} />
      <span className="text-xs text-text-muted">{has ? 'Com imagem — hover para ver ✕' : 'Vazio — clica para adicionar'}</span>
    </div>
  )
}

function MultiImageDemo() {
  const [images, setImages] = useState([true, true, false])
  const toggle = (i: number) => setImages((p) => p.map((v, j) => (j === i ? !v : v)))
  return (
    <div className="flex gap-3 flex-wrap">
      {images.map((has, i) => <ImageSlot key={i} hasImage={has} onToggle={() => toggle(i)} size="sm" />)}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function InputsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [textarea, setTextarea] = useState('')

  return (
    <div>
      <PageHeader
        title="Inputs & Formulários"
        description="Campos de dados para formulários. Todos respondem ao foco com a cor primary activa."
      />

      <div className="space-y-6">

        {/* Text Inputs */}
        <ComponentDemo
          layout="rows"
          title="Text Input — estados"
          description="Variações de estado do campo de texto mais básico"
          code={`<input className="w-full rounded-lg border border-border px-3 py-2 text-sm
  bg-bg placeholder:text-text-muted
  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />`}
        >
          <VariantRow stack name="Default" description={<>Campo no seu estado <B>inicial</B>. O anel de foco em `primary` orienta o utilizador para onde está a digitar — nunca use `:focus-visible` sem indicador visual.</>}>
            <Input label="Nome" placeholder="Ex: Carlos Ramos" />
          </VariantRow>

          <VariantRow stack name="Com ícone" description={<>Ícone no interior do campo contextualiza o tipo de dado esperado (<B>email, pesquisa, data</B>) sem necessitar de label adicional. Ideal em barras de pesquisa e campos de autenticação.</>}>
            <Input label="Email" placeholder="email@enso-origins.com" icon={<Mail size={14} />} />
          </VariantRow>

          <VariantRow stack name="Com hint" description={<>Texto auxiliar abaixo do campo que fornece <B>contexto adicional</B> — formato esperado, regras de validação, sugestões. Aparece sempre visível, ao contrário do erro.</>}>
            <Input label="Username" placeholder="carlosramos" hint="Apenas letras, números e underscores." />
          </VariantRow>

          <VariantRow stack name="Erro" description={<>Estado de <B>validação negativa</B>. O campo fica com borda vermelha e uma mensagem explica o problema. A mensagem de erro deve ser <B>específica e accionável</B> — nunca apenas "campo inválido".</>}>
            <Input label="Email" placeholder="email@exemplo.com" error="Endereço de email inválido." />
          </VariantRow>

          <VariantRow stack name="Disabled" description={<>Campo <B>não editável</B> no contexto actual — permissões insuficientes ou modo de leitura. Opacidade reduzida sinaliza indisponibilidade. Considere usar um elemento estático se o valor for apenas para leitura.</>}>
            <Input label="Plano" placeholder="Enterprise (gerido pela conta)" disabled />
          </VariantRow>
        </ComponentDemo>

        {/* Password */}
        <ComponentDemo
          layout="rows"
          title="Password"
          description="Campo de palavra-passe com toggle de visibilidade"
          code={`<div className="relative">
  <input type={show ? 'text' : 'password'} className="... pr-9" />
  <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">
    {show ? <EyeOff size={14} /> : <Eye size={14} />}
  </button>
</div>`}
        >
          <VariantRow stack name="Password" description={<>Campo mascarado com botão para <B>revelar/ocultar</B> o conteúdo. O toggle é essencial para a usabilidade em mobile onde os utilizadores cometem <B>mais erros de digitação</B> sem feedback visual.</>}>
            <div className="flex flex-col gap-1 w-full max-w-xs">
              <label className="text-sm font-medium text-text-base">Palavra-passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border px-3 py-2 pr-9 text-sm bg-bg
                    text-text-base placeholder:text-text-muted
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-theme"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-base transition-theme"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </VariantRow>
        </ComponentDemo>

        {/* Textarea */}
        <ComponentDemo
          layout="rows"
          title="Textarea"
          description="Campo de texto multilinha"
          code={`<textarea rows={4}
  className="w-full rounded-lg border border-border px-3 py-2 text-sm
    bg-bg placeholder:text-text-muted resize-y
    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />`}
        >
          <VariantRow stack name="Textarea" description={<>Para <B>texto longo</B> e sem estrutura — mensagens, descrições, comentários. A propriedade `resize-y` permite ao utilizador <B>ajustar a altura</B> conforme necessário. Use `rows` para definir a altura inicial adequada ao contexto.</>}>
            <div className="flex flex-col gap-1 w-full max-w-sm">
              <label className="text-sm font-medium text-text-base">Mensagem</label>
              <textarea
                rows={3}
                value={textarea}
                onChange={(e) => setTextarea(e.target.value)}
                placeholder="Descreva o seu projecto..."
                className="w-full rounded-lg border border-border px-3 py-2 text-sm
                  bg-bg text-text-base placeholder:text-text-muted resize-y
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-theme"
              />
              <p className="text-xs text-text-muted text-right">{textarea.length}/500</p>
            </div>
          </VariantRow>
        </ComponentDemo>

        {/* Select */}
        <ComponentDemo
          layout="rows"
          title="Select"
          description="Selector de opção única numa lista fechada"
          code={`<select className="w-full rounded-lg border border-border px-3 py-2 text-sm
  bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">`}
        >
          <VariantRow stack name="Select" description={<>Para escolher <B>uma opção de uma lista fechada</B> e curta (até ~10 itens). Para listas longas ou com pesquisa, use um <B>combobox personalizado</B>. Inclua sempre uma opção placeholder vazia para indicar que é obrigatório escolher.</>}>
            <div className="flex flex-col gap-1 w-full max-w-xs">
              <label className="text-sm font-medium text-text-base">Área</label>
              <select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm
                  bg-bg text-text-base focus:border-primary focus:ring-2 focus:ring-primary/20
                  outline-none transition-theme cursor-pointer"
              >
                <option value="">Selecione uma área</option>
                <option value="design">Design</option>
                <option value="dev">Desenvolvimento</option>
                <option value="marketing">Marketing</option>
                <option value="strategy">Estratégia</option>
              </select>
            </div>
          </VariantRow>
        </ComponentDemo>

        {/* Checkbox */}
        <ComponentDemo
          layout="rows"
          title="Checkbox"
          description="Seleção múltipla independente"
          code={`<label className="flex items-center gap-2.5 cursor-pointer">
  <div className="w-4 h-4 rounded border ..." onClick={toggle}>
    {checked && <CheckIcon />}
  </div>
  <span className="text-sm">Opção</span>
</label>`}
        >
          <VariantRow stack name="Activo" description={<>Checkbox <B>seleccionado</B>. A cor de preenchimento reflecte a primary activa. Use checkboxes para <B>selecções independentes</B> — cada opção pode estar ligada ou desligada sem afectar as restantes.</>}>
            <Checkbox label="Receber notificações por email" defaultChecked />
          </VariantRow>
          <VariantRow stack name="Inactivo" description={<>Checkbox <B>não seleccionado</B>. Estado padrão para opções opcionais. Distingue-se do disabled pela ausência de opacidade reduzida — está disponível para interacção.</>}>
            <Checkbox label="Subscrever newsletter mensal" />
          </VariantRow>
        </ComponentDemo>

        {/* Radio */}
        <ComponentDemo
          layout="rows"
          title="Radio Group"
          description="Seleção exclusiva — apenas uma opção pode estar activa"
          code={`<label className="flex items-center gap-2.5">
  <div className="w-4 h-4 rounded-full border-2 ..." onClick={() => setSelected(opt)}>
    {selected === opt && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
  </div>
  <span>{opt}</span>
</label>`}
        >
          <VariantRow stack name="Radio Group" description={<>Para <B>selecção mutuamente exclusiva</B> entre 2 a 5 opções visíveis. Ao contrário do Select, mostra todas as opções de uma vez, facilitando a <B>comparação antes de escolher</B>. Para mais de 5 opções, prefira um Select.</>}>
            <RadioGroup options={['Plano Gratuito', 'Plano Pro', 'Plano Enterprise']} />
          </VariantRow>
        </ComponentDemo>

        {/* Toggle */}
        <ComponentDemo
          layout="rows"
          title="Toggle / Switch"
          description="Activação binária com efeito imediato"
          code={`<div style={{ backgroundColor: on ? 'var(--color-primary)' : '...' }}>
  <span className={\`... \${on ? 'translate-x-[18px]' : ''}\`} />
</div>`}
        >
          <VariantRow stack name="Activo" description={<>Toggle <B>ligado</B>. Ao contrário do checkbox, o toggle implica <B>efeito imediato</B> sem submissão de formulário — activa ou desactiva um comportamento no instante do clique (ex: dark mode, notificações push).</>}>
            <Toggle label="Sincronização automática" defaultChecked />
          </VariantRow>
          <VariantRow stack name="Inactivo" description={<>Toggle <B>desligado</B>. A cor neutra cinzenta sinaliza claramente o estado inactivo. Use toggles apenas para configurações binárias com <B>impacto imediato e reversível</B>.</>}>
            <Toggle label="Modo avançado" />
          </VariantRow>
        </ComponentDemo>

        {/* File Drop Zone */}
        <ComponentDemo
          layout="rows"
          title="File Drop Zone"
          description="Área de arrastar e largar para importação de ficheiros"
          code={`<div
  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
  onDragLeave={() => setDragging(false)}
  onDrop={(e) => { e.preventDefault(); processFile(e.dataTransfer.files[0]) }}
  className="border-2 border-dashed rounded-xl p-8 ..."
>
  <Upload size={18} /><p>Arrastar ou procurar</p>
</div>`}
        >
          <VariantRow
            stack
            name="Interactivo"
            description={<>Zona de drag &amp; drop com <B>5 estados</B>: vazia, a arrastar, a processar, com ficheiro seleccionado e erro. Aceita drag real e clique para procurar. Valida o tipo de ficheiro (CSV, XLSX) e mostra mensagem de erro clara quando inválido. O estado "a processar" usa um spinner enquanto valida. O botão <B>×</B> remove o ficheiro seleccionado.</>}
          >
            <DropZoneDemo />
          </VariantRow>
        </ComponentDemo>

        {/* Image Upload */}
        <ComponentDemo
          layout="rows"
          title="Image Upload"
          description="Slots visuais para carregamento de imagens individuais ou em galeria"
          code={`// Slot vazio
<button className="w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center">
  <Plus size={18} className="text-text-muted" />
</button>

// Slot com imagem (hover remove)
<button className="relative w-24 h-24 rounded-xl overflow-hidden group">
  <img src={url} className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 ...">
    <X className="opacity-0 group-hover:opacity-100" />
  </div>
</button>`}
        >
          <VariantRow
            stack
            name="Slot"
            description={<>Slot quadrado com <B>borda tracejada</B> quando vazio (ícone +) e <B>preenchido com gradiente</B> quando tem imagem. Ao hover aparece um overlay com ✕ para remoção. Clica em qualquer slot para alternar o estado.</>}
          >
            <SingleImageDemo />
          </VariantRow>
          <VariantRow
            stack
            name="Múltiplos (galeria)"
            description={<>Grid de slots pequenos para <B>upload múltiplo</B> (ex: galeria de produtos, fotos de meio). Os slots preenchidos e o slot vazio coexistem na mesma linha. Clica em qualquer slot para alternar o seu estado.</>}
          >
            <MultiImageDemo />
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
