@base @settings @branding
Feature: Branding do projeto
  Como administrador
  Quero configurar a identidade visual do projeto
  Para que a plataforma apresente a marca do cliente

  Background:
    Given que estou autenticado como administrador
    And que estou nas settings, na secção de branding

  Scenario: Campos de branding disponíveis
    Then posso carregar o logótipo do projeto ou do cliente
    And posso definir o nome do cliente
    And posso definir o título do projeto
    And posso definir o esquema de 4 cores do projeto

  # ── Logótipo ───────────────────────────────────────────────────────────

  Scenario: Carregar o logótipo
    When arrasto ou seleciono um ficheiro PNG, JPG, SVG, WEBP ou ICO com até 1 MB
    Then o logótipo é guardado de imediato
    And vejo a pré-visualização sobre fundo claro e sobre fundo escuro

  Scenario Outline: Logótipo recusado
    When carrego "<ficheiro>"
    Then vejo a mensagem "<mensagem>"

    Examples:
      | ficheiro                     | mensagem                                                  |
      | um documento de texto        | Formato não suportado. Utilize PNG, JPG, SVG, WEBP ou ICO. |
      | uma imagem com mais de 1 MB  | O ficheiro excede 1 MB.                                   |

  Scenario: Remover o logótipo
    Given que existe um logótipo carregado
    When o removo
    Then o login e o back-office passam a mostrar a inicial e o título do projeto
    And o favicon passa a ser o símbolo da ENSO
    And os e-mails deixam de incluir logótipo

  Scenario: Logótipo do cliente na página de login
    Given que carreguei um logótipo nas settings de branding
    When um visitante abre a página de login
    Then vê o logótipo configurado

  Scenario: Favicon igual ao logótipo do branding
    Given que carreguei um logótipo nas settings de branding
    When abro qualquer página da aplicação
    Then o favicon apresentado é o logótipo configurado

  # ── Título e cliente ───────────────────────────────────────────────────

  Scenario: Título do projeto disponível na aplicação
    Given que defini o título do projeto "Portal Exemplo"
    Then o título "Portal Exemplo" fica disponível para o front-end e para o back-end
    And é o título do separador do browser

  Scenario: Título obrigatório
    When guardo o branding com o título do projeto vazio
    Then vejo a mensagem "Indique o título do projeto."

  # ── Cores ──────────────────────────────────────────────────────────────

  Scenario: Esquema de 4 cores
    Then posso definir as cores "primary", "secondary", "neutral" e "accent"
    And cada cor é indicada no formato #RRGGBB, por seletor de cor ou escrita diretamente
    # primary: marca, botões e links · secondary: tons escuros · neutral: cinzento · accent: destaques

  Scenario Outline: Esquemas de cores prontos a aplicar
    When escolho o esquema "<nome>"
    Then as cores ficam primary "<primary>", secondary "<secondary>", neutral "<neutral>" e accent "<accent>"
    And o esquema escolhido fica assinalado

    Examples:
      | nome      | primary | secondary | neutral | accent  |
      | ENSO      | #0086ac | #0f172a   | #6b7280 | #f97316 |
      | Oceano    | #1d4ed8 | #0b1a33   | #64748b | #14b8a6 |
      | Floresta  | #15803d | #13231a   | #6b7266 | #ca8a04 |
      | Terracota | #c2410c | #2a1810   | #78716c | #0f766e |
      | Ameixa    | #7c3aed | #1c1330   | #71717a | #db2777 |
      | Rubi      | #be123c | #1f1216   | #737373 | #f59e0b |
      | Grafite   | #334155 | #020617   | #6b7280 | #0ea5e9 |

  Scenario: Pré-visualização das cores em toda a aplicação
    When altero uma cor ou escolho um esquema
    Then toda a aplicação passa a usar as novas cores de imediato
    And vejo a indicação de que há alterações de cor por guardar

  Scenario: Sair sem guardar repõe as cores
    Given que alterei as cores sem guardar
    When saio da secção de branding
    Then a aplicação volta às cores guardadas

  Scenario: Guardar as cores
    Given que alterei as cores
    When guardo o branding
    Then as novas cores ficam ativas para todos os utilizadores, no front-end público e no back-office
    And os botões dos e-mails passam a usar a cor "primary"

  Scenario: Sugestão de cores a partir do logótipo
    When carrego um logótipo
    Then é sugerido um esquema de 4 cores extraído do logótipo
    And posso aplicar a sugestão ou mantê-la de lado

  Scenario: Cores inválidas recusadas pelo back-end
    When o back-end recebe uma cor que não está no formato #RRGGBB
    Then o branding não é guardado
    And é devolvida a mensagem "As cores devem estar no formato #RRGGBB."

  # ── Marca ENSO ─────────────────────────────────────────────────────────

  Scenario Outline: Indicação Powered by ENSO
    When abro a página "<pagina>"
    Then vejo o texto "Powered by" numa linha
    And vejo o logótipo da ENSO na linha de baixo
    And o logótipo da ENSO é o oficial disponibilizado pela ENSO ORIGINS (enso-origins.com)
    And em modo escuro é usada a versão negativa do logótipo

    Examples:
      | pagina                |
      | login                 |
      | recuperar password    |
      | back-office           |
