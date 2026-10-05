@base @utilizadores @perfil
Feature: Perfil do utilizador
  Como utilizador autenticado
  Quero gerir a minha password e a verificação em dois passos no meu perfil
  Para manter a minha conta segura sem depender de um administrador

  Background:
    Given que estou autenticado
    And que estou na página do meu perfil

  Scenario: Informação da conta
    Then vejo o meu nome, o meu e-mail e o meu perfil

  Scenario Outline: Alterar password disponível para todos os perfis
    Given que o meu perfil é "<perfil>"
    Then tenho a opção de alterar a minha password

    Examples:
      | perfil              |
      | super administrador |
      | administrador       |
      | normal              |

  Scenario: Alterar password com sucesso
    When introduzo a password atual correta
    And introduzo e confirmo uma nova password com pelo menos 8 caracteres
    And guardo a alteração
    Then a password é atualizada
    And consigo fazer login com a nova password
    And continuo autenticado neste browser
    And as minhas sessões noutros browsers terminam
    And recebo um e-mail de aviso a indicar que a password foi alterada, com a data no formato YYYY/MM/DD hh:mm

  Scenario: Password atual incorreta
    When introduzo uma password atual incorreta
    And introduzo e confirmo uma nova password válida
    And guardo a alteração
    Then vejo uma mensagem de erro
    And a password não é alterada

  Scenario: Confirmação da nova password não coincide
    When introduzo a password atual correta
    And a confirmação da nova password é diferente da nova password
    Then vejo uma mensagem de erro
    And a password não é alterada

  Scenario: Nova password demasiado curta
    When introduzo a password atual correta
    And introduzo e confirmo uma nova password com menos de 8 caracteres
    Then vejo a mensagem "A password deve ter pelo menos 8 caracteres."
    And a password não é alterada

  Scenario: Gerir a verificação em dois passos
    Then vejo o estado da verificação em dois passos e se é obrigatória na minha conta
    And posso registar a impressão digital deste computador e remover computadores registados
    And posso ativar ou desativar a aplicação autenticadora
    # Regras e detalhe em 11_mfa.feature
