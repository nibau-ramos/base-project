@base @autenticacao @mfa
Feature: Verificação em dois passos (MFA)
  Como utilizador da plataforma
  Quero proteger a minha conta com a impressão digital do computador ou com uma aplicação autenticadora
  Para que a password, sozinha, não chegue para entrar

  # Métodos suportados:
  #   - Aplicação autenticadora (TOTP): código de 6 dígitos (Google Authenticator, Microsoft Authenticator, 1Password…)
  #   - Impressão digital (WebAuthn): sensor do próprio computador (Touch ID, Windows Hello…)
  # Uma conta pode ter um, outro ou ambos. "MFA ativo" = pelo menos um método configurado.

  # ── Configuração no perfil ─────────────────────────────────────────────

  Scenario: Ativar a aplicação autenticadora
    Given que estou autenticado como "joao@exemplo.pt" e na página do meu perfil
    When escolho ativar a aplicação autenticadora
    Then é apresentado um código QR e a respetiva chave manual
    And a aplicação só fica ativa depois de eu introduzir um código válido

  Scenario: Código inválido ao ativar a aplicação
    Given que estou a ativar a aplicação autenticadora
    When introduzo um código inválido
    Then vejo a mensagem "Código inválido."
    And a aplicação continua inativa

  Scenario: Registar a impressão digital deste computador
    Given que estou autenticado como "joao@exemplo.pt" e na página do meu perfil
    And que o browser suporta impressão digital
    When dou um nome ao computador e escolho "Registar este computador"
    And confirmo com a impressão digital no sistema operativo
    Then o computador aparece na lista com o nome e a data de registo no formato YYYY/MM/DD
    And posso passar a entrar com a impressão digital

  Scenario: Vários computadores registados
    Given que registei a impressão digital em dois computadores
    Then a lista mostra os dois, com a data de registo e a data do último uso
    And as passkeys sincronizadas entre dispositivos aparecem identificadas como "sincronizada"

  Scenario: Registar duas vezes o mesmo computador
    Given que este computador já está registado
    When tento registá-lo novamente
    Then vejo uma mensagem a indicar que este computador já está registado

  Scenario: Remover um computador registado
    Given que tenho mais do que um método de verificação ativo
    When removo um computador da lista e confirmo
    Then deixo de poder entrar com a impressão digital desse computador

  Scenario: Desativar a aplicação autenticadora
    Given que tenho a aplicação autenticadora ativa e o MFA não é obrigatório na minha conta
    When desativo a aplicação confirmando a minha password
    Then a aplicação fica inativa

  Scenario: Browser sem suporte para impressão digital
    Given que o meu browser não suporta impressão digital
    When abro o meu perfil
    Then vejo um aviso de que o browser não suporta impressão digital
    And continuo a poder ativar a aplicação autenticadora

  # ── Login com segundo fator ────────────────────────────────────────────

  Scenario Outline: Métodos oferecidos no segundo passo do login
    Given que a minha conta tem "<metodos>"
    When introduzo e-mail e password corretos
    Then o segundo passo oferece "<opcoes>"

    Examples:
      | metodos                                       | opcoes                                                   |
      | apenas a aplicação autenticadora              | o campo para o código                                    |
      | apenas a impressão digital                    | o botão "Usar impressão digital"                         |
      | a aplicação autenticadora e a impressão digital | o botão "Usar impressão digital" ou o campo para o código |

  Scenario: Entrar com a impressão digital
    Given que estou no segundo passo do login
    When escolho "Usar impressão digital" e confirmo no sistema operativo
    Then fico autenticado
    And a data de último uso desse computador é atualizada

  Scenario: Entrar com o código da aplicação
    Given que estou no segundo passo do login
    When introduzo um código válido da aplicação autenticadora
    Then fico autenticado

  Scenario: Código inválido no login
    Given que estou no segundo passo do login
    When introduzo um código inválido
    Then vejo a mensagem "Código inválido."
    And não fico autenticado

  Scenario: Impressão digital cancelada
    Given que estou no segundo passo do login
    When cancelo o pedido de impressão digital no sistema operativo
    Then vejo uma mensagem a indicar que a operação foi cancelada
    And posso tentar novamente ou usar o código

  Scenario: O segundo passo expira
    Given que introduzi e-mail e password corretos há mais de 5 minutos
    When tento concluir o segundo passo
    Then vejo uma mensagem a pedir para voltar a introduzir o e-mail e a password

  Scenario: Não é possível saltar a password
    Given que não introduzi a password
    When tento usar diretamente a impressão digital ou o código
    Then o pedido é recusado

  # ── MFA obrigatório ────────────────────────────────────────────────────

  Scenario: Administrador torna o MFA obrigatório
    Given que sou administrador e estou a editar a conta de "maria@exemplo.pt"
    When ativo "Exigir verificação em dois passos" e guardo
    Then a conta passa a exigir pelo menos um método de verificação

  Scenario: Primeiro login com MFA obrigatório e sem métodos configurados
    Given que a conta "maria@exemplo.pt" exige MFA e não tem nenhum método configurado
    When introduzo e-mail e password corretos
    Then não fico autenticado
    And tenho de escolher entre "Impressão digital neste computador" e "Aplicação autenticadora"
    And só fico autenticada depois de configurar o método escolhido

  Scenario Outline: Configuração obrigatória com cada método
    Given que estou na configuração obrigatória do segundo fator
    When escolho "<metodo>" e concluo a configuração
    Then fico autenticada
    And a minha conta passa a ter esse método ativo

    Examples:
      | metodo                            |
      | Impressão digital neste computador |
      | Aplicação autenticadora           |

  Scenario: Sessões abertas terminam ao tornar o MFA obrigatório
    Given que "maria@exemplo.pt" tem uma sessão aberta e nenhum método configurado
    When um administrador torna o MFA obrigatório na sua conta
    Then a sessão de "maria@exemplo.pt" termina
    And no próximo login tem de configurar um método

  Scenario Outline: Não é possível ficar sem o último método
    Given que a minha conta exige MFA
    And que o único método ativo é "<metodo>"
    When tento remover esse método
    Then a remoção é recusada
    And vejo a indicação de que tenho de configurar outro método antes de remover este

    Examples:
      | metodo                   |
      | a aplicação autenticadora |
      | a impressão digital      |

  Scenario: Com dois métodos posso remover um
    Given que a minha conta exige MFA
    And que tenho a impressão digital e a aplicação autenticadora ativas
    When removo um deles
    Then a remoção é aceite
    And o outro passa a ser o último método, que não pode ser removido

  Scenario: Perfil indica que o MFA é obrigatório
    Given que a minha conta exige MFA
    When abro o meu perfil
    Then vejo que a verificação em dois passos é obrigatória nesta conta

  Scenario: Administrador não altera a obrigatoriedade na própria conta
    Given que sou administrador
    When tento alterar "Exigir verificação em dois passos" na minha própria conta
    Then a alteração é recusada
    And sou orientado a gerir a minha verificação no meu perfil

  # ── Reposição pelo administrador ───────────────────────────────────────

  Scenario: Repor o MFA de quem perdeu o telemóvel ou o computador
    Given que "maria@exemplo.pt" tem métodos de verificação configurados
    When um administrador escolhe "Repor MFA" na conta e confirma
    Then a aplicação autenticadora e todas as impressões digitais da conta são removidas
    And as sessões abertas de "maria@exemplo.pt" terminam
    And "maria@exemplo.pt" recebe um e-mail a avisar da reposição

  Scenario Outline: Login depois da reposição
    Given que o MFA de "maria@exemplo.pt" foi reposto
    And que a conta "<obrigatoriedade>" exige MFA
    When "maria@exemplo.pt" faz login com e-mail e password
    Then "<resultado>"

    Examples:
      | obrigatoriedade | resultado                                         |
      | sim             | tem de configurar um método antes de entrar       |
      | não             | entra apenas com a password                       |

  # ── Requisitos técnicos ────────────────────────────────────────────────

  Scenario: Impressões digitais ligadas ao domínio
    Given que a plataforma está publicada num domínio
    Then as impressões digitais registadas só são válidas nesse domínio
    And em produção o site é servido em HTTPS
    # Mudar de domínio obriga a registar novamente as impressões digitais
