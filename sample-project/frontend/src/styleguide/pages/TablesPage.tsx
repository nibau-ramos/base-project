import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, Clock, XCircle, User, Check, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'

const TEAM_DATA = [
  { id: 1, name: 'Ana Ferreira',    role: 'Design Lead',  status: 'active',   projects: 4, joined: '2023-01-15' },
  { id: 2, name: 'Bruno Costa',     role: 'Developer',    status: 'active',   projects: 7, joined: '2022-08-01' },
  { id: 3, name: 'Catarina Silva',  role: 'Strategist',   status: 'pending',  projects: 2, joined: '2024-03-10' },
  { id: 4, name: 'David Nunes',     role: 'Developer',    status: 'inactive', projects: 0, joined: '2021-11-05' },
  { id: 5, name: 'Eva Martins',     role: 'Marketing',    status: 'active',   projects: 3, joined: '2023-07-20' },
]

type SortKey = 'name' | 'role' | 'projects'

const statusConfig = {
  active:   { icon: <CheckCircle2 size={13} />, label: 'Activo',   classes: 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950/40' },
  pending:  { icon: <Clock size={13} />,        label: 'Pendente', classes: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40' },
  inactive: { icon: <XCircle size={13} />,      label: 'Inactivo', classes: 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/40' },
}

const LIST_ITEMS = [
  { icon: <CheckCircle2 size={16} className="text-green-600" />, title: 'Design system aprovado', meta: 'há 2 dias' },
  { icon: <Clock size={16} className="text-amber-500" />,         title: 'Revisão de identidade visual', meta: 'em progresso' },
  { icon: <User size={16} className="text-primary" style={{ color: 'var(--color-primary)' }} />, title: 'Onboarding novo cliente', meta: 'amanhã' },
  { icon: <XCircle size={16} className="text-red-500" />,         title: 'Sprint atrasado', meta: 'crítico' },
]

const ROW_DATA = [
  { id: 1, name: 'Campanha Q3', dept: 'Marketing', status: 'Pendente' },
  { id: 2, name: 'Website Redesign', dept: 'Design', status: 'Em progresso' },
  { id: 3, name: 'Datalogger v2', dept: 'Tecnologia', status: 'Concluído' },
]

function RowActionsDemo() {
  const [rows, setRows] = useState(ROW_DATA)
  const [approved, setApproved] = useState<number[]>([])
  return (
    <div className="w-full max-w-lg rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface text-left">
            <th className="py-2.5 px-4 font-medium text-text-muted">Nome</th>
            <th className="py-2.5 px-4 font-medium text-text-muted">Departamento</th>
            <th className="py-2.5 px-4 font-medium text-text-muted text-right">Acções</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface-hover transition-theme">
              <td className="py-2.5 px-4 text-text-base font-medium">{row.name}</td>
              <td className="py-2.5 px-4 text-text-muted">{row.dept}</td>
              <td className="py-2.5 px-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    title="Aprovar"
                    onClick={() => setApproved((p) => p.includes(row.id) ? p.filter((x) => x !== row.id) : [...p, row.id])}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-theme
                      ${approved.includes(row.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-900/50'}`}
                  >
                    <Check size={13} />
                  </button>
                  <button
                    title="Editar"
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-theme
                      bg-primary/10 hover:bg-primary/20"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => setRows((p) => p.filter((r) => r.id !== row.id))}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-theme
                      bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={3} className="py-6 text-center text-xs text-text-muted">Todos eliminados · recarrega para repor</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function RowActionsHoverDemo() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface text-left">
            <th className="py-2.5 px-4 font-medium text-text-muted">Nome</th>
            <th className="py-2.5 px-4 font-medium text-text-muted">Departamento</th>
            <th className="py-2.5 px-4 font-medium text-text-muted text-right">Acções</th>
          </tr>
        </thead>
        <tbody>
          {ROW_DATA.map((row) => (
            <tr key={row.id} className="group border-b border-border last:border-0 hover:bg-surface-hover transition-theme">
              <td className="py-2.5 px-4 text-text-base font-medium">{row.name}</td>
              <td className="py-2.5 px-4 text-text-muted">{row.dept}</td>
              <td className="py-2.5 px-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button title="Aprovar"
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/40 dark:text-green-400 transition-theme">
                    <Check size={13} />
                  </button>
                  <button title="Editar"
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-theme"
                    style={{ color: 'var(--color-primary)' }}>
                    <Pencil size={13} />
                  </button>
                  <button title="Eliminar"
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400 transition-theme">
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-text-muted border-t border-border">↑ Passa o rato sobre uma linha para ver as acções</p>
    </div>
  )
}

export default function TablesPage() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'asc') { setSortDir('desc') }
      else { setSortKey(null); setSortDir(null) }
    } else {
      setSortKey(key); setSortDir('asc')
    }
  }

  const sortedData = [...TEAM_DATA].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const av = a[sortKey], bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="opacity-40" />
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  return (
    <div>
      <PageHeader
        title="Tabelas & Listas"
        description="Apresentação estruturada de colecções de dados."
      />

      <div className="space-y-6">

        <ComponentDemo
          layout="rows"
          title="Tabela de dados"
          description="Tabela com cabeçalhos clicáveis para ordenação — clica nos cabeçalhos para experimentar"
          code={`<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-border text-left bg-surface">
      <th onClick={() => handleSort('name')} className="py-3 px-4 font-medium text-text-muted cursor-pointer">
        Nome <ArrowUpDown size={12} />
      </th>
    </tr>
  </thead>
  <tbody>
    {rows.map(row => (
      <tr className="border-b border-border hover:bg-surface-hover">
        <td className="py-3 px-4">{row.name}</td>
      </tr>
    ))}
  </tbody>
</table>`}
        >
          <VariantRow stack name="Data Table" description={<>Use tabelas quando o utilizador precisa de <B>comparar valores entre linhas</B> ou localizar um registo específico numa colecção. Inclua sempre <B>sorting nos cabeçalhos</B> quando os dados têm mais de 5–6 linhas. Para dados sem necessidade de comparação, prefira uma lista de cards.</>}>
            <div className="w-full overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left">
                    {[{ key: 'name' as SortKey, label: 'Nome' }, { key: 'role' as SortKey, label: 'Cargo' }].map(({ key, label }) => (
                      <th key={key} onClick={() => handleSort(key)} className="py-3 px-4 font-medium text-text-muted cursor-pointer hover:text-text-base transition-theme select-none">
                        <div className="flex items-center gap-1.5">{label}<SortIcon col={key} /></div>
                      </th>
                    ))}
                    <th className="py-3 px-4 font-medium text-text-muted">Estado</th>
                    <th onClick={() => handleSort('projects')} className="py-3 px-4 font-medium text-text-muted cursor-pointer hover:text-text-base transition-theme select-none">
                      <div className="flex items-center gap-1.5">Projectos<SortIcon col="projects" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row) => {
                    const s = statusConfig[row.status as keyof typeof statusConfig]
                    return (
                      <tr key={row.id} className="border-b border-border hover:bg-surface-hover transition-theme last:border-0">
                        <td className="py-3 px-4 font-medium text-text-base">{row.name}</td>
                        <td className="py-3 px-4 text-text-muted">{row.role}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.classes}`}>{s.icon}{s.label}</span>
                        </td>
                        <td className="py-3 px-4 text-text-muted">{row.projects}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </VariantRow>
        </ComponentDemo>

        <ComponentDemo
          layout="rows"
          title="Listas"
          description="Apresentação de colecções com menos estrutura que tabelas"
          code={`<ul className="divide-y divide-border">
  {items.map(item => (
    <li className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover">
      {item.icon}
      <span className="flex-1 text-sm">{item.title}</span>
      <span className="text-xs text-text-muted">{item.meta}</span>
    </li>
  ))}
</ul>`}
        >
          <VariantRow stack name="Com ícones" description={<>Para <B>listas de actividade, notificações ou tarefas</B> onde o ícone comunica o tipo ou estado de cada item. O `divide-y` cria separação visual limpa sem precisar de bordas individuais.</>}>
            <div className="w-full max-w-sm rounded-xl border border-border bg-surface overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-text-base">Actividade recente</p>
              </div>
              <ul className="divide-y divide-border">
                {LIST_ITEMS.map((item) => (
                  <li key={item.title} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-theme">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-sm text-text-base">{item.title}</span>
                    <span className="text-xs text-text-muted">{item.meta}</span>
                  </li>
                ))}
              </ul>
            </div>
          </VariantRow>

          <VariantRow stack name="Ordenada" description={<>Lista numerada para <B>sequências com ordem obrigatória</B>: tutoriais passo-a-passo, processos de onboarding, instruções técnicas. A numeração implica que a ordem importa.</>}>
            <ol className="list-decimal list-inside space-y-2 text-sm text-text-base">
              <li>Definir objectivos estratégicos</li>
              <li>Pesquisa e descoberta com utilizadores</li>
              <li>Prototipagem e validação</li>
              <li>Desenvolvimento e testes</li>
              <li>Lançamento e iteração</li>
            </ol>
          </VariantRow>

          <VariantRow stack name="Não ordenada" description={<>Para <B>colecções sem hierarquia de ordem</B>: funcionalidades de um produto, ingredientes, opções disponíveis. Os bullets indicam que os itens têm peso equivalente.</>}>
            <ul className="list-disc list-inside space-y-2 text-sm text-text-base">
              <li>Design system modular</li>
              <li>Branding e identidade visual</li>
              <li>UX Research e testes</li>
              <li>Estratégia digital</li>
            </ul>
          </VariantRow>
        </ComponentDemo>

        {/* Row actions */}
        <ComponentDemo
          layout="rows"
          title="Acções de linha"
          description="Botões compactos e circulares no final de cada linha de tabela para operações rápidas"
          code={`// Em cada <tr>
<td className="py-3 px-4">
  <div className="flex items-center justify-end gap-1">
    <button title="Aprovar"
      className="w-7 h-7 rounded-full bg-green-100 text-green-700 hover:bg-green-200 ...">
      <Check size={13} />
    </button>
    <button title="Editar"
      className="w-7 h-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20 ...">
      <Pencil size={13} />
    </button>
    <button title="Eliminar"
      className="w-7 h-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200 ...">
      <Trash2 size={13} />
    </button>
  </div>
</td>`}
        >
          <VariantRow
            stack
            name="Grupo de ícones"
            description={<>Três acções inline representadas por botões circulares <B>w-7 h-7</B>: <B>verde</B> para aprovar/confirmar, <B>primary</B> para editar, <B>vermelho</B> para eliminar. O fundo colorido tenue (`bg-color/10`) muda para `bg-color/20` no hover — sem fronteiras, sem ruído visual. Ideal em tabelas densas onde os botões de texto ocupariam demasiado espaço.</>}
          >
            <RowActionsDemo />
          </VariantRow>

          <VariantRow
            stack
            name="Linha hover"
            description={<>As acções de linha podem <B>aparecer apenas no hover da linha</B> usando `opacity-0 group-hover:opacity-100` no contentor das acções, e `group` na `tr`. Mantém a tabela limpa e as acções disponíveis sem cluttar visualmente quando o utilizador não está a interagir com uma linha específica.</>}
          >
            <RowActionsHoverDemo />
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
