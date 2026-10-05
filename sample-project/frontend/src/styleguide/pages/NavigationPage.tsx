import { useState } from 'react'
import { Home, ChevronRight, Bell, Settings, User, LogOut, Menu, X, Search } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'
import { useAppSelector } from '../../store/hooks'

function DemoTabs({ tabs }: { tabs: string[] }) {
  const [active, setActive] = useState(tabs[0])
  return (
    <div className="w-full max-w-sm">
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-theme
              ${active === tab ? 'border-b-2 text-primary' : 'text-text-muted hover:text-text-base'}`}
            style={active === tab ? { borderColor: 'var(--color-primary)' } : {}}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="pt-3 text-sm text-text-muted">
        Conteúdo: <span className="font-medium text-text-base">{active}</span>
      </div>
    </div>
  )
}

function DemoPagination() {
  const [page, setPage] = useState(1)
  const pages = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-muted
          hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-theme"
      >‹</button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`w-8 h-8 text-sm rounded-lg font-medium transition-theme
            ${p === page ? 'text-white' : 'text-text-muted hover:bg-surface-hover border border-border'}`}
          style={p === page ? { backgroundColor: 'var(--color-primary)' } : {}}
        >{p}</button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(5, p + 1))}
        disabled={page === 5}
        className="px-3 py-1.5 text-sm rounded-lg border border-border text-text-muted
          hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-theme"
      >›</button>
    </div>
  )
}

const NAV_LINKS = ['Início', 'Projectos', 'Equipa', 'Relatórios']

function LogoMark({ logoUrl }: { logoUrl: string | null }) {
  if (logoUrl) {
    return <img src={logoUrl} alt="Logo" className="h-6 w-auto max-w-20 object-contain" />
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>E</div>
      <span className="font-semibold text-sm text-text-base hidden sm:inline">ENSO</span>
    </div>
  )
}

function DemoNavbar() {
  const logoUrl = useAppSelector((s) => s.theme.logoUrl)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="w-full">
      <nav className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-surface gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <LogoMark logoUrl={logoUrl} />
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex gap-0.5">
          {NAV_LINKS.slice(0, 3).map((item, i) => (
            <a key={item} className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-theme font-medium
              ${i === 0 ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text-base hover:bg-surface-hover'}`}
              style={i === 0 ? { color: 'var(--color-primary)', backgroundColor: 'var(--color-primary)1a' } : {}}
            >{item}</a>
          ))}
        </div>

        {/* Search — desktop */}
        <div className="hidden md:flex flex-1 max-w-xs">
          <div className="relative w-full">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-bg
                text-text-base placeholder:text-text-muted
                focus:outline-none focus:ring-1 focus:border-primary transition-theme"
              style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover transition-theme hidden sm:flex"><Bell size={15} /></button>
          <button className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover transition-theme hidden sm:flex"><Settings size={15} /></button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)20' }}>
            <User size={14} style={{ color: 'var(--color-primary)' }} />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover transition-theme md:hidden"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="mt-1 rounded-xl border border-border bg-surface p-2 flex flex-col gap-0.5 md:hidden">
          <div className="relative mb-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-bg
                text-text-base placeholder:text-text-muted focus:outline-none focus:ring-1 focus:border-primary transition-theme"
              style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
            />
          </div>
          {NAV_LINKS.map((item) => (
            <a key={item} className="px-3 py-2 text-sm rounded-lg text-text-muted hover:bg-surface-hover cursor-pointer">{item}</a>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <a className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut size={14} /> Sair
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function DemoMobileMenu() {
  const [open, setOpen] = useState(false)
  const logoUrl = useAppSelector((s) => s.theme.logoUrl)

  return (
    <div className="w-full max-w-xs relative">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-surface text-text-base hover:bg-surface-hover transition-theme"
      >
        <Menu size={16} /> Abrir Menu
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-border bg-surface overflow-hidden shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <LogoMark logoUrl={logoUrl} />
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-text-muted hover:bg-surface-hover transition-theme">
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-bg
                  text-text-base placeholder:text-text-muted focus:outline-none focus:ring-1 transition-theme"
                style={{ '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Links */}
          <nav className="p-2 flex flex-col gap-0.5">
            {NAV_LINKS.map((item, i) => (
              <a
                key={item}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg cursor-pointer font-medium transition-theme
                  ${i === 0 ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-text-base hover:bg-surface-hover'}`}
                style={i === 0 ? { color: 'var(--color-primary)', backgroundColor: 'var(--color-primary)1a' } : {}}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-2">
            <a className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 cursor-pointer font-medium transition-theme">
              <LogOut size={14} /> Sair da conta
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function NavigationPage() {
  const breadcrumbs = [
    { label: 'Início', icon: <Home size={13} /> },
    { label: 'Projectos' },
    { label: 'Design System' },
    { label: 'Componentes' },
  ]

  return (
    <div>
      <PageHeader
        title="Navegação"
        description="Padrões de navegação para orientar o utilizador dentro da interface."
      />

      <div className="space-y-6">

        <ComponentDemo
          layout="rows"
          title="Navbar"
          description="Barra de navegação principal com pesquisa e hamburger menu responsivo — clica no ☰ para ver o menu mobile"
          code={`<nav className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-surface">
  <Logo />
  <div className="hidden md:flex gap-1">
    {links.map(link => <a className="px-3 py-1.5 text-sm rounded-lg ...">{link}</a>)}
  </div>
  {/* Search */}
  <div className="hidden md:flex relative flex-1 max-w-xs">
    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
    <input placeholder="Pesquisar..." className="w-full pl-8 ... border border-border rounded-lg" />
  </div>
  <button className="md:hidden"><Menu size={16} /></button>
</nav>`}
        >
          <VariantRow stack name="Navbar" description={<>Presente em <B>todas as páginas</B> — ancora a identidade da marca e disponibiliza os destinos principais. A <B>pesquisa inline</B> (desktop) e dentro do menu mobile garante acesso rápido a qualquer conteúdo. O hamburger é <B>obrigatório em mobile</B>, colapsando os links e a pesquisa numa lista vertical acessível.</>}>
            <DemoNavbar />
          </VariantRow>
        </ComponentDemo>

        <ComponentDemo
          layout="rows"
          title="Menu Mobile"
          description="Painel de navegação para ecrãs pequenos — clica em 'Abrir Menu' para ver o estado aberto"
          code={`{open && (
  <div className="rounded-xl border border-border bg-surface shadow-lg">
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <Logo /> <button onClick={close}><X size={16} /></button>
    </div>
    <div className="px-3 py-2 border-b border-border">
      <input placeholder="Pesquisar..." className="w-full pl-8 ..." />
    </div>
    <nav className="p-2">
      {links.map(link => <a className="... px-3 py-2.5 rounded-lg">{link}</a>)}
    </nav>
    <div className="border-t border-border p-2">
      <a className="text-red-600 ...">Sair</a>
    </div>
  </div>
)}`}
        >
          <VariantRow stack name="Menu" description={<>Activado pelo botão hamburger na Navbar em <B>viewports mobile</B>. Inclui sempre: <B>logo + fechar</B> no topo, <B>pesquisa</B> para acesso rápido, <B>links de navegação</B> com destaque no item activo, e <B>acções de conta</B> (logout) no rodapé. Nunca omita a pesquisa — em mobile é o principal atalho de navegação.</>}>
            <DemoMobileMenu />
          </VariantRow>
        </ComponentDemo>

        <ComponentDemo
          layout="rows"
          title="Breadcrumb"
          description="Orientação hierárquica dentro de estruturas profundas"
          code={`<nav className="flex items-center gap-1 text-sm flex-wrap">
  {items.map((item, i) => (
    <>
      {i > 0 && <ChevronRight size={13} className="text-text-muted" />}
      <a className="text-text-muted hover:text-primary">{item.label}</a>
    </>
  ))}
</nav>`}
        >
          <VariantRow stack name="Breadcrumb" description={<>Essencial em <B>hierarquias com 3+ níveis</B> — dashboards, plataformas de conteúdo, e-commerce. Permite ao utilizador entender onde está e <B>subir rapidamente</B> sem usar o botão de retroceder. O último item é o nível actual (não clicável).</>}>
            <nav className="flex items-center gap-1 text-sm flex-wrap">
              {breadcrumbs.map((item, i) => (
                <span key={item.label} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={13} className="text-text-muted" />}
                  <a className={`flex items-center gap-1 transition-theme cursor-pointer
                    ${i === breadcrumbs.length - 1 ? 'text-text-base font-medium pointer-events-none' : 'text-text-muted hover:text-primary'}`}
                  >
                    {item.icon}{item.label}
                  </a>
                </span>
              ))}
            </nav>
          </VariantRow>
        </ComponentDemo>

        <ComponentDemo
          layout="rows"
          title="Tabs"
          description="Navegação entre vistas relacionadas dentro de uma mesma página"
          code={`<div className="flex border-b border-border">
  {tabs.map(tab => (
    <button className={\`px-4 py-2.5 text-sm font-medium
      \${active === tab ? 'border-b-2 border-primary text-primary' : 'text-text-muted hover:text-text-base'}\`}>
      {tab}
    </button>
  ))}
</div>`}
        >
          <VariantRow stack name="Tabs" description={<>Para <B>alternar entre vistas relacionadas</B> do mesmo contexto — dados de um projecto, perfil de utilizador, configurações por categoria. O conteúdo abaixo muda mas a página <B>não recarrega</B>. Use 2–5 tabs; para mais opções, considere uma sidebar.</>}>
            <DemoTabs tabs={['Visão Geral', 'Actividade', 'Membros', 'Config.']} />
          </VariantRow>
        </ComponentDemo>

        <ComponentDemo
          layout="rows"
          title="Paginação"
          description="Navegação entre páginas de uma colecção de dados"
          code={`<div className="flex items-center gap-1">
  <button disabled={page === 1} className="px-3 py-1.5 rounded-lg border ...">‹</button>
  {pages.map(p => (
    <button className={\`w-8 h-8 rounded-lg \${p === current ? 'bg-primary text-white' : 'border ...'}\`}>
      {p}
    </button>
  ))}
  <button disabled={page === last} className="px-3 py-1.5 rounded-lg border ...">›</button>
</div>`}
        >
          <VariantRow stack name="Paginação" description={<>Use quando uma <B>colecção tem mais de 10–15 itens</B> e mostrar tudo de uma vez prejudicaria a performance ou a legibilidade. Para listas de actividade em tempo real, considere <B>infinite scroll</B> em alternativa. A página activa usa sempre a cor primary.</>}>
            <DemoPagination />
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
