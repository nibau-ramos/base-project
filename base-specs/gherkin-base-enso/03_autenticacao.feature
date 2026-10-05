# language: pt
@base @autenticacao
Funcionalidade: Autenticação de utilizadores
  Como utilizador da plataforma
  Quero autenticar-me de forma segura por vários métodos
  Para aceder ao back-office

  Contexto:
    Dado que existe um utilizador ativo com e-mail "joao@exemplo.pt" e password válida
    E que estou na página de login

  Cenário: Login com e-mail e password válidos
    Quando introduzo o e-mail "joao@exemplo.pt" e a password correta
    E submeto o formulário
    Então fico autenticado
    E sou encaminhado para o back-office

  Cenário: Login com credenciais inválidas
    Quando introduzo o e-mail "joao@exemplo.pt" e uma password errada
    E submeto o formulário
    Então vejo uma mensagem de erro genérica
    E não fico autenticado

  Cenário: Login com OTP
    Dado que o utilizador "joao@exemplo.pt" tem OTP configurado
    Quando introduzo e-mail e password corretos
    Então é-me pedido o código OTP
    Quando introduzo um código OTP válido
    Então fico autenticado

  Cenário: Código OTP inválido
    Dado que o utilizador "joao@exemplo.pt" tem OTP configurado
    E que já introduzi e-mail e password corretos
    Quando introduzo um código OTP inválido
    Então vejo uma mensagem de erro
    E não fico autenticado

  Cenário: Configuração de OTP pelo utilizador
    Dado que estou autenticado como "joao@exemplo.pt"
    Quando ativo o OTP no meu perfil
    Então é apresentado um código QR para a aplicação autenticadora
    E o OTP só fica ativo após confirmar um código válido

  @opcional
  Cenário: Login com impressão digital
    Dado que o utilizador "joao@exemplo.pt" registou a impressão digital no computador
    Quando escolho autenticar com impressão digital
    E valido a impressão digital no dispositivo
    Então fico autenticado

  Cenário: Formulário de login pede e-mail e não username
    Então o formulário de login tem um campo de e-mail
    E não existe nenhum campo de username

  Cenário: Logout
    Dado que estou autenticado
    Quando termino a sessão
    Então volto à página de login
    E não consigo aceder a "/admin" sem nova autenticação
