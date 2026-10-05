import { Plus, Trash2, ArrowRight, Download, Loader2, Pencil } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ComponentDemo from '../shared/ComponentDemo'
import VariantRow, { B } from '../shared/VariantRow'

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
type BtnSize = 'sm' | 'md' | 'lg'

interface BtnProps {
  variant?: BtnVariant
  size?: BtnSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

const variantClasses: Record<BtnVariant, string> = {
  primary:   'bg-primary text-white hover:opacity-90 active:scale-[0.98]',
  secondary: 'bg-secondary text-white hover:opacity-90 active:scale-[0.98]',
  ghost:     'bg-transparent text-text-base hover:bg-surface-hover active:scale-[0.98]',
  outline:   'bg-transparent border border-primary text-primary hover:bg-primary/10 active:scale-[0.98]',
  destructive: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
}

const sizeClasses: Record<BtnSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  children,
  onClick,
}: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 select-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]}
      `}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 12 : size === 'lg' ? 18 : 15} className="animate-spin" />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
}

export default function ButtonsPage() {
  return (
    <div>
      <PageHeader
        title="Botões"
        description="Variantes, tamanhos, estados e combinações com ícones. Cada botão reflecte a cor primária activa."
      />

      <div className="space-y-6">

        {/* Variantes */}
        <ComponentDemo
          layout="rows"
          title="Variantes"
          description="Escolha a variante de acordo com o peso hierárquico da acção na interface"
          code={`<Button variant="primary">Guardar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Ver mais</Button>
<Button variant="outline">Exportar</Button>
<Button variant="destructive">Eliminar</Button>`}
        >
          <VariantRow
            name="Primary"
            description={<><B>Acção principal</B> da página ou do fluxo actual. Use para o <B>CTA mais importante</B> — submeter um formulário, confirmar uma acção, avançar no onboarding. Deve existir <B>apenas um Primary</B> por secção visual.</>}
          >
            <Button variant="primary">Guardar alterações</Button>
          </VariantRow>

          <VariantRow
            name="Secondary"
            description={<><B>Acção de suporte</B> ao botão primário. Use quando existe uma segunda opção de peso relevante mas <B>menor hierarquia</B> — por exemplo "Guardar rascunho" ao lado de "Publicar".</>}
          >
            <Button variant="secondary">Guardar rascunho</Button>
          </VariantRow>

          <VariantRow
            name="Ghost"
            description={<><B>Acção discreta</B> sem preenchimento de fundo. Ideal em <B>toolbars</B>, menus contextuais e situações onde o botão não deve disputar atenção visual com o conteúdo circundante.</>}
          >
            <Button variant="ghost">Ver detalhes</Button>
          </VariantRow>

          <VariantRow
            name="Outline"
            description={<><B>Alternativa ao Ghost</B> com mais definição visual graças à borda. Use quando precisa de presença sem preencher com cor — ideal em <B>grupos de acções secundárias</B> ou filtros.</>}
          >
            <Button variant="outline">Exportar PDF</Button>
          </VariantRow>

          <VariantRow
            name="Destructive"
            description={<><B>Acção irreversível</B> ou de risco elevado: eliminar, revogar acesso, desactivar conta. Use com <B>moderação</B> e sempre precedido de um passo de <B>confirmação explícita</B> do utilizador.</>}
          >
            <Button variant="destructive">Eliminar conta</Button>
          </VariantRow>
        </ComponentDemo>

        {/* Tamanhos */}
        <ComponentDemo
          layout="rows"
          title="Tamanhos"
          description="Três tamanhos para adaptar ao contexto visual"
          code={`<Button size="sm">Compacto</Button>
<Button size="md">Padrão</Button>
<Button size="lg">Grande</Button>`}
        >
          <VariantRow
            name="Small"
            description={<>Tamanho <B>compacto</B> para espaços reduzidos: linhas de tabela, toolbars densas, <B>badges interactivos</B> e acções inline junto a texto.</>}
          >
            <Button size="sm">Adicionar</Button>
          </VariantRow>

          <VariantRow
            name="Medium"
            description={<>Tamanho <B>padrão</B> e o mais usado — o default para formulários, cards e diálogos. Equilíbrio entre densidade e <B>área de toque</B> confortável.</>}
          >
            <Button size="md">Adicionar</Button>
          </VariantRow>

          <VariantRow
            name="Large"
            description={<>Tamanho aumentado para <B>CTAs de destaque</B>: heroes, empty states, ecrãs de onboarding ou modais onde a acção principal merece <B>máxima visibilidade</B>.</>}
          >
            <Button size="lg">Começar agora</Button>
          </VariantRow>
        </ComponentDemo>

        {/* Com ícones */}
        <ComponentDemo
          layout="rows"
          title="Com ícones"
          description="Ícones reforçam a semântica da acção e reduzem a carga cognitiva"
          code={`<Button icon={<Plus size={15} />}>Novo item</Button>
