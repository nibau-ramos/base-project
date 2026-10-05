# language: pt
@base @ui
Funcionalidade: Interface, tipografia e formatação
  Como utilizador
  Quero uma interface consistente e utilizável em qualquer dispositivo
  Para trabalhar a partir do computador, tablet ou telemóvel

  # ── Identidade visual ──────────────────────────────────────────────────

  Cenário: Identidade visual do style guide ENSO
    Quando abro qualquer página da aplicação
    Então os componentes seguem o style guide ENSO (botões, campos, alertas, badges, cartões, tabs e modais)
    E as cores vêm do esquema de 4 cores definido no branding
    # O style guide é a referência visual comum a todos os projetos; cada projeto varia cores e logótipo

  Cenário: Tipo de letra Inter
    Quando abro qualquer página da aplicação
    Então o texto é apresentado com o tipo de letra Inter
    E o código e os valores técnicos usam uma fonte monoespaçada

  Cenário: Idioma e tratamento
    Quando leio os textos da interface
    Então estão em português de Portugal
    E tratam o utilizador por "tu"

  # ── Modo claro e escuro ────────────────────────────────────────────────

  Cenário: Alternar entre modo claro e escuro
    Quando escolho o botão "Dark" ou "Light"
    Então a interface muda para o modo escolhido
    E o botão está disponível no front-end público, nas páginas de login e no back-office

  Cenário: Preferência de modo guardada
    Dado que escolhi o modo escuro
    Quando volto a abrir a aplicação no mesmo browser
    Então a interface abre em modo escuro

  Cenário: Modo inicial segue o sistema
    Dado que nunca escolhi um modo neste browser
    Quando abro a aplicação
    Então a interface segue a preferência de modo claro ou escuro do sistema operativo

  Cenário: Logótipo legível em modo escuro
    Dado que o logótipo do cliente foi desenhado para fundos claros
    Quando abro o back-office em modo escuro
    Então o logótipo aparece sobre um fundo claro

  # ── Back-office ────────────────────────────────────────────────────────

  Cenário: Estrutura do back-office
    Quando abro o back-office
    Então vejo uma barra superior com o logótipo, o botão de modo e o menu do utilizador
    E vejo uma barra lateral com ícones para as áreas do back-office
    E o menu do utilizador dá acesso ao perfil e a "Terminar sessão"

  Cenário: Barra lateral colapsável
    Dado um ecrã do tipo "desktop"
    Quando colapso a barra lateral
    Então ficam visíveis apenas os ícones
    E a escolha é lembrada neste browser

  Cenário: Barra lateral em ecrãs pequenos
    Dado um ecrã do tipo "telemóvel"
    Quando abro o menu
    Então a barra lateral aparece por cima do conteúdo
    E fecha ao escolher uma opção ou ao tocar fora dela

  # ── Responsividade ─────────────────────────────────────────────────────

  Esquema do Cenário: Páginas responsivas
    Dado um ecrã do tipo "<dispositivo>"
    Quando abro a página "<pagina>"
    Então o conteúdo adapta-se à largura do ecrã
    E não existe scroll horizontal na página
    E todos os controlos são utilizáveis

    Exemplos:
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

  Cenário: Tabelas em ecrãs pequenos
    Dado um ecrã do tipo "telemóvel"
    Quando abro uma lista apresentada em tabela no desktop
    Então cada linha é apresentada como um cartão

  # ── Datas ──────────────────────────────────────────────────────────────

  Esquema do Cenário: Formatação de datas
    Dado um registo com a data e hora "2026-10-05T14:30:15"
    Quando a data é apresentada num contexto que exige "<precisao>"
    Então é apresentada como "<resultado>"

    Exemplos:
      | precisao              | resultado           |
      | só data               | 2026/10/05          |
      | data e hora           | 2026/10/05 14:30    |
      | data, hora e segundos | 2026/10/05 14:30:15 |

  Cenário: Nenhum outro formato de data é utilizado
    Quando percorro as páginas da aplicação e os e-mails enviados
    Então nenhuma data aparece em formatos como "05/10/2026" ou "5 out 2026"
