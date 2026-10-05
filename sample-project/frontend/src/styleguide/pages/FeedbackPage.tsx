import { useState } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Loader2, Check } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'

type AlertType = 'info' | 'success' | 'warning' | 'error'

const alertConfig: Record<AlertType, { icon: React.ReactNode; classes: string }> = {
  info:    { icon: <Info size={16} />,          classes: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300' },
  success: { icon: <CheckCircle2 size={16} />,  classes: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300' },
  warning: { icon: <AlertTriangle size={16} />, classes: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300' },
  error:   { icon: <AlertCircle size={16} />,   classes: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300' },
}

function Alert({ type, title, message }: { type: AlertType; title: string; message: string }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return <span className="text-xs text-text-muted italic">Alert fechado (clica em X)</span>
  const cfg = alertConfig[type]
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.classes} w-full max-w-sm`}>
      <span className="flex-shrink-0 mt-0.5">{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm opacity-80 mt-0.5">{message}</p>
      </div>
      <button onClick={() => setVisible(false)} className="flex-shrink-0 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
const badgeConfig: Record<BadgeVariant, string> = {
  primary:   'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary dark:bg-white/10 dark:text-white',
  success:   'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300',
  warning:   'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  error:     'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300',
  neutral:   'bg-surface text-text-muted border border-border',
}

function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeConfig[variant]}`}>
      {children}
    </span>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-hover rounded ${className}`} />
}

/* ─── Chip ───────────────────────────────────────────────────────────────── */

function Chip({ label, onRemove, disabled }: { label: string; onRemove?: () => void; disabled?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-theme
        border-border bg-surface text-text-base
        ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-red-500 transition-theme text-text-muted"
          tabIndex={disabled ? -1 : 0}
        >
          <X size={11} />
        </button>
      )}
    </span>
  )
}

function RemovableChips() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind'])
  const remove = (t: string) => setTags((p) => p.filter((x) => x !== t))
  if (tags.length === 0) return (
    <p className="text-xs text-text-muted italic">Todos removidos — recarrega a página para repor.</p>
  )
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => <Chip key={t} label={t} onRemove={() => remove(t)} />)}
    </div>
  )
}

function TagInput() {
  const [tags, setTags] = useState(['Design', 'Estratégia'])
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) setTags((t) => [...t, v])
    setInput('')
  }
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Escreve e prime Enter..."
          className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border bg-bg text-text-base
            placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-theme"
        />
        <button
          onClick={add}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-text-muted hover:bg-surface-hover transition-theme"
        >
          Adicionar
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Chip key={t} label={t} onRemove={() => setTags((p) => p.filter((x) => x !== t))} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Stepper ────────────────────────────────────────────────────────────── */

type StepState = 'completed' | 'active' | 'error' | 'pending'

interface Step { label: string; state: StepState }

function StepCircle({ state, index }: { step: string; state: StepState; index: number }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-theme'
  if (state === 'completed') return (
    <div className={`${base} text-white`} style={{ backgroundColor: 'var(--color-primary)' }}>
      <Check size={14} />
    </div>
  )
  if (state === 'active') return (
    <div className={`${base} border-2 bg-bg`} style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
      {index + 1}
    </div>
  )
  if (state === 'error') return (
    <div className={`${base} bg-red-600 text-white`}>
      <X size={14} />
    </div>
  )
  return <div className={`${base} border-2 border-border bg-bg text-text-muted`}>{index + 1}</div>
}

function StepperDemo({ withError = false }: { withError?: boolean }) {
  const [current, setCurrent] = useState(1)
  const LABELS = ['Dados gerais', 'Importação', 'Revisão', 'Concluído']

  const steps: Step[] = LABELS.map((label, i) => {
    let state: StepState = 'pending'
    if (withError && i === 1) state = 'error'
    else if (i < current) state = 'completed'
    else if (i === current) state = 'active'
    return { label, state }
  })

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <StepCircle step={s.label} state={s.state} index={i} />
              <span
                className={`text-xs font-medium text-center leading-tight max-w-[60px] ${
                  s.state === 'active' ? 'text-primary' :
                  s.state === 'error' ? 'text-red-600 dark:text-red-400' :
                  s.state === 'completed' ? 'text-text-base' :
                  'text-text-muted'
                }`}
                style={s.state === 'active' ? { color: 'var(--color-primary)' } : undefined}
              >
                {s.label}
                {s.state === 'error' && <span className="block text-red-500 text-[10px]">Falhou</span>}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mb-5 mx-1 transition-all"
                style={{ backgroundColor: i < current ? 'var(--color-primary)' : 'var(--color-neutral)20' }}
              />
            )}
          </div>
        ))}
      </div>
      {!withError && (
        <div className="flex gap-2">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="px-3 py-1.5 text-xs rounded-lg border border-border text-text-muted hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-theme"
          >
            Anterior
          </button>
          <button
            disabled={current === LABELS.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
            className="px-3 py-1.5 text-xs rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed transition-theme"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  )
}

export default function FeedbackPage() {
  const [progress, setProgress] = useState(65)

  return (
    <div>
      <PageHeader
        title="Feedback & Estado"
        description="Componentes que comunicam ao utilizador o resultado de acções e o estado do sistema."
      />

      <div className="space-y-6">

        {/* Alerts */}
        <ComponentDemo
          layout="rows"
          title="Alerts"
          description="Mensagens contextuais de sistema — clica no × para fechar"
          code={`<div className="flex items-start gap-3 p-4 rounded-lg border bg-blue-50 border-blue-200 text-blue-800">
  <Info size={16} />
  <div>
    <p className="text-sm font-semibold">Título</p>
    <p className="text-sm opacity-80">Mensagem.</p>
  </div>
  <button onClick={dismiss}><X size={14} /></button>
</div>`}
        >
          <VariantRow stack name="Info" description={<>Para <B>informação contextual</B> que o utilizador deve conhecer mas que não requer acção imediata — actualizações de sistema, mensagens de manutenção, dicas de funcionalidades.</>}>
            <Alert type="info" title="Actualização disponível" message="A versão 2.1 está disponível com novos componentes." />
          </VariantRow>

          <VariantRow stack name="Success" description={<>Confirma que uma <B>acção foi concluída com sucesso</B>. Deve aparecer imediatamente após a operação e, idealmente, desaparecer automaticamente ao fim de 4–5 segundos se não requerer leitura longa.</>}>
            <Alert type="success" title="Guardado com sucesso" message="As alterações foram publicadas e estão visíveis." />
          </VariantRow>

          <VariantRow stack name="Warning" description={<>Sinaliza uma <B>situação de risco controlável</B> — o utilizador pode ainda continuar mas deve saber do problema. Use quando há consequências que merecem atenção antes de prosseguir.</>}>
            <Alert type="warning" title="Atenção" message="Esta acção afecta 23 utilizadores. Confirme antes de continuar." />
          </VariantRow>

          <VariantRow stack name="Error" description={<>Indica uma <B>falha que impede o progresso</B>. A mensagem deve explicar o que correu mal e, sempre que possível, indicar <B>como resolver</B> — nunca apenas "erro desconhecido".</>}>
            <Alert type="error" title="Falha no envio" message="Não foi possível guardar. Verifique a ligação e tente novamente." />
          </VariantRow>
        </ComponentDemo>

        {/* Badges */}
        <ComponentDemo
          layout="rows"
          title="Badges"
          description="Etiquetas compactas de estado, categoria ou contagem"
          code={`<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
  Activo
</span>`}
        >
          <VariantRow stack name="Primary" description={<>Para <B>categorias ou estados de marca</B> — versão de produto, tipo de plano, tags de funcionalidade principal.</>}>
            <Badge variant="primary">Design System</Badge>
          </VariantRow>
          <VariantRow stack name="Success" description={<>Estado <B>positivo ou activo</B>: registo activo, pagamento aprovado, serviço online. A cor verde é universalmente associada a "tudo bem".</>}>
            <Badge variant="success">Online</Badge>
          </VariantRow>
          <VariantRow stack name="Warning" description={<>Estado de <B>atenção ou espera</B>: revisão pendente, aprovação necessária, limite próximo. O amarelo-âmbar convida à atenção sem ser urgente.</>}>
            <Badge variant="warning">Em revisão</Badge>
          </VariantRow>
          <VariantRow stack name="Error" description={<>Estado <B>negativo ou crítico</B>: erro, rejeição, serviço offline. Reservado para situações que requerem acção imediata por parte do utilizador.</>}>
            <Badge variant="error">Rejeitado</Badge>
          </VariantRow>
          <VariantRow stack name="Neutral" description={<>Para <B>categorias sem conotação semântica</B>: tags de conteúdo, labels de secção, versões numéricas. Não compete visualmente com badges de estado.</>}>
            <Badge variant="neutral">v0.1.0</Badge>
          </VariantRow>
        </ComponentDemo>

        {/* Spinner */}
        <ComponentDemo
          layout="rows"
          title="Spinner"
          description="Indicador de carregamento para operações assíncronas"
          code={`<Loader2 className="animate-spin text-primary" size={20} />`}
        >
          <VariantRow stack name="Inline" description={<>Spinner <B>pequeno e inline</B> — use dentro de botões no estado loading ou junto a texto para indicar que um valor específico está a ser carregado.</>}>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 size={14} className="animate-spin text-primary" />
              <span>A carregar dados...</span>
            </div>
          </VariantRow>
          <VariantRow stack name="Médio" description={<>Spinner <B>standalone</B> para estados de carregamento de uma secção ou card. Posicione centrado na área que está a ser carregada.</>}>
            <Loader2 size={24} className="animate-spin text-primary" />
          </VariantRow>
          <VariantRow stack name="Grande" description={<>Para <B>carregamentos de página inteira</B> ou splash screens. Use com moderação — prefira skeleton loaders para conteúdo que tem uma estrutura conhecida.</>}>
            <Loader2 size={40} className="animate-spin text-primary" />
          </VariantRow>
        </ComponentDemo>

        {/* Progress */}
        <ComponentDemo
          layout="rows"
          title="Progress Bar"
          description="Indica o progresso de operações com duração conhecida"
          code={`<div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
  <div className="h-full bg-primary rounded-full transition-all" style={{ width: \`\${value}%\` }} />
</div>`}
        >
          <VariantRow stack name="Progress Bar" description={<>Use quando a operação tem uma <B>duração estimada</B> e é possível calcular o progresso real (upload, instalação, passos de onboarding). Para durações desconhecidas, use o <B>Spinner</B> ou uma barra de progresso indeterminada.</>}>
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Upload de ficheiros</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setProgress((p) => Math.max(0, p - 10))} className="px-2 py-1 text-xs rounded border border-border text-text-muted hover:bg-surface-hover transition-theme">−10</button>
                <button onClick={() => setProgress((p) => Math.min(100, p + 10))} className="px-2 py-1 text-xs rounded border border-border text-text-muted hover:bg-surface-hover transition-theme">+10</button>
              </div>
            </div>
          </VariantRow>
        </ComponentDemo>

        {/* Skeleton */}
        <ComponentDemo
          layout="rows"
          title="Skeleton Loader"
          description="Placeholder animado que replica a estrutura do conteúdo a carregar"
          code={`<div className="animate-pulse bg-surface-hover rounded h-4 w-3/4" />`}
        >

          <VariantRow stack name="Skeleton" description={<>Prefira skeletons ao spinner sempre que conhece a <B>estrutura do conteúdo</B> que vai aparecer. Reduz o <B>layout shift</B> e dá ao utilizador uma previsão visual do que está a carregar, tornando a espera mais tolerável.</>}>
            <div className="w-full max-w-sm space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-20 w-full" />
            </div>
          </VariantRow>
        </ComponentDemo>

        {/* Tags & Chips */}
        <ComponentDemo
          layout="rows"
          title="Tags & Chips"
          description="Etiquetas interactivas para categorização, filtros e selecção múltipla"
          code={`// Chip básico
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
  border border-border bg-surface text-text-base">
  Design
</span>

// Com remoção
<span className="...">
  Design <button onClick={remove}><X size={11} /></button>
</span>`}
        >
          <VariantRow
            stack
            name="Default"
            description={<>Chip <B>sem remoção</B>. Usado como etiqueta de categoria estática — classificação de conteúdo, atributos de produto, tags de filtro visual já aplicado.</>}
          >
            <div className="flex flex-wrap gap-2">
              {['Design', 'Estratégia', 'Tecnologia'].map((t) => <Chip key={t} label={t} />)}
            </div>
          </VariantRow>
          <VariantRow
            stack
            name="Com remoção"
            description={<>Chip com botão <B>× individual</B>. Cada chip pode ser removido independentemente. Use em filtros activos, listas de destinatários, ou campos de tags editáveis.</>}
          >
            <RemovableChips />
          </VariantRow>
          <VariantRow
            stack
            name="Desactivado"
            description={<>Chip com <B>opacity-50 e pointer-events-none</B>. Sinaliza que a etiqueta está temporariamente bloqueada — por exemplo, um filtro obrigatório que não pode ser removido pelo utilizador.</>}
          >
            <Chip label="Obrigatório" disabled />
          </VariantRow>
          <VariantRow
            stack
            name="Input de tags"
            description={<>Campo de texto combinado com lista de chips. O utilizador escreve e <B>prime Enter</B> (ou clica "Adicionar") para criar uma nova tag. Cada tag tem botão de remoção. Ideal para formulários de classificação livre.</>}
          >
            <TagInput />
          </VariantRow>
        </ComponentDemo>

        {/* Stepper */}
        <ComponentDemo
          layout="rows"
          title="Stepper / Wizard"
          description="Indica progresso em fluxos multi-passo — onboarding, importação de dados, formulários longos"
          code={`// Passo concluído
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
  <Check size={14} />
</div>

// Passo activo
<div className="w-8 h-8 rounded-full border-2 border-primary text-primary ...">
  {stepIndex + 1}
</div>

// Passo pendente
<div className="w-8 h-8 rounded-full border-2 border-border text-text-muted ...">
  {stepIndex + 1}
</div>`}
        >
          <VariantRow
            stack
            name="Horizontal interactivo"
            description={<>4 passos com estados <B>concluído, activo e pendente</B>. A linha horizontal entre passos fica colorida à medida que avança. Usa os botões <B>Anterior / Próximo</B> para navegar entre estados.</>}
          >
            <StepperDemo />
          </VariantRow>
          <VariantRow
            stack
            name="Com erro"
            description={<>Passo em <B>estado de erro</B> (✕ vermelho + label "Falhou"). Use quando uma etapa falha por razão técnica e o utilizador precisa de resolver antes de avançar — por exemplo, falha de validação no servidor ou timeout de upload.</>}
          >
            <StepperDemo withError />
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
