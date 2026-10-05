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
    E posso configurar o protocolo, por omissão SMTP
    E posso indicar se usa SSL
    E posso indicar se deve ignorar certificados
    E posso configurar o utilizador e a password de autenticação

  Cenário: Guardar configuração válida
    Quando preencho todos os campos obrigatórios
    E guardo a configuração
    Então a configuração fica guardada
    E a password não é apresentada em claro

  Cenário: Envio de e-mail de teste
    Dado uma configuração de e-mail guardada
    Quando peço o envio de um e-mail de teste
    Então recebo uma indicação de sucesso ou o erro devolvido pelo servidor
