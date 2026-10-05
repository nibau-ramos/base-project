# language: pt
@base @settings @branding
Funcionalidade: Branding do projeto
  Como administrador
  Quero configurar a identidade visual do projeto
  Para que a plataforma apresente a marca do cliente

  Contexto:
    Dado que estou autenticado como administrador
    E que estou nas settings, na secção de branding

  Cenário: Campos de branding disponíveis
    Então posso carregar o logótipo do projeto ou do cliente
    E posso definir o nome do cliente
    E posso definir o título do projeto

  Cenário: Logótipo do cliente na página de login
    Dado que carreguei um logótipo nas settings de branding
    Quando um visitante abre a página de login
    Então vê o logótipo configurado

  Cenário: Título do projeto disponível na aplicação
    Dado que defini o título do projeto "Portal Exemplo"
    Então o título "Portal Exemplo" fica disponível para o front-end e para o back-end

  Cenário: Favicon igual ao logótipo do branding
    Dado que carreguei um logótipo nas settings de branding
    Quando abro qualquer página da aplicação
    Então o favicon apresentado é o logótipo configurado

  Esquema do Cenário: Indicação Powered by ENSO
    Quando abro a página "<pagina>"
    Então vejo o texto "Powered by" numa linha
    E vejo o logótipo da ENSO na linha de baixo
    E o logótipo da ENSO corresponde ao disponibilizado em enso-origins.com

    Exemplos:
      | pagina      |
      | login       |
      | back-office |
