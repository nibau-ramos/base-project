@base @autenticacao
Feature: Autenticação de utilizadores
  Como utilizador da plataforma
  Quero autenticar-me de forma segura com e-mail, password e um segundo fator
  Para aceder ao back-office
  # O segundo fator (aplicação autenticadora ou impressão digital) está detalhado em 11_mfa.feature

  Background:
    Given que existe um utilizador ativo com e-mail "joao@exemplo.pt" e password válida
    And que estou na página de login

  Scenario: Formulário de login pede e-mail e não username
    Then o formulário de login tem um campo de e-mail
    And tem um campo de password com opção para mostrar ou esconder o texto
    And não existe nenhum campo de username

  Scenario: Login com e-mail e password válidos, sem segundo fator
    Given que o utilizador "joao@exemplo.pt" não tem segundo fator configurado nem obrigatório
    When introduzo o e-mail "joao@exemplo.pt" e a password correta
    And submeto o formulário
    Then fico autenticado
    And sou encaminhado para o back-office

  Scenario: O e-mail não distingue maiúsculas de minúsculas
    When introduzo o e-mail "Joao@Exemplo.PT" e a password correta
    And submeto o formulário
    Then o login é aceite como sendo de "joao@exemplo.pt"

  Scenario Outline: Login com credenciais inválidas
    When introduzo o e-mail "<email>" e a password "<password>"
    And submeto o formulário
    Then vejo a mensagem genérica "E-mail ou password inválidos."
    And não fico autenticado

    Examples:
      | email                 | password      |
      | joao@exemplo.pt       | errada        |
      | naoexiste@exemplo.pt  | qualquer      |

  Scenario: Conta inativa não consegue entrar
    Given que a conta "joao@exemplo.pt" foi desativada por um administrador
    When introduzo o e-mail e a password corretos
    Then vejo a mensagem genérica de credenciais inválidas
    And não fico autenticado

  Scenario: Segundo passo quando a conta tem segundo fator
    Given que o utilizador "joao@exemplo.pt" tem um segundo fator configurado
    When introduzo e-mail e password corretos
    Then ainda não fico autenticado
    And é-me pedido o segundo fator antes de entrar

  Scenario: Limite de tentativas
    Given que foram feitas 20 tentativas de login a partir do mesmo endereço nos últimos 15 minutos
    When tento fazer login novamente
    Then o pedido é recusado temporariamente

  Scenario: Logout
    Given que estou autenticado
    When escolho "Terminar sessão" no menu do utilizador
    Then volto à página de login
    And não consigo aceder a "/admin" sem nova autenticação

  Scenario: Sessão invalidada por alteração da password
    Given que estou autenticado em dois browsers
    When altero a minha password num deles
    Then a sessão do outro browser termina
    And a sessão do browser onde alterei a password continua ativa

  Scenario: Utilizador já autenticado abre a página de login
    Given que estou autenticado
    When abro a página de login
    Then sou encaminhado para o back-office
