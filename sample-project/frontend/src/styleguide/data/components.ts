export interface ComponentEntry {
  name: string
  tags: string[]
  page: string
  path: string
}

export const ALL_COMPONENTS: ComponentEntry[] = [
  // Tipografia
  { name: 'Headings H1–H6', tags: ['tipografia', 'heading', 'título', 'display'], page: 'Tipografia', path: '/styleguide/typography' },
  { name: 'Body Text', tags: ['tipografia', 'body', 'parágrafo', 'texto'], page: 'Tipografia', path: '/styleguide/typography' },
  { name: 'Pesos tipográficos', tags: ['tipografia', 'peso', 'bold', 'light', 'medium'], page: 'Tipografia', path: '/styleguide/typography' },
  { name: 'Cores de texto', tags: ['tipografia', 'cor', 'muted', 'primary'], page: 'Tipografia', path: '/styleguide/typography' },
  { name: 'Links', tags: ['tipografia', 'link', 'anchor', 'hyperlink'], page: 'Tipografia', path: '/styleguide/typography' },
  // Botões
  { name: 'Botão Primary', tags: ['botão', 'button', 'primary', 'cta'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Botão Secondary', tags: ['botão', 'button', 'secondary'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Botão Ghost', tags: ['botão', 'button', 'ghost', 'transparente'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Botão Outline', tags: ['botão', 'button', 'outline', 'borda'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Botão Destructive', tags: ['botão', 'button', 'destructive', 'eliminar', 'delete'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Botão com ícone', tags: ['botão', 'button', 'ícone', 'icon'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Botão Loading', tags: ['botão', 'button', 'loading', 'spinner'], page: 'Botões', path: '/styleguide/buttons' },
  // Inputs
  { name: 'Text Input', tags: ['input', 'campo', 'formulário', 'texto'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Password Input', tags: ['input', 'password', 'palavra-passe'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Textarea', tags: ['textarea', 'input', 'multilinha', 'mensagem'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Select / Dropdown', tags: ['select', 'dropdown', 'escolha', 'opção'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Checkbox', tags: ['checkbox', 'seleção', 'múltipla'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Radio Group', tags: ['radio', 'seleção', 'exclusiva'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Toggle / Switch', tags: ['toggle', 'switch', 'activar', 'on/off'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'File Drop Zone', tags: ['drop', 'drag', 'upload', 'ficheiro', 'importar', 'arrastar'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Image Upload', tags: ['imagem', 'upload', 'foto', 'galeria', 'slot'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  { name: 'Input Underline', tags: ['input', 'underline', 'sublinhado', 'alternativo', 'minimalista'], page: 'Inputs & Forms', path: '/styleguide/inputs' },
  // Feedback
  { name: 'Alert Info', tags: ['alert', 'info', 'feedback', 'mensagem'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Alert Success', tags: ['alert', 'success', 'sucesso'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Alert Warning', tags: ['alert', 'warning', 'atenção'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Alert Error', tags: ['alert', 'error', 'erro'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Badge', tags: ['badge', 'etiqueta', 'tag', 'estado'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Spinner', tags: ['spinner', 'loading', 'carregar'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Progress Bar', tags: ['progress', 'progresso', 'barra'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Skeleton Loader', tags: ['skeleton', 'loading', 'placeholder'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Tag / Chip', tags: ['tag', 'chip', 'etiqueta', 'filtro', 'remover'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  { name: 'Stepper / Wizard', tags: ['stepper', 'wizard', 'passo', 'step', 'progresso', 'multi-passo'], page: 'Feedback & Estado', path: '/styleguide/feedback' },
  // Cards
  { name: 'Card básico', tags: ['card', 'container', 'box'], page: 'Cards & Modais', path: '/styleguide/cards' },
  { name: 'Card clicável', tags: ['card', 'clickable', 'interactivo'], page: 'Cards & Modais', path: '/styleguide/cards' },
  { name: 'Card com imagem', tags: ['card', 'imagem', 'media'], page: 'Cards & Modais', path: '/styleguide/cards' },
  { name: 'Modal / Dialog', tags: ['modal', 'dialog', 'popup', 'overlay'], page: 'Cards & Modais', path: '/styleguide/cards' },
  { name: 'Drawer', tags: ['drawer', 'sidebar', 'painel', 'lateral'], page: 'Cards & Modais', path: '/styleguide/cards' },
  { name: 'Botão FAB', tags: ['fab', 'floating', 'flutuante', 'action', 'botão', 'circular'], page: 'Botões', path: '/styleguide/buttons' },
  { name: 'Confirmação com checkbox', tags: ['confirmação', 'checkbox', 'destrutivo', 'eliminar', 'danger'], page: 'Cards & Modais', path: '/styleguide/cards' },
  // Tabelas
  { name: 'Tabela com sort', tags: ['tabela', 'table', 'sort', 'ordenar'], page: 'Tabelas & Listas', path: '/styleguide/tables' },
  { name: 'Lista com ícones', tags: ['lista', 'list', 'ícone', 'items'], page: 'Tabelas & Listas', path: '/styleguide/tables' },
  { name: 'Lista ordenada', tags: ['lista', 'ordenada', 'ol', 'numbered'], page: 'Tabelas & Listas', path: '/styleguide/tables' },
  { name: 'Acções de linha', tags: ['acções', 'row actions', 'editar', 'eliminar', 'aprovar', 'inline', 'tabela'], page: 'Tabelas & Listas', path: '/styleguide/tables' },
  // Navegação
  { name: 'Navbar', tags: ['navbar', 'navegação', 'menu', 'header'], page: 'Navegação', path: '/styleguide/navigation' },
  { name: 'Breadcrumb', tags: ['breadcrumb', 'trilho', 'caminho'], page: 'Navegação', path: '/styleguide/navigation' },
  { name: 'Tabs', tags: ['tabs', 'separadores', 'tab', 'navegar'], page: 'Navegação', path: '/styleguide/navigation' },
  { name: 'Paginação', tags: ['paginação', 'pagination', 'páginas'], page: 'Navegação', path: '/styleguide/navigation' },
]
