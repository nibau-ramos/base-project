# language: pt
@base @acesso
Funcionalidade: Zonas da aplicação e controlo de acesso
  Como responsável pelo produto
  Quero separar a zona pública do back-office
  Para que só utilizadores autenticados acedam à gestão da plataforma

  Cenário: Visitante acede ao front-end público
    Dado que não estou autenticado
    Quando acedo à página inicial
    Então vejo o front-end público
    E não me é pedida autenticação
    E tenho um link para entrar no back-office

  Cenário: Visitante tenta aceder ao back-office
    Dado que não estou autenticado
    Quando acedo a "/admin"
    Então sou redirecionado para a página de login

  Cenário: Regresso à página pedida depois do login
    Dado que não estou autenticado
    E que tentei abrir "/admin/users"
    Quando faço login com sucesso
    Então sou encaminhado para "/admin/users"

  Cenário: Utilizador autenticado acede ao back-office
    Dado que estou autenticado
    Quando acedo a "/admin"
    Então vejo o back-office

  Esquema do Cenário: Acesso às áreas de administração por perfil
    Dado que estou autenticado com o perfil "<perfil>"
    Quando acedo à zona de "<zona>"
    Então o acesso é "<resultado>"

    Exemplos:
      | perfil              | zona         | resultado |
      | super administrador | settings     | permitido |
      | administrador       | settings     | permitido |
      | normal              | settings     | negado    |
      | super administrador | utilizadores | permitido |
      | administrador       | utilizadores | permitido |
      | normal              | utilizadores | negado    |

  Cenário: Acesso negado a um perfil normal
    Dado que estou autenticado com o perfil "normal"
    Quando abro diretamente o endereço das settings
    Então vejo uma mensagem de acesso negado
    E o back-end também recusa os pedidos dessa área

  Cenário: Menu do back-office adaptado ao perfil
    Dado que estou autenticado com o perfil "normal"
    Quando abro o back-office
    Então o menu mostra "Painel" e "O meu perfil"
    E o menu não mostra "Utilizadores" nem "Settings"

  Cenário: Página inexistente
    Quando acedo a um endereço que não existe
    Então vejo uma página a indicar que a página não foi encontrada
    E tenho um link para voltar ao início
