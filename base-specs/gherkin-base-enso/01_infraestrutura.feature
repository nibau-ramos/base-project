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

  Cenário: Arranque completo do projeto
    Dado um ambiente com Docker instalado
    Quando executo "docker compose up"
    Então todos os serviços arrancam sem erros
    E a aplicação fica acessível no browser

  Cenário: Tecnologias base do projeto
    Dado o código fonte do projeto
    Então o back-end é desenvolvido em Node
    E o front-end é desenvolvido em React
    E a base de dados não é uma solução Microsoft, como o SQL Server

  Cenário: Repositório inclui CLAUDE.md com as secções obrigatórias
    Dado o repositório do projeto
    Então existe um ficheiro "CLAUDE.md" na raiz
    E contém a secção "## Git Workflow"
    E contém a secção "## Behavior"
    E contém a secção "## Communication"
