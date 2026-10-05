# language: pt
@base @utilizadores
Funcionalidade: Gestão de utilizadores no back-office
  Como administrador
  Quero gerir os utilizadores e os seus perfis
  Para controlar quem acede à plataforma

  Contexto:
    Dado que estou autenticado como administrador
    E que estou na gestão de utilizadores

  # ── Criação ────────────────────────────────────────────────────────────

  Cenário: Criar utilizador com e-mail e perfil
    Quando crio um utilizador com o e-mail "ana@exemplo.pt" e o perfil "normal"
    Então o utilizador fica registado com esse perfil
    E o e-mail é o identificador de login do utilizador
    E o e-mail fica guardado em minúsculas

  Cenário: Password inicial opcional
    Quando crio um utilizador sem password inicial
    Então a conta é criada
    E a pessoa só consegue entrar depois de definir a password pelo link do e-mail de boas-vindas ou pela recuperação de password

  Cenário: E-mail duplicado
    Dado que já existe um utilizador com o e-mail "ana@exemplo.pt"
    Quando tento criar outro utilizador com o e-mail "ana@exemplo.pt"
    Então vejo a mensagem "Já existe um utilizador com este e-mail."

  Cenário: Exigir verificação em dois passos na criação
    Quando crio um utilizador com "Exigir verificação em dois passos" ativo
    Então no primeiro login a pessoa é obrigada a configurar a impressão digital ou a aplicação autenticadora
    # Detalhe em 11_mfa.feature

  # ── Perfis e permissões ────────────────────────────────────────────────

  Esquema do Cenário: Perfis disponíveis
    Quando crio um utilizador
    Então posso atribuir o perfil "<perfil>"

    Exemplos:
      | perfil        |
      | administrador |
      | normal        |

  Cenário: Perfil de super administrador
    Dado que estou autenticado como super administrador
    Quando crio ou edito um utilizador
    Então posso atribuir o perfil "super administrador"

  Esquema do Cenário: Quem gere quem
    Dado que estou autenticado como "<eu>"
    Então "<pode>" gerir contas com o perfil "<perfil>"

    Exemplos:
      | eu                  | perfil              | pode     |
      | super administrador | super administrador | posso    |
      | super administrador | administrador       | posso    |
      | super administrador | normal              | posso    |
      | administrador       | super administrador | não posso |
      | administrador       | administrador       | posso    |
      | administrador       | normal              | posso    |

  Cenário: Proteções sobre a própria conta
    Quando edito a minha própria conta
    Então não posso alterar o meu perfil
    E não posso desativar a minha conta
    E não posso alterar a obrigatoriedade da verificação em dois passos
    E não tenho a opção de eliminar a minha conta

  # ── Edição ─────────────────────────────────────────────────────────────

  Cenário: Editar um utilizador
    Quando abro um utilizador para edição
    Então posso alterar o nome, o perfil, o estado ativo e a obrigatoriedade da verificação em dois passos
    E o e-mail é apresentado mas não pode ser alterado
    E vejo a data de criação e a data do último acesso no formato YYYY/MM/DD

  Cenário: Desativar uma conta
    Quando desativo a conta de "ana@exemplo.pt" e guardo
    Então "ana@exemplo.pt" deixa de conseguir entrar
    E deixa de conseguir recuperar a password
    E as suas sessões abertas deixam de ser válidas

  Cenário: Eliminar um utilizador
    Quando escolho eliminar "ana@exemplo.pt"
    Então é-me pedida confirmação, a indicar que a ação é permanente
    Quando confirmo
    Então o utilizador é removido

  Cenário: Repor a verificação em dois passos
    Dado que "ana@exemplo.pt" tem verificação em dois passos configurada
    Quando escolho "Repor MFA" e confirmo
    Então a aplicação autenticadora e as impressões digitais da conta são removidas
    # Detalhe em 11_mfa.feature

  # ── E-mail de boas-vindas ──────────────────────────────────────────────

  Cenário: Enviar e-mail de boas-vindas sem reset de password
    Dado que existe o utilizador "maria"
    Quando envio o e-mail de boas-vindas a "maria"
    E escolho não incluir o reset de password
    Então "maria" recebe um e-mail em HTML, com o branding do projeto, a indicar que pertence à plataforma
    E o e-mail não contém link de reset de password
    E o e-mail contém um link para a página de login

  Cenário: Enviar e-mail de boas-vindas com reset de password
    Dado que existe o utilizador "maria"
    Quando envio o e-mail de boas-vindas a "maria"
    E escolho incluir o reset de password
    Então "maria" recebe um e-mail em HTML, com o branding do projeto, a indicar que pertence à plataforma
    E o e-mail contém um link válido de reset de password
    E o link é válido durante 72 horas e só pode ser usado uma vez

  Cenário: Envio de boas-vindas sem configuração de e-mail
    Dado que as configurações de envio de e-mail não estão preenchidas
    Quando tento enviar o e-mail de boas-vindas
    Então vejo uma mensagem a indicar que é necessário configurar o envio de e-mail
    E tenho um link para as settings de e-mail

  # ── Lista ──────────────────────────────────────────────────────────────

  Cenário: Lista de utilizadores
    Então vejo, para cada utilizador, o nome, o e-mail, o perfil, o estado, a verificação em dois passos e o último acesso
    E as datas são apresentadas no formato YYYY/MM/DD hh:mm
    E vejo contadores de utilizadores ativos, inativos e com verificação em dois passos

  Cenário: Pesquisar, filtrar e ordenar
    Quando pesquiso por parte do nome ou do e-mail
    Então só vejo os utilizadores correspondentes
    E posso filtrar por perfil e por estado
    E posso ordenar por utilizador, perfil e último acesso

  Esquema do Cenário: Indicação da verificação em dois passos na lista
    Dado um utilizador em que a verificação em dois passos está "<situacao>"
    Então a lista mostra "<indicacao>"

    Exemplos:
      | situacao                         | indicacao          |
      | ativa e não obrigatória          | MFA                |
      | ativa e obrigatória              | MFA obrigatório    |
      | obrigatória mas por configurar   | MFA por configurar |
      | inativa e não obrigatória        | nenhuma indicação  |

  Cenário: Lista em ecrãs pequenos
    Dado um ecrã do tipo "telemóvel"
    Quando abro a gestão de utilizadores
    Então cada utilizador é apresentado como um cartão, sem tabela com scroll horizontal
