# language: pt
@base @autenticacao
Funcionalidade: Recuperação de password
  Como utilizador que esqueceu a password
  Quero redefini-la através do meu e-mail
  Para recuperar o acesso à plataforma

  Cenário: Pedido de reset de password
    Dado que estou na página de login
    Quando escolho a opção de recuperar password
    E introduzo o e-mail de um utilizador ativo existente
    Então vejo uma mensagem de confirmação genérica
    E é enviado um e-mail em HTML, com o branding do projeto, com um link de reset de password
    E o e-mail indica até quando o link é válido, no formato YYYY/MM/DD hh:mm

  Esquema do Cenário: Pedido com e-mail que não pode recuperar a password
    Dado que estou no formulário de recuperação de password
    Quando introduzo um e-mail "<situacao>"
    Então vejo a mesma mensagem de confirmação genérica
    E nenhum e-mail é enviado

    Exemplos:
      | situacao                       |
      | que não existe na plataforma   |
      | de uma conta inativa           |

  Cenário: Link válido durante uma hora
    Dado que pedi um reset de password
    Então o link recebido é válido durante 1 hora

  Cenário: Definição de nova password
    Dado que recebi um link de reset de password válido
    Quando abro o link
    Então vejo a conta a que o link se refere
    Quando defino e confirmo uma nova password com pelo menos 8 caracteres
    Então a password é atualizada
    E consigo fazer login com a nova password

  Esquema do Cenário: Nova password inválida
    Dado que abri um link de reset de password válido
    Quando defino a nova password "<password>" com a confirmação "<confirmacao>"
    Então vejo a mensagem "<mensagem>"
    E a password não é alterada

    Exemplos:
      | password  | confirmacao | mensagem                                          |
      | curta     | curta       | A password deve ter pelo menos 8 caracteres.      |
      | segura123 | outra12345  | A confirmação não coincide com a nova password.   |

  Cenário: Sessões abertas terminam ao redefinir a password
    Dado que tenho sessões abertas noutros browsers
    Quando redefino a password através do link de reset
    Então essas sessões terminam

  Cenário: Usar um link invalida os restantes
    Dado que pedi dois links de reset de password
    Quando defino uma nova password com um deles
    Então o outro link deixa de ser válido

  Cenário: Link de reset expirado ou já utilizado
    Dado um link de reset de password expirado ou já utilizado
    Quando abro o link
    Então vejo uma mensagem a indicar que o link não é válido
    E é-me sugerido pedir um novo link
