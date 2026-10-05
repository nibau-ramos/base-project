# language: pt
@base @utilizadores
Funcionalidade: Gestão de utilizadores no back-office
  Como administrador
  Quero gerir os utilizadores e os seus perfis
  Para controlar quem acede à plataforma

  Contexto:
    Dado que estou autenticado como administrador
    E que estou na gestão de utilizadores

  Cenário: Criar utilizador com e-mail e perfil
    Quando crio um utilizador com o e-mail "ana@exemplo.pt" e o perfil "normal"
    Então o utilizador fica registado com esse perfil
    E o e-mail é o identificador de login do utilizador

  Esquema do Cenário: Perfis disponíveis
    Quando crio um utilizador
    Então posso atribuir o perfil "<perfil>"

    Exemplos:
      | perfil        |
      | administrador |
      | normal        |

  @opcional
  Cenário: Perfil de super administrador
    Dado que o projeto prevê o perfil de super administrador
    Quando crio um utilizador
    Então posso atribuir o perfil "super administrador"

  Cenário: Enviar e-mail de boas-vindas sem reset de password
    Dado que existe o utilizador "maria"
    Quando envio o e-mail de boas-vindas a "maria"
    E escolho não incluir o reset de password
    Então "maria" recebe um e-mail em HTML, com o branding do projeto, a indicar que pertence à plataforma
    E o e-mail não contém link de reset de password

  Cenário: Enviar e-mail de boas-vindas com reset de password
    Dado que existe o utilizador "maria"
    Quando envio o e-mail de boas-vindas a "maria"
    E escolho incluir o reset de password
    Então "maria" recebe um e-mail em HTML, com o branding do projeto, a indicar que pertence à plataforma
    E o e-mail contém um link válido de reset de password

  Cenário: Envio de boas-vindas sem configuração de e-mail
    Dado que as configurações de envio de e-mail não estão preenchidas
    Quando tento enviar o e-mail de boas-vindas
    Então vejo uma mensagem a indicar que é necessário configurar o envio de e-mail
