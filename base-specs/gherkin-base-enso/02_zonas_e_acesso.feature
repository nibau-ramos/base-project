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

  Cenário: Visitante tenta aceder ao back-office
    Dado que não estou autenticado
    Quando acedo a "/admin"
    Então sou redirecionado para a página de login

  Cenário: Utilizador autenticado acede ao back-office
    Dado que estou autenticado
    Quando acedo a "/admin"
    Então vejo o back-office

  Esquema do Cenário: Acesso às settings por perfil
    Dado que estou autenticado com o perfil "<perfil>"
    Quando acedo à zona de settings
    Então o acesso é "<resultado>"

    Exemplos:
      | perfil              | resultado |
      | super administrador | permitido |
      | administrador       | permitido |
      | normal              | negado    |
