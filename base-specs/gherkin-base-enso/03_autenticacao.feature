# language: pt
@base @autenticacao
Funcionalidade: Autenticação de utilizadores
  Como utilizador da plataforma
  Quero autenticar-me de forma segura com e-mail, password e um segundo fator
  Para aceder ao back-office
  # O segundo fator (aplicação autenticadora ou impressão digital) está detalhado em 11_mfa.feature

  Contexto:
    Dado que existe um utilizador ativo com e-mail "joao@exemplo.pt" e password válida
    E que estou na página de login

  Cenário: Formulário de login pede e-mail e não username
    Então o formulário de login tem um campo de e-mail
    E tem um campo de password com opção para mostrar ou esconder o texto
    E não existe nenhum campo de username

  Cenário: Login com e-mail e password válidos, sem segundo fator
    Dado que o utilizador "joao@exemplo.pt" não tem segundo fator configurado nem obrigatório
    Quando introduzo o e-mail "joao@exemplo.pt" e a password correta
    E submeto o formulário
    Então fico autenticado
    E sou encaminhado para o back-office

  Cenário: O e-mail não distingue maiúsculas de minúsculas
    Quando introduzo o e-mail "Joao@Exemplo.PT" e a password correta
    E submeto o formulário
    Então o login é aceite como sendo de "joao@exemplo.pt"

  Esquema do Cenário: Login com credenciais inválidas
    Quando introduzo o e-mail "<email>" e a password "<password>"
    E submeto o formulário
    Então vejo a mensagem genérica "E-mail ou password inválidos."
    E não fico autenticado

    Exemplos:
      | email                 | password      |
      | joao@exemplo.pt       | errada        |
      | naoexiste@exemplo.pt  | qualquer      |

  Cenário: Conta inativa não consegue entrar
    Dado que a conta "joao@exemplo.pt" foi desativada por um administrador
    Quando introduzo o e-mail e a password corretos
    Então vejo a mensagem genérica de credenciais inválidas
    E não fico autenticado

  Cenário: Segundo passo quando a conta tem segundo fator
    Dado que o utilizador "joao@exemplo.pt" tem um segundo fator configurado
    Quando introduzo e-mail e password corretos
    Então ainda não fico autenticado
    E é-me pedido o segundo fator antes de entrar

  Cenário: Limite de tentativas
    Dado que foram feitas 20 tentativas de login a partir do mesmo endereço nos últimos 15 minutos
    Quando tento fazer login novamente
    Então o pedido é recusado temporariamente

  Cenário: Logout
    Dado que estou autenticado
    Quando escolho "Terminar sessão" no menu do utilizador
    Então volto à página de login
    E não consigo aceder a "/admin" sem nova autenticação

  Cenário: Sessão invalidada por alteração da password
    Dado que estou autenticado em dois browsers
    Quando altero a minha password num deles
    Então a sessão do outro browser termina
    E a sessão do browser onde alterei a password continua ativa

  Cenário: Utilizador já autenticado abre a página de login
    Dado que estou autenticado
    Quando abro a página de login
    Então sou encaminhado para o back-office
