@base @ui
Feature: Interface, tipografia e formatação
  Como utilizador
  Quero uma interface consistente e utilizável em qualquer dispositivo
  Para trabalhar a partir do computador, tablet ou telemóvel

  # ── Identidade visual ──────────────────────────────────────────────────

  Scenario: Identidade visual do style guide ENSO
    When abro qualquer página da aplicação
    Then os componentes seguem o style guide ENSO (botões, campos, alertas, badges, cartões, tabs e modais)
    And as cores vêm do esquema de 4 cores definido no branding
    # O style guide é a referência visual comum a todos os projetos; cada projeto varia cores e logótipo

  Scenario: Tipo de letra Inter
    When abro qualquer página da aplicação
    Then o texto é apresentado com o tipo de letra Inter
    And o código e os valores técnicos usam uma fonte monoespaçada

  Scenario: Idioma e tratamento
    When leio os textos da interface
    Then estão em português de Portugal
    And tratam o utilizador por "tu"

  # ── Modo claro e escuro ────────────────────────────────────────────────

  Scenario: Alternar entre modo claro e escuro
    When escolho o botão "Dark" ou "Light"
    Then a interface muda para o modo escolhido
    And o botão está disponível no front-end público, nas páginas de login e no back-office

  Scenario: Preferência de modo guardada
    Given que escolhi o modo escuro
    When volto a abrir a aplicação no mesmo browser
    Then a interface abre em modo escuro

  Scenario: Modo inicial segue o sistema
    Given que nunca escolhi um modo neste browser
    When abro a aplicação
    Then a interface segue a preferência de modo claro ou escuro do sistema operativo

  Scenario: Logótipo legível em modo escuro
    Given que o logótipo do cliente foi desenhado para fundos claros
    When abro o back-office em modo escuro
    Then o logótipo aparece sobre um fundo claro

  # ── Back-office ────────────────────────────────────────────────────────

  Scenario: Estrutura do back-office
    When abro o back-office
    Then vejo uma barra superior com o logótipo, o botão de modo e o menu do utilizador
    And vejo uma barra lateral com ícones para as áreas do back-office
    And o menu do utilizador dá acesso ao perfil e a "Terminar sessão"

  Scenario: Barra lateral colapsável
    Given um ecrã do tipo "desktop"
    When colapso a barra lateral
    Then ficam visíveis apenas os ícones
    And a escolha é lembrada neste browser

  Scenario: Barra lateral em ecrãs pequenos
    Given um ecrã do tipo "telemóvel"
    When abro o menu
    Then a barra lateral aparece por cima do conteúdo
    And fecha ao escolher uma opção ou ao tocar fora dela

  # ── Responsividade ─────────────────────────────────────────────────────

  Scenario Outline: Páginas responsivas
    Given um ecrã do tipo "<dispositivo>"
    When abro a página "<pagina>"
    Then o conteúdo adapta-se à largura do ecrã
    And não existe scroll horizontal na página
    And todos os controlos são utilizáveis

    Examples:
      | dispositivo | pagina                   |
      | desktop     | front-end público        |
      | tablet      | front-end público        |
      | telemóvel   | front-end público        |
      | desktop     | back-office              |
      | tablet      | back-office              |
      | telemóvel   | back-office              |
      | telemóvel   | login                    |
      | telemóvel   | reset de password        |
      | telemóvel   | verificação em dois passos |
      | telemóvel   | perfil                   |
      | telemóvel   | gestão de utilizadores   |
      | telemóvel   | settings                 |

  Scenario: Tabelas em ecrãs pequenos
    Given um ecrã do tipo "telemóvel"
    When abro uma lista apresentada em tabela no desktop
    Then cada linha é apresentada como um cartão

  # ── Datas ──────────────────────────────────────────────────────────────

  Scenario Outline: Formatação de datas
    Given um registo com a data e hora "2026-10-05T14:30:15"
    When a data é apresentada num contexto que exige "<precisao>"
    Then é apresentada como "<resultado>"

    Examples:
      | precisao              | resultado           |
      | só data               | 2026/10/05          |
      | data e hora           | 2026/10/05 14:30    |
      | data, hora e segundos | 2026/10/05 14:30:15 |

  Scenario: Nenhum outro formato de data é utilizado
    When percorro as páginas da aplicação e os e-mails enviados
    Then nenhuma data aparece em formatos como "05/10/2026" ou "5 out 2026"
