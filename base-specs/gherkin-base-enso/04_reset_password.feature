@base @autenticacao
Feature: Recuperação de password
  Como utilizador que esqueceu a password
  Quero redefini-la através do meu e-mail
  Para recuperar o acesso à plataforma

  Scenario: Pedido de reset de password
    Given que estou na página de login
    When escolho a opção de recuperar password
    And introduzo o e-mail de um utilizador ativo existente
    Then vejo uma mensagem de confirmação genérica
    And é enviado um e-mail em HTML, com o branding do projeto, com um link de reset de password
    And o e-mail indica até quando o link é válido, no formato YYYY/MM/DD hh:mm

  Scenario Outline: Pedido com e-mail que não pode recuperar a password
    Given que estou no formulário de recuperação de password
    When introduzo um e-mail "<situacao>"
    Then vejo a mesma mensagem de confirmação genérica
    And nenhum e-mail é enviado

    Examples:
      | situacao                       |
      | que não existe na plataforma   |
      | de uma conta inativa           |

  Scenario: Link válido durante uma hora
    Given que pedi um reset de password
    Then o link recebido é válido durante 1 hora

  Scenario: Definição de nova password
    Given que recebi um link de reset de password válido
    When abro o link
    Then vejo a conta a que o link se refere
    When defino e confirmo uma nova password com pelo menos 8 caracteres
    Then a password é atualizada
    And consigo fazer login com a nova password

  Scenario Outline: Nova password inválida
    Given que abri um link de reset de password válido
    When defino a nova password "<password>" com a confirmação "<confirmacao>"
    Then vejo a mensagem "<mensagem>"
    And a password não é alterada

    Examples:
      | password  | confirmacao | mensagem                                          |
      | curta     | curta       | A password deve ter pelo menos 8 caracteres.      |
      | segura123 | outra12345  | A confirmação não coincide com a nova password.   |

  Scenario: Sessões abertas terminam ao redefinir a password
    Given que tenho sessões abertas noutros browsers
    When redefino a password através do link de reset
    Then essas sessões terminam

  Scenario: Usar um link invalida os restantes
    Given que pedi dois links de reset de password
    When defino uma nova password com um deles
    Then o outro link deixa de ser válido

  Scenario: Link de reset expirado ou já utilizado
    Given um link de reset de password expirado ou já utilizado
    When abro o link
    Then vejo uma mensagem a indicar que o link não é válido
    And é-me sugerido pedir um novo link
