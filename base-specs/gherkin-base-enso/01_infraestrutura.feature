# language: pt
@base @infraestrutura
Funcionalidade: Infraestrutura de execução com Docker Compose
  Como equipa de desenvolvimento da ENSO
  Quero que todos os projetos sejam executados com Docker Compose
  Para garantir ambientes consistentes em desenvolvimento e produção

  Cenário: Cada componente corre como um serviço próprio
    Dado o ficheiro docker-compose do projeto
    Então existe um serviço para o front-end
    E existe um serviço para o back-end
    E existe um serviço para a base de dados
    E cada componente adicional necessário tem o seu próprio serviço

  Cenário: Dados persistentes guardados em pasta local por serviço
    Dado um serviço que necessita de dados persistentes
    Quando o docker-compose é analisado
    Então os dados desse serviço são mapeados para a pasta "./data/<nome-do-servico>"

  Cenário: Não são utilizados named volumes
    Dado o ficheiro docker-compose do projeto
    Então não existe nenhuma secção de named volumes
    # Exceção apenas com justificação técnica documentada no projeto

  Cenário: A pasta de dados não entra no repositório
    Dado o ficheiro ".gitignore" do projeto
    Então a pasta "data" da raiz do projeto é ignorada
    Mas as pastas de código-fonte com o nome "data" não são ignoradas

  Cenário: Arranque completo do projeto
    Dado um ambiente com Docker instalado
    Quando executo "docker compose up"
    Então todos os serviços arrancam sem erros
    E a aplicação fica acessível no browser

  Cenário: Portas configuráveis
    Dado que as portas por omissão já estão ocupadas por outro projeto
    Quando arranco o projeto com outras portas definidas em variáveis de ambiente
    Então a aplicação e as ferramentas de desenvolvimento ficam acessíveis nas novas portas

  Cenário: Estrutura da base de dados atualizada no arranque
    Dado uma base de dados criada por uma versão anterior do projeto
    Quando o back-end arranca
    Então as tabelas e colunas em falta são criadas
    E os dados existentes são mantidos

  Cenário: Tecnologias base do projeto
    Dado o código fonte do projeto
    Então o back-end é desenvolvido em Node
    E o front-end é desenvolvido em React
    E a base de dados não é uma solução Microsoft, como o SQL Server

  Cenário: Super administrador inicial
    Dado uma base de dados sem utilizadores
    Quando o back-end arranca
    Então é criado um super administrador com o e-mail e a password definidos em variáveis de ambiente
    E nos arranques seguintes esse utilizador não é recriado nem alterado

  Cenário: Settings iniciais definidas por variáveis de ambiente
    Dado que as settings de e-mail e de branding ainda não existem
    Quando o back-end arranca
    Então são preenchidas com os valores das variáveis de ambiente
    E a partir daí passam a ser geridas apenas no back-office

  Cenário: Segredos protegidos
    Dado o ambiente de produção
    Então o back-end não arranca sem uma chave secreta própria definida
    E a password do servidor de e-mail e os segredos de OTP ficam guardados cifrados na base de dados
    E as passwords dos utilizadores ficam guardadas com hash

  Cenário: Caixa de correio de desenvolvimento
    Dado o ambiente de desenvolvimento
    Então existe um serviço de captura de e-mails (Mailpit)
    E todos os e-mails enviados pela plataforma ficam visíveis na sua caixa de correio web
    E o front-end público, a barra lateral do back-office e as settings de e-mail mostram um link para essa caixa

  Cenário: Sem ferramentas de desenvolvimento em produção
    Dado o ambiente de produção, sem URL da caixa de correio de desenvolvimento configurado
    Quando abro qualquer página da aplicação
    Então não aparece nenhum link para a caixa de correio de desenvolvimento

  Cenário: Repositório inclui CLAUDE.md com as secções obrigatórias
    Dado o repositório do projeto
    Então existe um ficheiro "CLAUDE.md" na raiz
    E contém a secção "## Git Workflow"
    E contém a secção "## Behavior"
    E contém a secção "## Communication"
