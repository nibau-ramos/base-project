# language: pt
@base @autenticacao @mfa
Funcionalidade: Verificação em dois passos (MFA)
  Como utilizador da plataforma
  Quero proteger a minha conta com a impressão digital do computador ou com uma aplicação autenticadora
  Para que a password, sozinha, não chegue para entrar

  # Métodos suportados:
  #   - Aplicação autenticadora (TOTP): código de 6 dígitos (Google Authenticator, Microsoft Authenticator, 1Password…)
  #   - Impressão digital (WebAuthn): sensor do próprio computador (Touch ID, Windows Hello…)
  # Uma conta pode ter um, outro ou ambos. "MFA ativo" = pelo menos um método configurado.

  # ── Configuração no perfil ─────────────────────────────────────────────

  Cenário: Ativar a aplicação autenticadora
    Dado que estou autenticado como "joao@exemplo.pt" e na página do meu perfil
    Quando escolho ativar a aplicação autenticadora
    Então é apresentado um código QR e a respetiva chave manual
    E a aplicação só fica ativa depois de eu introduzir um código válido

  Cenário: Código inválido ao ativar a aplicação
    Dado que estou a ativar a aplicação autenticadora
    Quando introduzo um código inválido
    Então vejo a mensagem "Código inválido."
    E a aplicação continua inativa

  Cenário: Registar a impressão digital deste computador
    Dado que estou autenticado como "joao@exemplo.pt" e na página do meu perfil
    E que o browser suporta impressão digital
    Quando dou um nome ao computador e escolho "Registar este computador"
    E confirmo com a impressão digital no sistema operativo
    Então o computador aparece na lista com o nome e a data de registo no formato YYYY/MM/DD
    E posso passar a entrar com a impressão digital

  Cenário: Vários computadores registados
    Dado que registei a impressão digital em dois computadores
    Então a lista mostra os dois, com a data de registo e a data do último uso
    E as passkeys sincronizadas entre dispositivos aparecem identificadas como "sincronizada"

  Cenário: Registar duas vezes o mesmo computador
    Dado que este computador já está registado
    Quando tento registá-lo novamente
    Então vejo uma mensagem a indicar que este computador já está registado

  Cenário: Remover um computador registado
    Dado que tenho mais do que um método de verificação ativo
    Quando removo um computador da lista e confirmo
    Então deixo de poder entrar com a impressão digital desse computador

  Cenário: Desativar a aplicação autenticadora
    Dado que tenho a aplicação autenticadora ativa e o MFA não é obrigatório na minha conta
    Quando desativo a aplicação confirmando a minha password
    Então a aplicação fica inativa

  Cenário: Browser sem suporte para impressão digital
    Dado que o meu browser não suporta impressão digital
    Quando abro o meu perfil
    Então vejo um aviso de que o browser não suporta impressão digital
    E continuo a poder ativar a aplicação autenticadora

  # ── Login com segundo fator ────────────────────────────────────────────

  Esquema do Cenário: Métodos oferecidos no segundo passo do login
    Dado que a minha conta tem "<metodos>"
    Quando introduzo e-mail e password corretos
    Então o segundo passo oferece "<opcoes>"

    Exemplos:
      | metodos                                       | opcoes                                                   |
      | apenas a aplicação autenticadora              | o campo para o código                                    |
      | apenas a impressão digital                    | o botão "Usar impressão digital"                         |
      | a aplicação autenticadora e a impressão digital | o botão "Usar impressão digital" ou o campo para o código |

  Cenário: Entrar com a impressão digital
    Dado que estou no segundo passo do login
    Quando escolho "Usar impressão digital" e confirmo no sistema operativo
    Então fico autenticado
    E a data de último uso desse computador é atualizada

  Cenário: Entrar com o código da aplicação
    Dado que estou no segundo passo do login
    Quando introduzo um código válido da aplicação autenticadora
    Então fico autenticado

  Cenário: Código inválido no login
    Dado que estou no segundo passo do login
    Quando introduzo um código inválido
    Então vejo a mensagem "Código inválido."
    E não fico autenticado

  Cenário: Impressão digital cancelada
    Dado que estou no segundo passo do login
    Quando cancelo o pedido de impressão digital no sistema operativo
    Então vejo uma mensagem a indicar que a operação foi cancelada
    E posso tentar novamente ou usar o código

  Cenário: O segundo passo expira
    Dado que introduzi e-mail e password corretos há mais de 5 minutos
    Quando tento concluir o segundo passo
    Então vejo uma mensagem a pedir para voltar a introduzir o e-mail e a password

  Cenário: Não é possível saltar a password
    Dado que não introduzi a password
    Quando tento usar diretamente a impressão digital ou o código
    Então o pedido é recusado

  # ── MFA obrigatório ────────────────────────────────────────────────────

  Cenário: Administrador torna o MFA obrigatório
    Dado que sou administrador e estou a editar a conta de "maria@exemplo.pt"
    Quando ativo "Exigir verificação em dois passos" e guardo
    Então a conta passa a exigir pelo menos um método de verificação

  Cenário: Primeiro login com MFA obrigatório e sem métodos configurados
    Dado que a conta "maria@exemplo.pt" exige MFA e não tem nenhum método configurado
    Quando introduzo e-mail e password corretos
    Então não fico autenticado
    E tenho de escolher entre "Impressão digital neste computador" e "Aplicação autenticadora"
    E só fico autenticada depois de configurar o método escolhido

  Esquema do Cenário: Configuração obrigatória com cada método
    Dado que estou na configuração obrigatória do segundo fator
    Quando escolho "<metodo>" e concluo a configuração
    Então fico autenticada
    E a minha conta passa a ter esse método ativo

    Exemplos:
      | metodo                            |
      | Impressão digital neste computador |
      | Aplicação autenticadora           |

  Cenário: Sessões abertas terminam ao tornar o MFA obrigatório
    Dado que "maria@exemplo.pt" tem uma sessão aberta e nenhum método configurado
    Quando um administrador torna o MFA obrigatório na sua conta
    Então a sessão de "maria@exemplo.pt" termina
    E no próximo login tem de configurar um método

  Esquema do Cenário: Não é possível ficar sem o último método
    Dado que a minha conta exige MFA
    E que o único método ativo é "<metodo>"
    Quando tento remover esse método
    Então a remoção é recusada
    E vejo a indicação de que tenho de configurar outro método antes de remover este

    Exemplos:
      | metodo                   |
      | a aplicação autenticadora |
      | a impressão digital      |

  Cenário: Com dois métodos posso remover um
    Dado que a minha conta exige MFA
    E que tenho a impressão digital e a aplicação autenticadora ativas
    Quando removo um deles
    Então a remoção é aceite
    E o outro passa a ser o último método, que não pode ser removido

  Cenário: Perfil indica que o MFA é obrigatório
    Dado que a minha conta exige MFA
    Quando abro o meu perfil
    Então vejo que a verificação em dois passos é obrigatória nesta conta

  Cenário: Administrador não altera a obrigatoriedade na própria conta
    Dado que sou administrador
    Quando tento alterar "Exigir verificação em dois passos" na minha própria conta
    Então a alteração é recusada
    E sou orientado a gerir a minha verificação no meu perfil

  # ── Reposição pelo administrador ───────────────────────────────────────

  Cenário: Repor o MFA de quem perdeu o telemóvel ou o computador
    Dado que "maria@exemplo.pt" tem métodos de verificação configurados
    Quando um administrador escolhe "Repor MFA" na conta e confirma
    Então a aplicação autenticadora e todas as impressões digitais da conta são removidas
    E as sessões abertas de "maria@exemplo.pt" terminam
    E "maria@exemplo.pt" recebe um e-mail a avisar da reposição

  Esquema do Cenário: Login depois da reposição
    Dado que o MFA de "maria@exemplo.pt" foi reposto
    E que a conta "<obrigatoriedade>" exige MFA
    Quando "maria@exemplo.pt" faz login com e-mail e password
    Então "<resultado>"

    Exemplos:
      | obrigatoriedade | resultado                                         |
      | sim             | tem de configurar um método antes de entrar       |
      | não             | entra apenas com a password                       |

  # ── Requisitos técnicos ────────────────────────────────────────────────

  Cenário: Impressões digitais ligadas ao domínio
    Dado que a plataforma está publicada num domínio
    Então as impressões digitais registadas só são válidas nesse domínio
    E em produção o site é servido em HTTPS
    # Mudar de domínio obriga a registar novamente as impressões digitais
