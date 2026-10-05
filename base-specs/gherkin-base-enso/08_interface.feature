# language: pt
@base @ui
Funcionalidade: Interface, tipografia e formatação
  Como utilizador
  Quero uma interface consistente e utilizável em qualquer dispositivo
  Para trabalhar a partir do computador, tablet ou telemóvel

  Cenário: Tipo de letra Inter
    Quando abro qualquer página da aplicação
    Então o texto é apresentado com o tipo de letra Inter

  Esquema do Cenário: Páginas responsivas
    Dado um ecrã do tipo "<dispositivo>"
    Quando abro a página "<pagina>"
    Então o conteúdo adapta-se à largura do ecrã
    E não existe scroll horizontal na página
    E todos os controlos são utilizáveis

    Exemplos:
      | dispositivo | pagina            |
      | desktop     | front-end público |
      | tablet      | front-end público |
      | telemóvel   | front-end público |
      | desktop     | back-office       |
      | telemóvel   | back-office       |
      | telemóvel   | login             |
      | telemóvel   | reset de password |
      | telemóvel   | OTP               |
      | telemóvel   | perfil            |

  Esquema do Cenário: Formatação de datas
    Dado um registo com a data e hora "2026-10-05T14:30:15"
    Quando a data é apresentada num contexto que exige "<precisao>"
    Então é apresentada como "<resultado>"

    Exemplos:
      | precisao             | resultado           |
      | só data              | 2026/10/05          |
      | data e hora          | 2026/10/05 14:30    |
      | data, hora e segundos | 2026/10/05 14:30:15 |

  Cenário: Nenhum outro formato de data é utilizado
    Quando percorro as páginas da aplicação e os e-mails enviados
    Então nenhuma data aparece em formatos como "05/10/2026" ou "5 out 2026"
