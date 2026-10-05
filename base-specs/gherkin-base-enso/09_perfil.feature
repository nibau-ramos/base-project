# language: pt
@base @utilizadores @perfil
Funcionalidade: Perfil do utilizador
  Como utilizador autenticado
  Quero gerir a minha password e a verificação em dois passos no meu perfil
  Para manter a minha conta segura sem depender de um administrador

  Contexto:
    Dado que estou autenticado
    E que estou na página do meu perfil

  Cenário: Informação da conta
    Então vejo o meu nome, o meu e-mail e o meu perfil

  Esquema do Cenário: Alterar password disponível para todos os perfis
    Dado que o meu perfil é "<perfil>"
    Então tenho a opção de alterar a minha password

    Exemplos:
      | perfil              |
      | super administrador |
      | administrador       |
      | normal              |

  Cenário: Alterar password com sucesso
    Quando introduzo a password atual correta
    E introduzo e confirmo uma nova password com pelo menos 8 caracteres
    E guardo a alteração
    Então a password é atualizada
    E consigo fazer login com a nova password
    E continuo autenticado neste browser
    E as minhas sessões noutros browsers terminam
    E recebo um e-mail de aviso a indicar que a password foi alterada, com a data no formato YYYY/MM/DD hh:mm

  Cenário: Password atual incorreta
    Quando introduzo uma password atual incorreta
    E introduzo e confirmo uma nova password válida
    E guardo a alteração
    Então vejo uma mensagem de erro
    E a password não é alterada

  Cenário: Confirmação da nova password não coincide
    Quando introduzo a password atual correta
    E a confirmação da nova password é diferente da nova password
    Então vejo uma mensagem de erro
    E a password não é alterada

  Cenário: Nova password demasiado curta
    Quando introduzo a password atual correta
    E introduzo e confirmo uma nova password com menos de 8 caracteres
    Então vejo a mensagem "A password deve ter pelo menos 8 caracteres."
    E a password não é alterada

  Cenário: Gerir a verificação em dois passos
    Então vejo o estado da verificação em dois passos e se é obrigatória na minha conta
    E posso registar a impressão digital deste computador e remover computadores registados
    E posso ativar ou desativar a aplicação autenticadora
    # Regras e detalhe em 11_mfa.feature
