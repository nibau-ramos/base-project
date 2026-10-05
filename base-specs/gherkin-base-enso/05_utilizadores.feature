@base @utilizadores
Feature: Gestão de utilizadores no back-office
  Como administrador
  Quero gerir os utilizadores e os seus perfis
  Para controlar quem acede à plataforma

  Background:
    Given que estou autenticado como administrador
    And que estou na gestão de utilizadores

  # ── Criação ────────────────────────────────────────────────────────────

  Scenario: Criar utilizador com e-mail e perfil
    When crio um utilizador com o e-mail "ana@exemplo.pt" e o perfil "normal"
    Then o utilizador fica registado com esse perfil
    And o e-mail é o identificador de login do utilizador
    And o e-mail fica guardado em minúsculas

  Scenario: Password inicial opcional
    When crio um utilizador sem password inicial
    Then a conta é criada
    And a pessoa só consegue entrar depois de definir a password pelo link do e-mail de boas-vindas ou pela recuperação de password

  Scenario: E-mail duplicado
    Given que já existe um utilizador com o e-mail "ana@exemplo.pt"
    When tento criar outro utilizador com o e-mail "ana@exemplo.pt"
    Then vejo a mensagem "Já existe um utilizador com este e-mail."

  Scenario: Exigir verificação em dois passos na criação
    When crio um utilizador com "Exigir verificação em dois passos" ativo
    Then no primeiro login a pessoa é obrigada a configurar a impressão digital ou a aplicação autenticadora
    # Detalhe em 11_mfa.feature

  # ── Perfis e permissões ────────────────────────────────────────────────

  Scenario Outline: Perfis disponíveis
    When crio um utilizador
    Then posso atribuir o perfil "<perfil>"

    Examples:
      | perfil        |
      | administrador |
      | normal        |

  Scenario: Perfil de super administrador
    Given que estou autenticado como super administrador
    When crio ou edito um utilizador
    Then posso atribuir o perfil "super administrador"

  Scenario Outline: Quem gere quem
    Given que estou autenticado como "<eu>"
    Then "<pode>" gerir contas com o perfil "<perfil>"

    Examples:
      | eu                  | perfil              | pode     |
      | super administrador | super administrador | posso    |
      | super administrador | administrador       | posso    |
      | super administrador | normal              | posso    |
      | administrador       | super administrador | não posso |
      | administrador       | administrador       | posso    |
      | administrador       | normal              | posso    |

  Scenario: Proteções sobre a própria conta
    When edito a minha própria conta
    Then não posso alterar o meu perfil
    And não posso desativar a minha conta
    And não posso alterar a obrigatoriedade da verificação em dois passos
    And não tenho a opção de eliminar a minha conta

  # ── Edição ─────────────────────────────────────────────────────────────

  Scenario: Editar um utilizador
    When abro um utilizador para edição
    Then posso alterar o nome, o perfil, o estado ativo e a obrigatoriedade da verificação em dois passos
    And o e-mail é apresentado mas não pode ser alterado
    And vejo a data de criação e a data do último acesso no formato YYYY/MM/DD

  Scenario: Desativar uma conta
    When desativo a conta de "ana@exemplo.pt" e guardo
    Then "ana@exemplo.pt" deixa de conseguir entrar
    And deixa de conseguir recuperar a password
    And as suas sessões abertas deixam de ser válidas

  Scenario: Eliminar um utilizador
    When escolho eliminar "ana@exemplo.pt"
    Then é-me pedida confirmação, a indicar que a ação é permanente
    When confirmo
    Then o utilizador é removido

  Scenario: Repor a verificação em dois passos
    Given que "ana@exemplo.pt" tem verificação em dois passos configurada
    When escolho "Repor MFA" e confirmo
    Then a aplicação autenticadora e as impressões digitais da conta são removidas
    # Detalhe em 11_mfa.feature

  # ── E-mail de boas-vindas ──────────────────────────────────────────────

  Scenario: Enviar e-mail de boas-vindas sem reset de password
    Given que existe o utilizador "maria"
    When envio o e-mail de boas-vindas a "maria"
    And escolho não incluir o reset de password
    Then "maria" recebe um e-mail em HTML, com o branding do projeto, a indicar que pertence à plataforma
    And o e-mail não contém link de reset de password
    And o e-mail contém um link para a página de login

  Scenario: Enviar e-mail de boas-vindas com reset de password
    Given que existe o utilizador "maria"
    When envio o e-mail de boas-vindas a "maria"
    And escolho incluir o reset de password
    Then "maria" recebe um e-mail em HTML, com o branding do projeto, a indicar que pertence à plataforma
    And o e-mail contém um link válido de reset de password
    And o link é válido durante 72 horas e só pode ser usado uma vez

  Scenario: Envio de boas-vindas sem configuração de e-mail
    Given que as configurações de envio de e-mail não estão preenchidas
    When tento enviar o e-mail de boas-vindas
    Then vejo uma mensagem a indicar que é necessário configurar o envio de e-mail
    And tenho um link para as settings de e-mail

  # ── Lista ──────────────────────────────────────────────────────────────

  Scenario: Lista de utilizadores
    Then vejo, para cada utilizador, o nome, o e-mail, o perfil, o estado, a verificação em dois passos e o último acesso
    And as datas são apresentadas no formato YYYY/MM/DD hh:mm
    And vejo contadores de utilizadores ativos, inativos e com verificação em dois passos

  Scenario: Pesquisar, filtrar e ordenar
    When pesquiso por parte do nome ou do e-mail
    Then só vejo os utilizadores correspondentes
    And posso filtrar por perfil e por estado
    And posso ordenar por utilizador, perfil e último acesso

  Scenario Outline: Indicação da verificação em dois passos na lista
    Given um utilizador em que a verificação em dois passos está "<situacao>"
    Then a lista mostra "<indicacao>"

    Examples:
      | situacao                         | indicacao          |
      | ativa e não obrigatória          | MFA                |
      | ativa e obrigatória              | MFA obrigatório    |
      | obrigatória mas por configurar   | MFA por configurar |
      | inativa e não obrigatória        | nenhuma indicação  |

  Scenario: Lista em ecrãs pequenos
    Given um ecrã do tipo "telemóvel"
    When abro a gestão de utilizadores
    Then cada utilizador é apresentado como um cartão, sem tabela com scroll horizontal
