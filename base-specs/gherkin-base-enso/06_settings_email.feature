# language: pt
@base @settings
Funcionalidade: Configuração de envio de e-mail
  Como administrador
  Quero configurar o servidor de envio de e-mail nas settings
  Para que a plataforma consiga enviar notificações

  Contexto:
    Dado que estou autenticado como administrador
    E que estou nas settings, na secção de e-mail

  Cenário: Campos disponíveis na configuração de e-mail
    Então posso configurar o host
    E posso configurar a porta
    E posso configurar o protocolo, por omissão SMTP
    E posso indicar se usa SSL
    E posso indicar se deve ignorar certificados
    E posso configurar o utilizador e a password de autenticação
    E posso configurar o e-mail do remetente

  Cenário: Guardar configuração válida
    Quando preencho o host, a porta e o e-mail do remetente
    E guardo a configuração
    Então a configuração fica guardada
    E a password não é apresentada em claro

  Esquema do Cenário: Configuração inválida
    Quando guardo a configuração com "<problema>"
    Então vejo a mensagem "<mensagem>"
    E a configuração anterior mantém-se

    Exemplos:
      | problema                          | mensagem                                  |
      | o host vazio                      | Indique o host.                           |
      | a porta 70000                     | Indique uma porta válida.                 |
      | o e-mail do remetente inválido    | Indique um e-mail de remetente válido.    |

  Cenário: A password guardada nunca sai do servidor
    Dado que existe uma password de autenticação guardada
    Quando abro a secção de e-mail
    Então o campo da password aparece vazio, com a indicação de que existe uma password guardada
    E a password nunca é devolvida pelo back-end

  Cenário: Manter a password guardada
    Dado que existe uma password de autenticação guardada
    Quando altero outro campo, deixo a password vazia e guardo
    Então a password guardada mantém-se

  Cenário: Remover a password guardada
    Dado que existe uma password de autenticação guardada
    Quando escolho remover a password guardada e guardo
    Então deixa de existir password de autenticação

  Cenário: Envio de e-mail de teste
    Dado uma configuração de e-mail guardada
    Quando indico um destinatário e peço o envio de um e-mail de teste
    Então recebo uma indicação de sucesso ou o erro devolvido pelo servidor
    E o destinatário sugerido é o meu próprio e-mail
