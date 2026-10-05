# language: pt
@base @emails
Funcionalidade: E-mails do sistema
  Como responsável pelo produto
  Quero que todos os e-mails enviados pela plataforma sigam o mesmo padrão
  Para transmitir uma imagem profissional e coerente com a marca do cliente

  Contexto:
    Dado que as configurações de envio de e-mail estão preenchidas
    E que o branding do projeto está configurado

  Esquema do Cenário: E-mails em HTML com branding
    Quando a plataforma envia um e-mail do tipo "<tipo>"
    Então o e-mail é enviado em formato HTML
    E apresenta o logótipo configurado no branding
    E apresenta o título do projeto
    E as datas incluídas seguem o formato YYYY/MM/DD

    Exemplos:
      | tipo              |
      | boas-vindas       |
      | reset de password |
      | aviso             |
      | e-mail de teste   |

  Cenário: Alteração do branding reflete-se nos e-mails
    Dado que altero o logótipo nas settings de branding
    Quando a plataforma envia o próximo e-mail
    Então o e-mail apresenta o novo logótipo
