@base @settings
Feature: Configuração de envio de e-mail
  Como administrador
  Quero configurar o servidor de envio de e-mail nas settings
  Para que a plataforma consiga enviar notificações

  Background:
    Given que estou autenticado como administrador
    And que estou nas settings, na secção de e-mail

  Scenario: Campos disponíveis na configuração de e-mail
    Then posso configurar o host
    And posso configurar a porta
    And posso configurar o protocolo, por omissão SMTP
    And posso indicar se usa SSL
    And posso indicar se deve ignorar certificados
    And posso configurar o utilizador e a password de autenticação
    And posso configurar o e-mail do remetente

  Scenario: Guardar configuração válida
    When preencho o host, a porta e o e-mail do remetente
    And guardo a configuração
    Then a configuração fica guardada
    And a password não é apresentada em claro

  Scenario Outline: Configuração inválida
    When guardo a configuração com "<problema>"
    Then vejo a mensagem "<mensagem>"
    And a configuração anterior mantém-se

    Examples:
      | problema                          | mensagem                                  |
      | o host vazio                      | Indique o host.                           |
      | a porta 70000                     | Indique uma porta válida.                 |
      | o e-mail do remetente inválido    | Indique um e-mail de remetente válido.    |

  Scenario: A password guardada nunca sai do servidor
    Given que existe uma password de autenticação guardada
    When abro a secção de e-mail
    Then o campo da password aparece vazio, com a indicação de que existe uma password guardada
    And a password nunca é devolvida pelo back-end

  Scenario: Manter a password guardada
    Given que existe uma password de autenticação guardada
    When altero outro campo, deixo a password vazia e guardo
    Then a password guardada mantém-se

  Scenario: Remover a password guardada
    Given que existe uma password de autenticação guardada
    When escolho remover a password guardada e guardo
    Then deixa de existir password de autenticação

  Scenario: Envio de e-mail de teste
    Given uma configuração de e-mail guardada
    When indico um destinatário e peço o envio de um e-mail de teste
    Then recebo uma indicação de sucesso ou o erro devolvido pelo servidor
    And o destinatário sugerido é o meu próprio e-mail
