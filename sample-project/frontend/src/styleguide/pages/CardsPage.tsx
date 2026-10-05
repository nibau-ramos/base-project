import { useState } from 'react'
import { X, ExternalLink, ChevronRight } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'
import { Button } from './ButtonsPage'

function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-border bg-surface p-5 transition-theme
        ${onClick ? 'cursor-pointer hover:border-primary/40 hover:shadow-md' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-bg border border-border rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-base">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-base transition-theme"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function Drawer({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-80 h-full bg-bg border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-base">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-base transition-theme"><X size={18} /></button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function ConfirmationCheckbox() {
  const [confirmed, setConfirmed] = useState(false)
  const [done, setDone] = useState(false)

  if (done) return (
    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
      <X size={14} />
      Projecto eliminado (simulação). Recarrega para repor.
    </div>
  )

  return (
    <div className="w-full max-w-sm rounded-xl border border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10 p-4 space-y-3">
      <p className="text-sm text-text-muted italic">
        Confirmo que ao clicar em "Eliminar projecto" todos os dados associados serão{' '}
        <strong className="text-red-700 dark:text-red-400 not-italic">permanentemente removidos</strong>{' '}
        e esta acção não pode ser desfeita.
      </p>
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <div
          className={`w-4 h-4 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-theme
            ${confirmed ? 'border-red-600 bg-red-600' : 'border-border bg-bg'}`}
          onClick={() => setConfirmed((c) => !c)}
        >
          {confirmed && <X size={10} className="text-white" strokeWidth={3} />}
        </div>
        <span className="text-sm text-text-muted leading-snug">
          Li e compreendi as consequências desta acção
        </span>
      </label>
      <button
        disabled={!confirmed}
        onClick={() => setDone(true)}
        className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white
          hover:bg-red-700 transition-theme
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Eliminar projecto
      </button>
    </div>
  )
}

export default function CardsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div>
      <PageHeader
        title="Cards & Modais"
        description="Containers de conteúdo, sobreposições e painéis laterais."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminação">
        <p className="text-sm text-text-muted mb-5">Tem a certeza que pretende eliminar este projecto? Esta acção é <strong className="text-text-base">permanente e irreversível</strong>.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={() => setModalOpen(false)}>Eliminar projecto</Button>
        </div>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Configurações">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">Painel lateral para configurações, filtros ou detalhes de um item seleccionado.</p>
          {['Notificações', 'Permissões', 'Integrações', 'Faturação'].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-base">{item}</span>
              <ChevronRight size={14} className="text-text-muted" />
            </div>
          ))}
        </div>
      </Drawer>

      <div className="space-y-6">

        <ComponentDemo
          layout="rows"
          title="Card"
          description="Variantes de containers de conteúdo"
          code={`<div className="rounded-xl border border-border bg-surface p-5">
  <h3 className="font-semibold text-text-base">Título</h3>
  <p className="text-sm text-text-muted mt-1">Descrição.</p>
</div>`}
        >
          <VariantRow stack name="Estático" description={<>Container para <B>agrupar conteúdo relacionado</B> — informação, métricas, formulários, resultados de pesquisa. Não tem interacção. Usa `bg-surface` para se distinguir do fundo da página.</>}>
            <Card className="w-64">
              <h3 className="font-semibold text-text-base text-sm">Análise Q4 2025</h3>
              <p className="text-xs text-text-muted mt-1">Relatório com insights de mercado e tendências para o próximo trimestre.</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm">Ver relatório</Button>
                <Button size="sm" variant="ghost">Partilhar</Button>
              </div>
            </Card>
          </VariantRow>

          <VariantRow stack name="Clicável" description={<>Card <B>interactivo</B> que funciona como link ou botão de navegação. O `hover:border-primary/40` e `hover:shadow-md` sinalizam que o card inteiro é clicável — não apenas um botão interno.</>}>
            <Card onClick={() => {}} className="w-64">
              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">Design</div>
              <p className="text-2xl font-bold text-text-base">12</p>
              <p className="text-xs text-text-muted mt-0.5">projectos activos</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-primary">
                <span>Ver todos</span>
                <ExternalLink size={11} />
              </div>
            </Card>
          </VariantRow>

          <VariantRow stack name="Com imagem" description={<>Card com <B>área visual de destaque</B> no topo — ideal para conteúdo editorial, portfolios, catálogos de produto. O placeholder gradient é substituído por uma imagem real em produção.</>}>
            <div className="rounded-xl border border-border bg-surface overflow-hidden w-64">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-text-muted text-xs">Imagem 16:9</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-base text-sm">Identidade Visual ENSO</h3>
                <p className="text-xs text-text-muted mt-1">Projecto 2025</p>
              </div>
            </div>
          </VariantRow>
        </ComponentDemo>

        <ComponentDemo
          layout="rows"
          title="Sobreposições"
          description="Modais e drawers para acções e detalhes fora do fluxo principal"
          code={`// Modal
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
  <div className="relative z-10 w-full max-w-md bg-bg border border-border rounded-2xl shadow-2xl">
    ...
  </div>
</div>`}
        >
          <VariantRow name="Modal" description={<><B>Interrompe o fluxo</B> para forçar uma decisão ou recolher informação crítica. Use apenas quando a acção <B>requer atenção exclusiva</B> do utilizador — confirmações destrutivas, formulários curtos. Para tarefas longas, prefira uma página dedicada.</>}>
            <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>
          </VariantRow>

          <VariantRow name="Drawer" description={<>Painel lateral que <B>não interrompe</B> o contexto da página — o conteúdo por trás fica visível mas bloqueado. Ideal para <B>detalhes de um item seleccionado</B>, filtros de pesquisa, configurações e navegação em árvore.</>}>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>Abrir Drawer</Button>
          </VariantRow>
        </ComponentDemo>

        {/* Confirmação com checkbox */}
        <ComponentDemo
          layout="rows"
          title="Confirmação com checkbox"
          description="Padrão para acções destrutivas que requerem confirmação explícita e intencional"
          code={`const [confirmed, setConfirmed] = useState(false)

<div className="rounded-xl border border-red-200 bg-red-50/30 p-4 space-y-3">
  <p className="text-sm text-text-muted italic">
    Confirmo que ao clicar em "Eliminar projecto" todos os dados
    serão permanentemente removidos e esta acção não pode ser desfeita.
  </p>
  <label className="flex items-start gap-2.5 cursor-pointer">
    <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
    <span className="text-sm text-text-muted">Li e compreendi as consequências desta acção</span>
  </label>
  <button disabled={!confirmed} className="... disabled:opacity-40 disabled:cursor-not-allowed">
    Eliminar projecto
  </button>
</div>`}
        >
          <VariantRow
            stack
            name="Acção destrutiva com confirmação"
            description={<>O botão destrutivo permanece <B>disabled</B> até o utilizador marcar o checkbox. Este padrão cria <B>fricção intencional</B> — força uma leitura consciente antes de agir, reduzindo eliminações acidentais. Mais eficaz do que um simples modal de confirmação para acções <B>verdadeiramente irreversíveis</B> (apagar projecto, revogar acesso, limpar base de dados).</>}
          >
            <ConfirmationCheckbox />
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
