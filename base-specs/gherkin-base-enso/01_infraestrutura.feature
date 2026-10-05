@base @infraestrutura
Feature: Infraestrutura de execução com Docker Compose
  Como equipa de desenvolvimento da ENSO
  Quero que todos os projetos sejam executados com Docker Compose
  Para garantir ambientes consistentes em desenvolvimento e produção

  Scenario: Cada componente corre como um serviço próprio
    Given o ficheiro docker-compose do projeto
    Then existe um serviço para o front-end
    And existe um serviço para o back-end
    And existe um serviço para a base de dados
    And cada componente adicional necessário tem o seu próprio serviço

  Scenario: Dados persistentes guardados em pasta local por serviço
    Given um serviço que necessita de dados persistentes
    When o docker-compose é analisado
    Then os dados desse serviço são mapeados para a pasta "./data/<nome-do-servico>"

  Scenario: Não são utilizados named volumes
    Given o ficheiro docker-compose do projeto
    Then não existe nenhuma secção de named volumes
    # Exceção apenas com justificação técnica documentada no projeto

  Scenario: A pasta de dados não entra no repositório
    Given o ficheiro ".gitignore" do projeto
    Then a pasta "data" da raiz do projeto é ignorada
    But as pastas de código-fonte com o nome "data" não são ignoradas

  Scenario: Arranque completo do projeto
    Given um ambiente com Docker instalado
    When executo "docker compose up"
    Then todos os serviços arrancam sem erros
    And a aplicação fica acessível no browser

  Scenario: Portas configuráveis
    Given que as portas por omissão já estão ocupadas por outro projeto
    When arranco o projeto com outras portas definidas em variáveis de ambiente
    Then a aplicação e as ferramentas de desenvolvimento ficam acessíveis nas novas portas

  Scenario: Estrutura da base de dados atualizada no arranque
    Given uma base de dados criada por uma versão anterior do projeto
    When o back-end arranca
    Then as tabelas e colunas em falta são criadas
    And os dados existentes são mantidos

  Scenario: Tecnologias base do projeto
    Given o código fonte do projeto
    Then o back-end é desenvolvido em Node
    And o front-end é desenvolvido em React
    And a base de dados não é uma solução Microsoft, como o SQL Server

  Scenario: Super administrador inicial
    Given uma base de dados sem utilizadores
    When o back-end arranca
    Then é criado um super administrador com o e-mail e a password definidos em variáveis de ambiente
    And nos arranques seguintes esse utilizador não é recriado nem alterado

  Scenario: Settings iniciais definidas por variáveis de ambiente
    Given que as settings de e-mail e de branding ainda não existem
    When o back-end arranca
    Then são preenchidas com os valores das variáveis de ambiente
    And a partir daí passam a ser geridas apenas no back-office

  Scenario: Segredos protegidos
    Given o ambiente de produção
    Then o back-end não arranca sem uma chave secreta própria definida
    And a password do servidor de e-mail e os segredos de OTP ficam guardados cifrados na base de dados
    And as passwords dos utilizadores ficam guardadas com hash

  Scenario: Caixa de correio de desenvolvimento
    Given o ambiente de desenvolvimento
    Then existe um serviço de captura de e-mails (Mailpit)
    And todos os e-mails enviados pela plataforma ficam visíveis na sua caixa de correio web
    And o front-end público, a barra lateral do back-office e as settings de e-mail mostram um link para essa caixa

  Scenario: Sem ferramentas de desenvolvimento em produção
    Given o ambiente de produção, sem URL da caixa de correio de desenvolvimento configurado
    When abro qualquer página da aplicação
    Then não aparece nenhum link para a caixa de correio de desenvolvimento

  Scenario: Repositório inclui CLAUDE.md com as secções obrigatórias
    Given o repositório do projeto
    Then existe um ficheiro "CLAUDE.md" na raiz
    And contém a secção "## Git Workflow"
    And contém a secção "## Behavior"
    And contém a secção "## Communication"
