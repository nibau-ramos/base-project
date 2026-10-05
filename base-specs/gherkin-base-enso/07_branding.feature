# language: pt
@base @settings @branding
Funcionalidade: Branding do projeto
  Como administrador
  Quero configurar a identidade visual do projeto
  Para que a plataforma apresente a marca do cliente

  Contexto:
    Dado que estou autenticado como administrador
    E que estou nas settings, na secção de branding

  Cenário: Campos de branding disponíveis
    Então posso carregar o logótipo do projeto ou do cliente
    E posso definir o nome do cliente
    E posso definir o título do projeto
    E posso definir o esquema de 4 cores do projeto

  # ── Logótipo ───────────────────────────────────────────────────────────

  Cenário: Carregar o logótipo
    Quando arrasto ou seleciono um ficheiro PNG, JPG, SVG, WEBP ou ICO com até 1 MB
    Então o logótipo é guardado de imediato
    E vejo a pré-visualização sobre fundo claro e sobre fundo escuro

  Esquema do Cenário: Logótipo recusado
    Quando carrego "<ficheiro>"
    Então vejo a mensagem "<mensagem>"

    Exemplos:
      | ficheiro                     | mensagem                                                  |
      | um documento de texto        | Formato não suportado. Utilize PNG, JPG, SVG, WEBP ou ICO. |
      | uma imagem com mais de 1 MB  | O ficheiro excede 1 MB.                                   |

  Cenário: Remover o logótipo
    Dado que existe um logótipo carregado
    Quando o removo
    Então o login e o back-office passam a mostrar a inicial e o título do projeto
    E o favicon passa a ser o símbolo da ENSO
    E os e-mails deixam de incluir logótipo

  Cenário: Logótipo do cliente na página de login
    Dado que carreguei um logótipo nas settings de branding
    Quando um visitante abre a página de login
    Então vê o logótipo configurado

  Cenário: Favicon igual ao logótipo do branding
    Dado que carreguei um logótipo nas settings de branding
    Quando abro qualquer página da aplicação
    Então o favicon apresentado é o logótipo configurado

  # ── Título e cliente ───────────────────────────────────────────────────

  Cenário: Título do projeto disponível na aplicação
    Dado que defini o título do projeto "Portal Exemplo"
    Então o título "Portal Exemplo" fica disponível para o front-end e para o back-end
    E é o título do separador do browser

  Cenário: Título obrigatório
    Quando guardo o branding com o título do projeto vazio
    Então vejo a mensagem "Indique o título do projeto."

  # ── Cores ──────────────────────────────────────────────────────────────

  Cenário: Esquema de 4 cores
    Então posso definir as cores "primary", "secondary", "neutral" e "accent"
    E cada cor é indicada no formato #RRGGBB, por seletor de cor ou escrita diretamente
    # primary: marca, botões e links · secondary: tons escuros · neutral: cinzento · accent: destaques

  Esquema do Cenário: Esquemas de cores prontos a aplicar
    Quando escolho o esquema "<nome>"
    Então as cores ficam primary "<primary>", secondary "<secondary>", neutral "<neutral>" e accent "<accent>"
    E o esquema escolhido fica assinalado

    Exemplos:
      | nome      | primary | secondary | neutral | accent  |
      | ENSO      | #0086ac | #0f172a   | #6b7280 | #f97316 |
      | Oceano    | #1d4ed8 | #0b1a33   | #64748b | #14b8a6 |
      | Floresta  | #15803d | #13231a   | #6b7266 | #ca8a04 |
      | Terracota | #c2410c | #2a1810   | #78716c | #0f766e |
      | Ameixa    | #7c3aed | #1c1330   | #71717a | #db2777 |
      | Rubi      | #be123c | #1f1216   | #737373 | #f59e0b |
      | Grafite   | #334155 | #020617   | #6b7280 | #0ea5e9 |

  Cenário: Pré-visualização das cores em toda a aplicação
    Quando altero uma cor ou escolho um esquema
    Então toda a aplicação passa a usar as novas cores de imediato
    E vejo a indicação de que há alterações de cor por guardar

  Cenário: Sair sem guardar repõe as cores
    Dado que alterei as cores sem guardar
    Quando saio da secção de branding
    Então a aplicação volta às cores guardadas

  Cenário: Guardar as cores
    Dado que alterei as cores
    Quando guardo o branding
    Então as novas cores ficam ativas para todos os utilizadores, no front-end público e no back-office
    E os botões dos e-mails passam a usar a cor "primary"

  Cenário: Sugestão de cores a partir do logótipo
    Quando carrego um logótipo
    Então é sugerido um esquema de 4 cores extraído do logótipo
    E posso aplicar a sugestão ou mantê-la de lado

  Cenário: Cores inválidas recusadas pelo back-end
    Quando o back-end recebe uma cor que não está no formato #RRGGBB
    Então o branding não é guardado
    E é devolvida a mensagem "As cores devem estar no formato #RRGGBB."

  # ── Marca ENSO ─────────────────────────────────────────────────────────

  Esquema do Cenário: Indicação Powered by ENSO
    Quando abro a página "<pagina>"
    Então vejo o texto "Powered by" numa linha
    E vejo o logótipo da ENSO na linha de baixo
    E o logótipo da ENSO é o oficial disponibilizado pela ENSO ORIGINS (enso-origins.com)
    E em modo escuro é usada a versão negativa do logótipo

    Exemplos:
      | pagina                |
      | login                 |
      | recuperar password    |
      | back-office           |
