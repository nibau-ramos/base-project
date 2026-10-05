@base @emails
Feature: E-mails do sistema
  Como responsável pelo produto
  Quero que todos os e-mails enviados pela plataforma sigam o mesmo padrão
  Para transmitir uma imagem profissional e coerente com a marca do cliente

  Background:
    Given que as configurações de envio de e-mail estão preenchidas
    And que o branding do projeto está configurado

  Scenario Outline: E-mails em HTML com branding
    When a plataforma envia um e-mail do tipo "<tipo>"
    Then o e-mail é enviado em formato HTML, com uma versão em texto simples
    And apresenta o logótipo configurado no branding, embebido no próprio e-mail
    And apresenta o título do projeto e o nome do cliente
    And as datas incluídas seguem o formato YYYY/MM/DD
    And o remetente é o e-mail configurado nas settings, com o título do projeto como nome

    Examples:
      | tipo                                     |
      | boas-vindas                              |
      | reset de password                        |
      | aviso de password alterada               |
      | aviso de verificação em dois passos reposta |
      | e-mail de teste                          |

  Scenario: Botões de ação com a cor da marca
    When a plataforma envia um e-mail com um botão de ação
    Then o botão usa a cor "primary" do branding
    And o endereço do link aparece também em texto, para poder ser copiado

  Scenario: Alteração do branding reflete-se nos e-mails
    Given que altero o logótipo nas settings de branding
    When a plataforma envia o próximo e-mail
    Then o e-mail apresenta o novo logótipo

  Scenario: Conteúdos escapados
    Given um nome de utilizador ou de cliente com caracteres especiais de HTML
    When a plataforma envia um e-mail
    Then esses caracteres aparecem como texto e não alteram o e-mail

  Scenario: Falha no envio de avisos não bloqueia a ação
    Given que o servidor de e-mail está indisponível
    When altero a minha password
    Then a password é alterada na mesma
    And a falha no envio do aviso fica registada no servidor