<Button iconRight={<ArrowRight size={15} />}>Continuar</Button>
<Button variant="destructive" icon={<Trash2 size={15} />}>Eliminar</Button>`}
        >
          <VariantRow
            name="Ícone esquerdo"
            description={<>Ícone à <B>esquerda do label</B> — antecipa o significado da acção antes de ler o texto. Use para acções que têm um <B>ícone universalmente reconhecido</B> (adicionar, descarregar, enviar).</>}
          >
            <Button icon={<Plus size={15} />}>Novo projecto</Button>
          </VariantRow>

          <VariantRow
            name="Ícone direito"
            description={<>Ícone à <B>direita do label</B> — indica movimento, destino ou progressão após a acção. Comum em botões de <B>navegação</B> ("Continuar →", "Ver mais →").</>}
          >
            <Button iconRight={<ArrowRight size={15} />}>Ver relatório</Button>
          </VariantRow>

          <VariantRow
            name="Download"
            description={<>Combinação de ícone <B>contextual</B> com variante Ghost. O ícone elimina ambiguidade quando o label por si só pode ter <B>múltiplas interpretações</B>.</>}
          >
            <Button variant="ghost" icon={<Download size={15} />}>Exportar dados</Button>
          </VariantRow>

          <VariantRow
            name="Destructive"
            description={<>Ícone reforça a <B>gravidade da acção</B>. O ícone de lixo junto ao label "Eliminar" activa um <B>sinal de alerta visual</B> adicional antes do utilizador confirmar.</>}
          >
            <Button variant="destructive" icon={<Trash2 size={15} />}>Eliminar</Button>
          </VariantRow>
        </ComponentDemo>

        {/* Estados */}
        <ComponentDemo
          layout="rows"
          title="Estados"
          description="Reflectem a disponibilidade e o progresso assíncrono de uma acção"
          code={`<Button>Activo</Button>
<Button disabled>Desactivado</Button>
<Button loading>A guardar...</Button>`}
        >
          <VariantRow
            name="Default"
            description={<>Estado <B>inicial e disponível</B> — o botão está pronto para interacção. É o estado que o utilizador vê quando pode e deve tomar a acção.</>}
          >
            <Button>Publicar</Button>
          </VariantRow>

          <VariantRow
            name="Disabled"
            description={<>Botão <B>inactivo</B> — a acção não está disponível no contexto actual (permissões insuficientes, formulário inválido, etc.). O cursor muda para <B>not-allowed</B>. Considere sempre explicar <B>porquê</B> está desactivado.</>}
          >
            <Button disabled>Publicar</Button>
          </VariantRow>

          <VariantRow
            name="Loading"
            description={<>Estado de <B>espera assíncrona</B>: o pedido foi enviado e aguarda resposta. O botão fica bloqueado e mostra um <B>spinner animado</B> para indicar progresso. Use para operações que demoram mais de 300ms.</>}
          >
            <Button loading>A guardar...</Button>
          </VariantRow>
        </ComponentDemo>

        {/* FAB */}
        <ComponentDemo
          layout="rows"
          title="FAB — Floating Action Button"
          description="Botão de acção flutuante para a operação primária de um ecrã. Posicionado fixo no canto inferior direito."
          code={`// Standard
<button className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
  style={{ backgroundColor: 'var(--color-primary)' }}>
  <Plus size={22} />
</button>

// Extended (com label)
<button className="flex items-center gap-2 px-5 h-14 rounded-full shadow-lg text-white font-semibold"
  style={{ backgroundColor: 'var(--color-primary)' }}>
  <Plus size={18} /> Adicionar meio
</button>

// Em produção → fixed bottom-6 right-6 z-40`}
        >
          <VariantRow
            name="Standard"
            description={<>Círculo <B>w-14 h-14</B> com ícone +. Representa a <B>acção principal do ecrã</B>: criar um novo registo, adicionar um item. A sombra elevada (`shadow-lg`) separa-o visualmente dos restantes elementos.</>}
          >
            <button
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white
                hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus size={22} />
            </button>
          </VariantRow>

          <VariantRow
            name="Pequeno"
            description={<>Variante <B>w-10 h-10</B> para acções secundárias flutuantes. Útil quando existe um FAB principal e se precisar de uma <B>acção complementar</B> próxima sem criar confusão hierárquica.</>}
          >
            <button
              className="w-10 h-10 rounded-full shadow-md flex items-center justify-center text-white
                hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus size={16} />
            </button>
          </VariantRow>

          <VariantRow
            name="Extendido"
            description={<>Pill com ícone + label. Use quando o <B>contexto da acção não é óbvio</B> apenas pelo ícone, ou quando o design tem espaço para comunicar a acção com mais clareza (ex: "Adicionar meio", "Novo relatório").</>}
          >
            <button
              className="flex items-center gap-2 px-5 h-14 rounded-full shadow-lg text-white text-sm font-semibold
                hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus size={18} /> Adicionar meio
            </button>
          </VariantRow>

          <VariantRow
            name="Posição"
            description={<>Em produção, usar sempre <B>fixed bottom-6 right-6 z-40</B>. O FAB sobrepõe-se ao conteúdo e mantém-se visível durante o scroll. Em mobile, verificar que <B>não bloqueia</B> conteúdo crítico na zona inferior do ecrã (navigation bars do SO).</>}
          >
            <div className="relative w-full max-w-sm h-28 rounded-xl border border-dashed border-border bg-surface flex items-end justify-end p-4 overflow-hidden">
              <p className="absolute inset-0 flex items-center justify-center text-xs text-text-muted">
                Conteúdo da página
              </p>
              <button
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white
                  hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Pencil size={16} />
              </button>
            </div>
          </VariantRow>
        </ComponentDemo>

      </div>
    </div>
  )
}
