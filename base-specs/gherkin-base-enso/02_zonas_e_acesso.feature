@base @acesso
Feature: Zonas da aplicação e controlo de acesso
  Como responsável pelo produto
  Quero separar a zona pública do back-office
  Para que só utilizadores autenticados acedam à gestão da plataforma

  Scenario: Visitante acede ao front-end público
    Given que não estou autenticado
    When acedo à página inicial
    Then vejo o front-end público
    And não me é pedida autenticação
    And tenho um link para entrar no back-office

  Scenario: Visitante tenta aceder ao back-office
    Given que não estou autenticado
    When acedo a "/admin"
    Then sou redirecionado para a página de login

  Scenario: Regresso à página pedida depois do login
    Given que não estou autenticado
    And que tentei abrir "/admin/users"
    When faço login com sucesso
    Then sou encaminhado para "/admin/users"

  Scenario: Utilizador autenticado acede ao back-office
    Given que estou autenticado
    When acedo a "/admin"
    Then vejo o back-office

  Scenario Outline: Acesso às áreas de administração por perfil
    Given que estou autenticado com o perfil "<perfil>"
    When acedo à zona de "<zona>"
    Then o acesso é "<resultado>"

    Examples:
      | perfil              | zona         | resultado |
      | super administrador | settings     | permitido |
      | administrador       | settings     | permitido |
      | normal              | settings     | negado    |
      | super administrador | utilizadores | permitido |
      | administrador       | utilizadores | permitido |
      | normal              | utilizadores | negado    |

  Scenario: Acesso negado a um perfil normal
    Given que estou autenticado com o perfil "normal"
    When abro diretamente o endereço das settings
    Then vejo uma mensagem de acesso negado
    And o back-end também recusa os pedidos dessa área

  Scenario: Menu do back-office adaptado ao perfil
    Given que estou autenticado com o perfil "normal"
    When abro o back-office
    Then o menu mostra "Painel" e "O meu perfil"
    And o menu não mostra "Utilizadores" nem "Settings"

  Scenario: Página inexistente
    When acedo a um endereço que não existe
    Then vejo uma página a indicar que a página não foi encontrada
    And tenho um link para voltar ao início
