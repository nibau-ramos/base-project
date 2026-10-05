import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'

export default function TypographyPage() {
  return (
    <div>
      <PageHeader
        title="Tipografia"
        description="Escala baseada em Inter. Usa as classes Tailwind directamente — nenhum componente adicional necessário."
      />

      <div className="space-y-6">

        {/* Headings */}
        <ComponentDemo
          layout="rows"
          title="Headings"
          description="Hierarquia visual de títulos — H1 a H6"
          code={`<h1 className="text-5xl font-bold text-text-base">Título</h1>
<h2 className="text-4xl font-bold text-text-base">Título</h2>
<h3 className="text-3xl font-semibold text-text-base">Título</h3>
<h4 className="text-2xl font-semibold text-text-base">Título</h4>
<h5 className="text-xl font-medium text-text-base">Título</h5>
<h6 className="text-lg font-medium text-text-base">Título</h6>`}
        >
          <VariantRow stack name="H1 Display" description={<><B>Título de página ou hero section</B>. Deve existir <B>um único H1</B> por vista — é o elemento tipográfico de maior peso e o primeiro a ser lido. Reservado para títulos de ecrã ou landing pages.</>}>
            <h1 className="text-5xl font-bold text-text-base leading-tight">Inovação que transforma</h1>
          </VariantRow>

          <VariantRow stack name="H2 Section" description={<><B>Títulos de secções principais</B> dentro de uma página. Divide o conteúdo em blocos temáticos — ideal para páginas longas com múltiplas áreas de conteúdo.</>}>
            <h2 className="text-4xl font-bold text-text-base leading-tight">Design de produto</h2>
          </VariantRow>

          <VariantRow stack name="H3 Heading" description={<><B>Sub-secções</B> ou títulos de cards e painéis. Use quando H2 já está em uso e precisa de um nível hierárquico intermédio dentro de uma secção.</>}>
            <h3 className="text-3xl font-semibold text-text-base">Experiência UX</h3>
          </VariantRow>

          <VariantRow stack name="H4 Subheading" description={<><B>Agrupamentos de conteúdo</B> dentro de uma secção — títulos de acordeões, grupos de campos em formulários ou painéis laterais.</>}>
            <h4 className="text-2xl font-semibold text-text-base">Componentes</h4>
          </VariantRow>

          <VariantRow stack name="H5" description={<><B>Rótulos estruturais</B> de menor importância. Use em listas de items, groupings em tabelas ou como label de bloco quando H4 é demasiado proeminente.</>}>
            <h5 className="text-xl font-medium text-text-base">Design modular</h5>
          </VariantRow>

          <VariantRow stack name="H6" description={<><B>Menor nível de heading</B>. Raramente usado — considere usar um `label` ou `caption` se o contexto for um formulário ou tabela.</>}>
            <h6 className="text-lg font-medium text-text-base">Identidade visual</h6>
          </VariantRow>
        </ComponentDemo>

        {/* Body */}
        <ComponentDemo
          layout="rows"
          title="Body Text"
          description="Tamanhos de texto para conteúdo contínuo"
          code={`<p className="text-lg text-text-base">Body Large</p>
<p className="text-base text-text-base">Body</p>
<p className="text-sm text-text-muted">Body Small</p>
<p className="text-xs text-text-muted">Caption</p>`}
        >
          <VariantRow stack name="Body Large" description={<>Texto de <B>introdução</B> e parágrafos de destaque. Use na primeira linha de uma página, em cards de hero ou em descrições que merecem <B>maior atenção visual</B>.</>}>
            <p className="text-lg text-text-base leading-relaxed">Criamos experiências digitais com identidade.</p>
          </VariantRow>

          <VariantRow stack name="Body" description={<>O texto de corpo <B>padrão</B> — o mais usado na interface. Formulários, parágrafos, descrições em cards e conteúdo de modais devem usar este tamanho.</>}>
            <p className="text-base text-text-base leading-relaxed">Criamos experiências digitais com identidade.</p>
          </VariantRow>

          <VariantRow stack name="Body Small" description={<>Para <B>conteúdo secundário</B> e metadados: hints de campos, descrições abaixo de títulos de cards, notas de rodapé em modais.</>}>
            <p className="text-sm text-text-muted leading-relaxed">Criamos experiências digitais com identidade.</p>
          </VariantRow>

          <VariantRow stack name="Caption" description={<><B>Legendas e microcopy</B> — datas, autores, contagens, labels de input, mensagens de erro e timestamps. Sempre em `text-text-muted` para não competir com o conteúdo principal.</>}>
            <p className="text-xs text-text-muted">Última actualização: há 2 dias · por Carlos Ramos</p>
          </VariantRow>
        </ComponentDemo>

        {/* Pesos */}
        <ComponentDemo
          layout="rows"
          title="Pesos tipográficos"
          description="Pesos disponíveis com Inter — usados para criar hierarquia dentro de um mesmo tamanho"
          code={`<span className="font-light">Light 300</span>
<span className="font-normal">Regular 400</span>
<span className="font-medium">Medium 500</span>
<span className="font-semibold">Semibold 600</span>
<span className="font-bold">Bold 700</span>
<span className="font-extrabold">Extrabold 800</span>`}
        >
          <VariantRow stack name="Light 300" description={<>Raramente usado em UI. Reservado para <B>texto decorativo</B> em contextos de marca ou citações onde a leveza visual é intencional.</>}>
            <span className="text-2xl font-light text-text-base">Aa — Inovação</span>
          </VariantRow>

          <VariantRow stack name="Regular 400" description={<>Peso <B>padrão de corpo</B>. Todo o texto de leitura contínua — parágrafos, descrições, conteúdo de cards — deve usar este peso.</>}>
            <span className="text-2xl font-normal text-text-base">Aa — Inovação</span>
          </VariantRow>

          <VariantRow stack name="Medium 500" description={<>Peso para <B>labels e elementos de interface</B>: itens de menu, labels de campos, valores em tabelas. Ligeiramente mais pesado sem ser intrusivo.</>}>
            <span className="text-2xl font-medium text-text-base">Aa — Inovação</span>
          </VariantRow>

          <VariantRow stack name="Semibold 600" description={<>O peso mais versátil para <B>títulos de componentes</B> (card headers, modal titles, section labels). Equilibra presença e elegância.</>}>
            <span className="text-2xl font-semibold text-text-base">Aa — Inovação</span>
          </VariantRow>

          <VariantRow stack name="Bold 700" description={<>Para <B>headings de página</B> (H1–H3) e números de destaque em dashboards. Comunica importância máxima dentro de um bloco de conteúdo.</>}>
            <span className="text-2xl font-bold text-text-base">Aa — Inovação</span>
          </VariantRow>

          <VariantRow stack name="Extrabold 800" description={<>Reservado para <B>display text</B> em heroes e ecrãs de boas-vindas onde o impacto visual é o objectivo principal. Use com moderação.</>}>
            <span className="text-2xl font-extrabold text-text-base">Aa — Inovação</span>
          </VariantRow>
        </ComponentDemo>

        {/* Cores */}
        <ComponentDemo
          layout="rows"
          title="Cores de texto"
          description="Variações semânticas que respondem ao tema activo"
          code={`<p className="text-text-base">Texto base</p>
<p className="text-text-muted">Texto muted</p>
<p className="text-primary">Texto primary</p>
<p className="text-accent">Texto accent</p>`}
        >
          <VariantRow stack name="Base" description={<>Cor <B>padrão de todo o conteúdo</B> principal. Muda automaticamente entre claro/escuro com o tema. Nunca use cores fixas como `#000` — use sempre esta variável.</>}>
            <span className="text-base font-medium text-text-base">Texto de conteúdo principal</span>
          </VariantRow>

          <VariantRow stack name="Muted" description={<>Para <B>conteúdo secundário</B> que não deve competir visualmente: timestamps, hints, placeholders, metadados, labels de campos inactivos.</>}>
            <span className="text-base text-text-muted">Texto secundário / muted</span>
          </VariantRow>

          <VariantRow stack name="Primary" description={<>Cor de <B>marca activa</B> — links, itens de menu seleccionados, valores de destaque. Reflecte a cor primary do configurador de tema.</>}>
            <span className="text-base font-medium text-primary">Texto em cor primária</span>
          </VariantRow>

          <VariantRow stack name="Accent" description={<>Cor de <B>acento</B> para elementos que precisam de se destacar do primary: tags de promoção, destaques editoriais, indicadores de novidade.</>}>
            <span className="text-base font-medium text-accent">Texto em cor de acento</span>
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
