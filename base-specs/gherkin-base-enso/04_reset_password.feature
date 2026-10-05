# language: pt
@base @autenticacao
Funcionalidade: Recuperação de password
  Como utilizador que esqueceu a password
  Quero redefini-la através do meu e-mail
  Para recuperar o acesso à plataforma

  Cenário: Pedido de reset de password
    Dado que estou na página de login
    Quando escolho a opção de recuperar password
    E introduzo o e-mail de um utilizador existente
    Então é enviado um e-mail em HTML, com o branding do projeto, com um link de reset de password

  Cenário: Pedido com e-mail inexistente
    Dado que estou no formulário de recuperação de password
    Quando introduzo um e-mail que não existe na plataforma
    Então vejo a mesma mensagem de confirmação genérica
    E nenhum e-mail é enviado

  Cenário: Definição de nova password
    Dado que recebi um link de reset de password válido
    Quando abro o link
    E defino uma nova password válida
    Então a password é atualizada
    E consigo fazer login com a nova password

  Cenário: Link de reset expirado ou já utilizado
    Dado um link de reset de password expirado ou já utilizado
    Quando abro o link
    Então vejo uma mensagem a indicar que o link não é válido
    E é-me sugerido pedir um novo link
