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
    Então o e-mail é enviado em formato HTML, com uma versão em texto simples
    E apresenta o logótipo configurado no branding, embebido no próprio e-mail
    E apresenta o título do projeto e o nome do cliente
    E as datas incluídas seguem o formato YYYY/MM/DD
    E o remetente é o e-mail configurado nas settings, com o título do projeto como nome

    Exemplos:
      | tipo                                     |
      | boas-vindas                              |
      | reset de password                        |
      | aviso de password alterada               |
      | aviso de verificação em dois passos reposta |
      | e-mail de teste                          |

  Cenário: Botões de ação com a cor da marca
    Quando a plataforma envia um e-mail com um botão de ação
    Então o botão usa a cor "primary" do branding
    E o endereço do link aparece também em texto, para poder ser copiado

  Cenário: Alteração do branding reflete-se nos e-mails
    Dado que altero o logótipo nas settings de branding
    Quando a plataforma envia o próximo e-mail
    Então o e-mail apresenta o novo logótipo

  Cenário: Conteúdos escapados
    Dado um nome de utilizador ou de cliente com caracteres especiais de HTML
    Quando a plataforma envia um e-mail
    Então esses caracteres aparecem como texto e não alteram o e-mail

  Cenário: Falha no envio de avisos não bloqueia a ação
    Dado que o servidor de e-mail está indisponível
    Quando altero a minha password
    Então a password é alterada na mesma
    E a falha no envio do aviso fica registada no servidor
