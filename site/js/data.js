// Banco de dados estruturado do Guia Prático do Auxílio Estudantil UTFPR
const GUIA_DATA = [
  {
    "id": "comece_aqui",
    "title": "Comece por aqui",
    "badge": "01",
    "pages": [
      {
        "index": 0,
        "title": "GUIA DE AUXÍLIO ESTUDANTIL",
        "eyebrow": "PORTAL INFORMATIVO",
        "subtitle": "Passo a passo prático para solicitação e documentos (Edital 01/2026)",
        "highlight": "Este guia não substitui o edital vigente. Em caso de dúvida, consulte os canais oficiais da ASSAE.",
        "dark": false,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "PORTAL INFORMATIVO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "GUIA DE AUXÍLIO ESTUDANTIL"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Passo a passo prático para solicitação e documentos (Edital 01/2026)"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Organização linear em etapas para acompanhar o processo do início ao fim."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Instruções específicas para emissão sem erros do CNIS e IRPF."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Este guia não substitui o edital vigente. Em caso de dúvida, consulte os canais oficiais da ASSAE."
          }
        ]
      },
      {
        "index": 2,
        "title": "ANTES DE COMEÇAR",
        "eyebrow": "PRIMEIRO PASSO",
        "subtitle": "Organize tudo antes de acessar o sistema",
        "highlight": "Não deixe para reunir documentos no último dia. Isso aumenta o risco de erro ou perda de prazo.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "PRIMEIRO PASSO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "ANTES DE COMEÇAR"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Organize tudo antes de acessar o sistema"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Ler o edital vigente com atenção e confira o cronograma."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Separar seus documentos e do grupo familiar antes de iniciar (veja os modelos na <a href='#page-27'>Central de Downloads</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Conferir se seus dados no Portal do Aluno estão atualizados."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acompanhar o e-mail cadastrado e a caixa de spam durante todo o processo."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Pronto para prosseguir? Verifique agora os critérios de eligibilidade em <a href='#page-3'>Quem Pode Solicitar</a>."
          }
        ]
      },
      {
        "index": 3,
        "title": "QUEM PODE SOLICITAR?",
        "eyebrow": "PÚBLICO-ALVO",
        "subtitle": "Entenda os critérios gerais",
        "highlight": "A inscrição deve seguir exatamente as regras do edital vigente. Conferir os requisitos evita indeferimento.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "PÚBLICO-ALVO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "QUEM PODE SOLICITAR?"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Entenda os critérios gerais"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Estudante regularmente matriculado em curso presencial da UTFPR."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Estar cursando ao menos uma disciplina, conforme edital."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Possuir renda familiar condizente com a análise socioeconômica de vulnerabilidade."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Possuir renda familiar per capita dentro do critério de classificação e prioridade."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Se enquadra nos requisitos? Conheça os benefícios disponíveis na seção <a href='#page-4'>Quais Auxílios Existem</a>."
          }
        ]
      },
      {
        "index": 4,
        "title": "QUAIS AUXÍLIOS EXISTEM?",
        "eyebrow": "MODALIDADES",
        "subtitle": "Benefícios previstos no Auxílio Estudantil",
        "highlight": "O estudante deve selecionar as modalidades pretendidas durante a inscrição, conforme sua realidade.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "MODALIDADES"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "QUAIS AUXÍLIOS EXISTEM?"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Benefícios previstos no Auxílio Estudantil"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Auxílio Básico:</b> apoio financeiro mensal para manutenção e permanência do estudante."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Auxílio Moradia:</b> auxílio para estudantes que necessitam morar fora do domicílio de origem."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Auxílio Alimentação:</b> acesso subsidiado ou pecúnia para refeições no RU."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Auxílio Infância:</b> apoio mensal para estudantes com filhos sob sua guarda e sustento."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Escolheu suas modalidades? Antes de acessar a plataforma, simule sua situação no <a href='#page-1'>Simulador Interativo</a>."
          }
        ]
      },
      {
        "index": 1,
        "title": "SIMULADOR INTERATIVO",
        "eyebrow": "ROTEIRO E ELEGIBILIDADE",
        "subtitle": "Verifique sua elegibilidade e veja seu caminho de documentos recomendado",
        "dark": false,
        "elements": [
          {
            "type": "wizard",
            "id": "eligibility-wizard",
            "content": "Template do simulador de elegibilidade interativo baseado nas perguntas do edital."
          }
        ]
      }
    ]
  },
  {
    "id": "fazendo_inscricao",
    "title": "Fazendo a inscrição",
    "badge": "02",
    "pages": [
      {
        "index": 5,
        "title": "PASSO A PASSO DA INSCRIÇÃO",
        "eyebrow": "NA PLATAFORMA",
        "subtitle": "O caminho básico dentro do sistema",
        "highlight": "A inscrição só é considerada finalizada quando o sistema gera o protocolo.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "NA PLATAFORMA"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "PASSO A PASSO DA INSCRIÇÃO"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "O caminho básico dentro do sistema"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "1. Acessar o Portal do Aluno."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "2. Clicar em Inscrição - Auxílio Estudantil."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "3. Entrar na Plataforma de Inscrição."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "4. Ler o aviso inicial e clicar em Ciente."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "5. Preencher o Questionário Socioeconômico (consulte como fazer em <a href='#page-6'>Preenchendo a Inscrição</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "6. Cadastrar o grupo familiar (consulte as regras de composição em <a href='#page-8'>Grupo Familiar</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "7. Selecionar as modalidades (veja o que é cada uma em <a href='#page-4'>Quais Auxílios Existem</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "8. Enviar os documentos (veja como preparar sem erros em <a href='#page-7'>Documentos Sem Erro</a>, e veja os guias de <a href='#page-12'>CNIS</a> e <a href='#page-15'>IRPF</a>)."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "A inscrição só é considerada finalizada quando o sistema gera o protocolo de entrega."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "9. Conferir checklist, dados bancários e termo (veja as orientações em <a href='#page-18'>Finalizar a Inscrição</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "10. Finalizar e guardar o protocolo gerado."
          },
          {
            "type": "download",
            "title": "Tutorial de Inscrição (PDF)",
            "fileType": "pdf",
            "fileSize": "1.6 MB",
            "url": "documentos/tutorial inscrição.pdf",
            "description": "Manual oficial ilustrado completo ensinando como fazer a inscrição passo a passo."
          }
        ]
      },
      {
        "index": 6,
        "title": "PREENCHENDO A INSCRIÇÃO",
        "eyebrow": "ATENÇÃO AOS DADOS",
        "subtitle": "Informações precisam ser coerentes",
        "highlight": "Informação incompleta, contraditória ou omitida pode prejudicar a análise.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "ATENÇÃO AOS DADOS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "PREENCHENDO A INSCRIÇÃO"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Informações precisam ser coerentes"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Preencher dados pessoais, curso, moradia e situação socioeconômica com atenção."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Informe corretamente a renda, inclusive ajudas financeiras, bolsas, estágio e trabalho informal."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Cadastrar todos os membros do grupo familiar, começando pelo próprio estudante."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Revise antes de salvar e avançar para os documentos."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Antes de fazer o upload, veja as orientações fundamentais de como enviar seus <a href='#page-7'>Documentos Sem Erro</a>."
          }
        ]
      },
      {
        "index": 7,
        "title": "DOCUMENTOS SEM ERRO",
        "eyebrow": "UPLOAD CORRETO",
        "subtitle": "Como enviar arquivos sem prejudicar a análise",
        "highlight": "Antes de enviar, abra o arquivo e confira se todas as páginas aparecem corretamente.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "UPLOAD CORRETO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "DOCUMENTOS SEM ERRO"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Como enviar arquivos sem prejudicar a análise"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Usar formato PDF ou imagem, conforme o sistema aceitar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Garantir que o arquivo esteja legível, completo e sem rasuras."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Documentos com mais de uma página devem ser unificados em um único arquivo PDF."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Declarações precisam estar preenchidas por completo, datadas e assinadas (baixe os modelos em <a href='#page-27'>Modelos de Declarações</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "A assinatura deve ser manual ou digitalICP-Brasil; assinaturas recortadas e coladas como imagem não são aceitas."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Se for veterano (deferido em 2025), confira as regras de <a href='#page-11'>Aproveitamento de Documentos</a>. Caso contrário, confira quem entra no seu <a href='#page-8'>Grupo Familiar</a>."
          }
        ]
      },
      {
        "index": 8,
        "title": "GRUPO FAMILIAR",
        "eyebrow": "COMPOSIÇÃO",
        "subtitle": "Quem entra na análise socioeconômica",
        "highlight": "Omissão de pessoas ou rendas pode gerar inconsistência na inscrição.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "COMPOSIÇÃO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "GRUPO FAMILIAR"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Quem entra na análise socioeconômica"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Grupo familiar envolve todas as pessoas que residem com o estudante ou que compõem sua realidade econômica e subsistência."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Não se limita apenas a quem mora na mesma casa; dependentes econômicos em outras cidades contam."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Pessoas que contribuem financeiramente ou dependem da renda familiar do estudante devem integrar a análise."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Membros do grupo familiar sem renda ativa também devem ser obrigatoriamente informados."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Para entender melhor quem incluir em situações específicas, confira os <a href='#page-9'>Exemplos de Grupo Familiar</a>."
          }
        ]
      },
      {
        "index": 9,
        "title": "EXEMPLOS DE GRUPO FAMILIAR",
        "eyebrow": "CASOS COMUNS",
        "subtitle": "Situações que costumam gerar dúvida",
        "highlight": "Cada caso depende da realidade apresentada e dos documentos enviados.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "CASOS COMUNS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "EXEMPLOS DE GRUPO FAMILIAR"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Situações que costumam gerar dúvida"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Irmão que mora fora para estudar, mas depende e recebe ajuda financeira da família: deve integrar o grupo familiar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Avó que reside sob o mesmo teto e possui aposentadoria: deve integrar o grupo familiar e sua renda deve ser somada."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Estudante que mora sozinho, mas recebe ajuda financeira regular dos pais: deve declarar o grupo familiar de origem (não é automaticamente independente)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Familiar desempregado ou sem renda: deve ser incluído no questionário e apresentar declaração correspondente."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Mapeou o grupo? Agora veja como realizar o cálculo da sua <a href='#page-10'>Renda Per Capita</a>."
          }
        ]
      },
      {
        "index": 10,
        "title": "RENDA PER CAPITA",
        "eyebrow": "CÁLCULO SIMPLES",
        "subtitle": "Renda por pessoa do grupo familiar",
        "highlight": "Renda per capita = renda total do grupo familiar ÷ número de pessoas.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "CÁLCULO SIMPLES"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "RENDA PER CAPITA"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Renda por pessoa do grupo familiar"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Somar todas as rendas brutas mensais dos membros do grupo familiar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Dividir o valor total obtido pelo número de integrantes do grupo familiar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Exemplo: Renda total de R$ 3.200,00 dividida por 4 pessoas = R$ 800,00 per capita."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "O valor final é usado pelo sistema para classificar os estudantes em vulnerabilidade social."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Calculou? Se for veterano e teve inscrição deferida em 2025, consulte as regras de <a href='#page-11'>Aproveitamento de Documentos</a>. Caso contrário, siga para obter o <a href='#page-12'>CNIS</a>."
          }
        ]
      }
    ]
  },
  {
    "id": "documentos_importantes",
    "title": "Documentos importantes",
    "badge": "03",
    "pages": [
      {
        "index": 11,
        "title": "APROVEITAMENTO DE DOCUMENTOS",
        "eyebrow": "REGRAS VETERANOS",
        "subtitle": "Edital 01/2026 PROAE",
        "highlight": "Anexe a documentação completa necessária. Reaproveitar documentos sem manter exatamente a mesma realidade socioeconômica pode causar o indeferimento da inscrição a qualquer momento.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "REGRAS VETERANOS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "APROVEITAMENTO DE DOCUMENTOS"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Edital 01/2026 PROAE"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Estudante veterano com inscrição deferida no Processo de Seleção de 2025 (Edital 01/2025)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Manter composição do grupo familiar, renda, moradia e modalidades idênticas (sem qualquer alteração)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Não ter sofrido alteração socioeconômica (como novos membros, óbitos, desemprego ou novos empregos)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Não ter realizado Atualização Socioeconômica ou Ajuste de Pontuação em 2025."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Ter tido desempenho acadêmico em 2025/2 com reprovação/cancelamento em no máximo 33% das matérias (ou interpor recurso nos dias 09 e 10/03/2026)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Documentação obrigatória:</b> Anexe a documentação completa necessária (Termo de Reaproveitamento assinado via gov.br e Extrato CNIS atualizado de todos os membros maiores de 18 anos). Se houve qualquer alteração na família ou renda, envie todos os comprovantes completos de uma nova inscrição."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Se enquadra nessas regras? Anexe a documentação completa necessária e solicite o reaproveitamento. Caso contrário, deve emitir o extrato do <a href='#page-12'>CNIS</a> e apresentar todos os comprovantes."
          },
          {
            "type": "download",
            "title": "Tutorial Reaproveitamento (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial reaproveitamento.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como fazer o reaproveitamento."
          }
        ]
      },
      {
        "index": 12,
        "title": "CNIS: O QUE É?",
        "eyebrow": "MEU INSS",
        "subtitle": "Extrato de contribuições previdenciárias",
        "highlight": "Mesmo quem nunca trabalhou pode precisar apresentar CNIS sem vínculos.",
        "dark": false,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "MEU INSS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "CNIS: O QUE É?"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Extrato de contribuições previdenciárias"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "O CNIS registra vínculos de trabalho, contribuições previdenciárias e remunerações da pessoa física."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Serve para comprovar a renda oficial ou a ausência de vínculos empregatícios de cada membro do grupo familiar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "A emissão é feita online através do Portal ou App Meu INSS usando uma conta gov.br."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "O documento deve constar para o estudante e demais integrantes maiores de idade do grupo familiar."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Entendeu o conceito? Veja como emitir se você <a href='#page-13'>Já Teve Vínculos de Trabalho</a> ou se você <a href='#page-14'>Nunca Trabalhou</a>."
          },
          {
            "type": "download",
            "title": "Tutorial CNIS (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial cnis.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como emitir o CNIS."
          }
        ]
      },
      {
        "index": 13,
        "title": "CNIS: QUEM JÁ TEVE VÍNCULOS",
        "eyebrow": "PASSO A PASSO",
        "subtitle": "Como baixar o extrato completo",
        "highlight": "O arquivo correto deve mostrar vínculos, contribuições e remunerações.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "PASSO A PASSO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "CNIS: QUEM JÁ TEVE VÍNCULOS"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Como baixar o extrato completo"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acessar o site ou aplicativo Meu INSS."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Fazer login usando sua conta gov.br."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Buscar pela opção 'Extrato de Contribuição (CNIS)' no menu de serviços."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Clicar em 'Baixar PDF' no canto inferior da tela."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Selecionar a opção 'Relações Previdenciárias e Remunerações' (extrato completo) e confirmar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Salvar o arquivo PDF gerado e fazer o upload no sistema do auxílio."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Finalizou a emissão do CNIS? Siga agora para a verificação da comprovação do <a href='#page-15'>Imposto de Renda (IRPF)</a>."
          },
          {
            "type": "download",
            "title": "Tutorial CNIS (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial cnis.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como emitir o CNIS."
          }
        ]
      },
      {
        "index": 14,
        "title": "CNIS: QUEM NUNCA TRABALHOU",
        "eyebrow": "SEM VÍNCULOS",
        "subtitle": "Também precisa emitir comprovante",
        "highlight": "Não basta dizer que nunca trabalhou. É preciso apresentar o extrato emitido pelo sistema.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "SEM VÍNCULOS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "CNIS: QUEM NUNCA TRABALHOU"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Também precisa emitir comprovante"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acesse o Portal Meu INSS com sua conta gov.br."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Valide as informações iniciais e autorize o uso de dados cadastrais caso seja o primeiro acesso."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Verifique o extrato (deve constar que não existem vínculos de trabalho ativos registrados no CPF)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Baixe o PDF gerado pelo sistema e faça o upload no respectivo campo do edital."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Após obter o comprovante sem vínculos, avance para a verificação do <a href='#page-15'>Imposto de Renda (IRPF)</a> do grupo familiar."
          },
          {
            "type": "download",
            "title": "Tutorial CNIS (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial cnis.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como emitir o CNIS."
          }
        ]
      },
      {
        "index": 15,
        "title": "IRPF: DECLARANTE OU ISENTO?",
        "eyebrow": "IMPOSTO DE RENDA",
        "subtitle": "Verifique a situação de cada pessoa do grupo familiar",
        "highlight": "ETAPA 1 (1º Semestre) exige IRPF 2025 (ano-calendário 2024). ETAPA 2 (2º Semestre) exige IRPF 2026 (ano-calendário 2025).",
        "dark": false,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "IMPOSTO DE RENDA"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "IRPF: DECLARANTE OU ISENTO?"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Verifique a situação de cada pessoa do grupo familiar"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Quem declarou Imposto de Renda:</b> deve apresentar a cópia integral da declaração do IRPF anual acompanhada de seu recibo de entrega (consulte o passo a passo em <a href='#page-16'>Quem Declarou</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "<b>Quem é isento:</b> deve obter a certidão ou print direto da Receita Federal que indica situação 'Não entregue' para o CPF (consulte em <a href='#page-17'>Isento/Não Declarante</a>)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "O acesso ao Portal Meu Imposto de Renda (MIR) exige obrigatoriamente conta gov.br de nível <b>Prata ou Ouro</b>."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Contas com nível Bronze não têm autorização de acesso ao sistema do IRPF. Recomenda-se realizar o upgrade de nível previamente."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Definiu a situação de cada membro? Veja como proceder se a pessoa <a href='#page-16'>Declarou Imposto</a> ou se ela é <a href='#page-17'>Isenta / Não Declarante</a>."
          },
          {
            "type": "download",
            "title": "Tutorial IRPF (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial irpf.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como emitir ou comprovar isenção de IRPF."
          }
        ]
      },
      {
        "index": 16,
        "title": "IRPF: QUEM DECLAROU",
        "eyebrow": "DOCUMENTOS OBRIGATÓRIOS",
        "subtitle": "Declaração e recibo unificados em PDF",
        "highlight": "Uma declaração sem o respectivo recibo de entrega (ou vice-versa) é considerada documento incompleto e causará indeferimento.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "DOCUMENTOS OBRIGATÓRIOS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "IRPF: QUEM DECLAROU"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Declaração e recibo unificados em PDF"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acessar o Portal Meu Imposto de Renda (MIR) da Receita Federal."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Clicar em 'Consultar meu imposto de renda' e autenticar via gov.br (Prata ou Ouro)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Selecionar o ano correto (IRPF 2025 para inscrições no 1º Semestre, IRPF 2026 para inscrições no 2º Semestre)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Localizar e acessar a aba 'Documentos e Arquivos (Cópia da Declaração)'."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Baixar o PDF completo contendo a Cópia da Declaração e também o PDF do Recibo de Entrega correspondente."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Unificar ambos os arquivos em um único PDF (limite de 2 MB) e anexá-lo no sistema do auxílio."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Concluiu o envio do IRPF? Agora você pode avançar para o guia de como <a href='#page-18'>Finalizar a Inscrição</a> sem erros."
          },
          {
            "type": "download",
            "title": "Tutorial IRPF (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial irpf.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como emitir ou comprovar isenção de IRPF."
          }
        ]
      },
      {
        "index": 17,
        "title": "IRPF: ISENTO/NÃO DECLARANTE",
        "eyebrow": "COMPROVAÇÃO DE ISENÇÃO",
        "subtitle": "Print completo e legível do Portal MIR",
        "highlight": "Prints cortados, sem CPF visível ou sem a data/hora da consulta no rodapé da Receita Federal serão recusados.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "COMPROVAÇÃO DE ISENÇÃO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "IRPF: ISENTO/NÃO DECLARANTE"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Print completo e legível do Portal MIR"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acessar o Portal Meu Imposto de Renda (MIR) com gov.br."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Selecionar o exercício correto (IRPF 2025 para Etapa 1 / IRPF 2026 para Etapa 2) e constatar a indicação de 'Não entregue'."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Tirar um print legível assegurando que seu nome completo e CPF apareçam no canto superior direito."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Verificar se a mensagem central 'Não Entregue' está perfeitamente nítida."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Garantir que a mensagem oficial no rodapé esquerdo com a data e hora exata da consulta esteja visível."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Salvar e anexar este print ou arquivo PDF sem edições no sistema."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Anexou todos os comprovantes? Vá para a etapa final e veja como <a href='#page-18'>Finalizar a Inscrição</a> no portal."
          },
          {
            "type": "download",
            "title": "Tutorial IRPF (PDF)",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial irpf.pdf",
            "description": "Manual oficial detalhado com imagens passo a passo sobre como emitir ou comprovar isenção de IRPF."
          }
        ]
      }
    ]
  },
  {
    "id": "depois_envio",
    "title": "Depois do envio",
    "badge": "04",
    "pages": [
      {
        "index": 18,
        "title": "FINALIZAR A INSCRIÇÃO",
        "eyebrow": "CHECKLIST DO SISTEMA",
        "subtitle": "Última conferência antes do envio",
        "highlight": "A inscrição só está concluída quando o sistema gera o protocolo de inscrição.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "CHECKLIST DO SISTEMA"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "FINALIZAR A INSCRIÇÃO"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Última conferência antes do envio"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Ler a página de finalização da plataforma com total atenção."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Conferir o checklist geral de documentos exigidos."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Verificar se os dados bancários estão devidamente inseridos e corretos."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Ler e concordar com o Termo de Responsabilidade."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Corrigir qualquer divergência cadastral antes de finalizar."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Tudo conferido? Finalize a inscrição e guarde o protocolo. Acompanhe os próximos passos na seção <a href='#page-19'>Depois de Enviar</a>."
          }
        ]
      },
      {
        "index": 19,
        "title": "DEPOIS DE ENVIAR",
        "eyebrow": "ACOMPANHAMENTO",
        "subtitle": "O processo não acaba no envio",
        "highlight": "Complementação documental costuma ter prazo curto. Não deixe de acompanhar os comunicados.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "ACOMPANHAMENTO"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "DEPOIS DE ENVIAR"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "O processo não acaba no envio"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acompanhar periodicamente a Plataforma de Inscrição da UTFPR."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Verificar diariamente o e-mail cadastrado no Portal do Aluno."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Checar com frequência a pasta de spam e lixo eletrônico."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Responder a eventuais solicitações de complementação documental dentro do prazo estabelecido."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Fique atento! Acompanhe as formas de divulgação e prazos de recursos em <a href='#page-20'>Resultado da Inscrição</a>."
          }
        ]
      },
      {
        "index": 20,
        "title": "RESULTADO DA INSCRIÇÃO",
        "eyebrow": "TERMOS IMPORTANTES",
        "subtitle": "Entenda sua situação no processo",
        "highlight": "Leia o resultado com atenção e observe se existe prazo para recurso.",
        "dark": false,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "TERMOS IMPORTANTES"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "RESULTADO DA INSCRIÇÃO"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Entenda sua situação no processo"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Deferido: inscrição aceita."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Indeferido: inscrição negada, exigindo atenção ao motivo."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Contemplado(a): estudante selecionado(a) para receber o auxílio."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Lista de espera: inscrição aceita, mas ainda sem concessão por limite de orçamento/vagas."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Sua inscrição foi aceita e você foi contemplado(a)? Veja os próximos passos em <a href='#page-21'>Se For Contemplado(a)</a>."
          }
        ]
      },
      {
        "index": 21,
        "title": "SE FOR CONTEMPLADO(A)",
        "eyebrow": "PRIMEIROS CUIDADOS",
        "subtitle": "O que fazer após a concessão",
        "highlight": "Receber o auxílio também exige atenção às regras de manutenção.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "PRIMEIROS CUIDADOS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "SE FOR CONTEMPLADO(A)"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "O que fazer após a concessão"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Conferir se seus dados bancários no Portal do Aluno estão atualizados e corretos."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Acompanhar a liberação dos pagamentos mensais e eventuais comunicados."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Utilizar os valores recebidos de forma responsável para sua manutenção nos estudos."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Comunicar de imediato alterações de renda, composição familiar, estágio ou moradia."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Para certificar-se de que tudo correrá bem, revise a lista de <a href='#page-22'>Erros Comuns</a>."
          }
        ]
      }
    ]
  },
  {
    "id": "para_nao_errar",
    "title": "Para não errar",
    "badge": "05",
    "pages": [
      {
        "index": 22,
        "title": "ERROS COMUNS",
        "eyebrow": "EVITE PROBLEMAS",
        "subtitle": "O que mais prejudica a inscrição",
        "highlight": "A maioria dos erros pode ser evitada com organização, leitura atenta e acompanhamento do sistema.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "EVITE PROBLEMAS"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "ERROS COMUNS"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "O que mais prejudica a inscrição"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Perder o prazo de inscrição ou de recurso do edital."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Não acompanhar o e-mail cadastrado e a caixa de spam."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Enviar documento com páginas faltando, cortado ou ilegível."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Esquecer de cadastrar algum membro do grupo familiar no questionário."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Omitir rendas (como pensão, trabalho informal, estágio ou ajuda de terceiros)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Cadastrar conta bancária de outra pessoa ou conta poupabilidade não aceita."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Não finalizar o processo de inscrição no sistema (apenas salvar dados)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Não salvar e não guardar o número do protocolo de entrega."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Ignorar avisos e pedidos de complementação documental no painel do aluno."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Evite esses erros! Para esclarecer siglas e termos burocráticos do edital, acesse o <a href='#page-23'>Dicionário do Auxílio</a>."
          }
        ]
      },
      {
        "index": 23,
        "title": "DICIONÁRIO DO AUXÍLIO",
        "eyebrow": "TRADUZINDO O EDITAL",
        "subtitle": "Termos que aparecem com frequência",
        "highlight": "Quando um termo parecer confuso, procure orientação antes de perder prazo.",
        "dark": false,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "TRADUZINDO O EDITAL"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "DICIONÁRIO DO AUXÍLIO"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Termos que aparecem com frequência"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Deferido: inscrição aceita no processo."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Indeferido: inscrição negada por pendência ou critério não atendido."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Pecúnia: benefício pago em dinheiro depositado diretamente na conta."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Per capita: valor calculado individualmente por membro familiar."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Complementação: solicitação para corrigir ou reenviar documento no sistema."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Recurso: pedido formal para reanálise em caso de indeferimento."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• Homologado: documento aprovado e validado pela equipe avaliadora."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• PROAE: Pró-Reitoria de Assuntos Estudantis (Estrutura da Reitoria responsável pelas diretrizes, orçamento e editais gerais do Programa de Auxílio Estudantil da UTFPR)."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• ASSAE: Assessoria de Assuntos Estudantis (Estrutura local em cada Câmpus responsável pelo atendimento aos estudantes e execução dos auxílios)."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Esclareceu os conceitos? Faça agora uma checagem geral no seu processo com o <a href='#page-24'>Checklist Final</a>."
          }
        ]
      },
      {
        "index": 24,
        "title": "CHECKLIST FINAL",
        "eyebrow": "ANTES DE ENVIAR",
        "subtitle": "Confira tudo com calma",
        "highlight": "Se alguma resposta for não, resolva antes de finalizar a inscrição.",
        "dark": false,
        "checklist": true,
        "elements": [
          {
            "type": "text",
            "cls": "text eyebrowText",
            "content": "ANTES DE ENVIAR"
          },
          {
            "type": "text",
            "cls": "text titleText",
            "content": "CHECKLIST FINAL"
          },
          {
            "type": "text",
            "cls": "text subtitleText",
            "content": "Confira tudo com calma"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Li o edital oficial vigente com atenção?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Conferi o cronograma e os prazos limite?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Atualizei meus dados pessoais e escolares no Portal do Aluno?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Cadastrei todos os membros do grupo familiar sem omissões?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Separei os documentos de identificação e renda de todos?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Os arquivos anexados estão perfeitamente legíveis, completos e sem cortes?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Conferi e inseri os dados bancários corretos?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Li o Termo de Responsabilidade por completo?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Finalizei a inscrição de forma correta e guardei o protocolo?"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "Estou acompanhando diariamente os comunicados e meu e-mail?"
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "Se tudo estiver 'Sim', sua inscrição está pronta! Caso precise de suporte, consulte os <a href='#page-25'>Contatos e Orientação Final</a>."
          }
        ]
      },
      {
        "index": 25,
        "title": "CONTATOS E ORIENTAÇÃO FINAL",
        "eyebrow": "ASSAE",
        "subtitle": "Canais de atendimento da ASSAE nos 13 campi e orientações preventivas",
        "highlight": "Você não precisa enfrentar o processo sozinho. A equipe da ASSAE do seu campus está pronta para te orientar.",
        "dark": false,
        "elements": [
          {
            "type": "campi_contacts",
            "title": "Canais de Atendimento por Câmpus"
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• <b>Acompanhamento Contínuo:</b> Acompanhe diariamente o Portal do Aluno e o e-mail institucional (inclusive a caixa de SPAM) durante todas as etapas do processo."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• <b>Orientação Preventiva:</b> Na dúvida sobre qualquer documento, declaração ou cálculo de renda per capita, procure a ASSAE do seu campus com antecedência."
          },
          {
            "type": "card",
            "cls": "card bodyText",
            "content": "• <b>Atenção aos Prazos:</b> O sistema não permite envio ou complementação de documentos após o encerramento do prazo fixado em cronograma."
          },
          {
            "type": "highlight",
            "cls": "highlight bodyText",
            "content": "A Reitoria (PROAE) estabelece as diretrizes gerais e cada Câmpus (ASSAE) realiza o atendimento direto aos estudantes. Conte sempre com o apoio da assistência estudantil da UTFPR!"
          }
        ]
      }
    ]
  },
  {
    "id": "documentos_tutoriais",
    "title": "Central de Downloads",
    "badge": "06",
    "pages": [
      {
        "index": 26,
        "title": "TUTORIAIS EM PDF",
        "eyebrow": "DOWNLOADS",
        "subtitle": "Manuais e guias passo a passo oficiais em PDF",
        "dark": false,
        "elements": [
          {
            "type": "download",
            "title": "Edital Oficial Auxílio Estudantil",
            "fileType": "pdf",
            "fileSize": "19.2 MB",
            "url": "documentos/edital aux.pdf",
            "description": "Edital nº 01/2026 PROAE que regula as concessões e manutenção dos auxílios estudantis."
          },
          {
            "type": "download",
            "title": "Tutorial de Inscrição",
            "fileType": "pdf",
            "fileSize": "1.6 MB",
            "url": "documentos/tutorial inscrição.pdf",
            "description": "Guia passo a passo ilustrado ensinando como se inscrever na plataforma oficial."
          },
          {
            "type": "download",
            "title": "Tutorial CNIS",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial cnis.pdf",
            "description": "Instruções completas sobre como emitir seu extrato de contribuições CNIS (com ou sem vínculos)."
          },
          {
            "type": "download",
            "title": "Tutorial IRPF",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial irpf.pdf",
            "description": "Passo a passo para obter cópia da Declaração de Imposto de Renda e recibo de entrega ou comprovar isenção."
          },
          {
            "type": "download",
            "title": "Tutorial Reaproveitamento",
            "fileType": "pdf",
            "fileSize": "1.1 MB",
            "url": "documentos/tutorial reaproveitamento.pdf",
            "description": "Procedimento para estudantes veteranos solicitarem aproveitamento de documentos deferidos em 2025."
          }
        ]
      },
      {
        "index": 27,
        "title": "MODELOS DE DECLARAÇÕES",
        "eyebrow": "DOWNLOADS",
        "subtitle": "Arquivos em formato Word (.docx) para preenchimento",
        "dark": false,
        "elements": [
          {
            "type": "download",
            "title": "Declaração 1 - Renda",
            "fileType": "docx",
            "fileSize": "63 KB",
            "url": "documentos/Declaração 1 - Renda.docx",
            "description": "Modelo para declaração de renda familiar ou rendimentos próprios."
          },
          {
            "type": "download",
            "title": "Declaração 2 - Situação moradia estudante",
            "fileType": "docx",
            "fileSize": "62 KB",
            "url": "documentos/Declaração 2 - Situação moradia estudante.docx",
            "description": "Comprovação de situação de moradia do estudante para fins de auxílio."
          },
          {
            "type": "download",
            "title": "Declaração 3 - Rural",
            "fileType": "docx",
            "fileSize": "122 KB",
            "url": "documentos/Declaração 3 - Rural.docx",
            "description": "Modelo específico para declaração de rendimentos provenientes de atividade rural."
          },
          {
            "type": "download",
            "title": "Declaração 4 - Independência financeira",
            "fileType": "docx",
            "fileSize": "63 KB",
            "url": "documentos/Declaração 4 - Independência financeira.docx",
            "description": "Termo de declaração de independência financeira do núcleo familiar de origem."
          },
          {
            "type": "download",
            "title": "Declaração 5 - Diversas situações",
            "fileType": "docx",
            "fileSize": "62 KB",
            "url": "documentos/Declaração 5 - Diversas situações.docx",
            "description": "Modelo para justificativa de outras realidades não cobertas pelas demais declarações."
          },
          {
            "type": "download",
            "title": "Declaração 6 - Pagamento de aluguel",
            "fileType": "docx",
            "fileSize": "62 KB",
            "url": "documentos/Declaração 6 - Pagamento de aluguel.docx",
            "description": "Declaração de pagamento de aluguel ou moradia estudantil financiada."
          },
          {
            "type": "download",
            "title": "Declaração 7 - Não obrigatoriedade IR",
            "fileType": "docx",
            "fileSize": "62 KB",
            "url": "documentos/Declaração 7 - Não obrigatoriedade IR.docx",
            "description": "Declaração de isenção e não obrigatoriedade de apresentação do Imposto de Renda."
          },
          {
            "type": "download",
            "title": "Declaração 8 - Renda terceiros",
            "fileType": "docx",
            "fileSize": "63 KB",
            "url": "documentos/Declaração 8 - Renda terceiros .docx",
            "description": "Modelo para comprovação de recebimento de pensão ou ajuda de terceiros."
          },
          {
            "type": "download",
            "title": "Termo de Desligamento Voluntário",
            "fileType": "docx",
            "fileSize": "51 KB",
            "url": "documentos/TERMO DE DESLIGAMENTO VOLUNTÁRIO - AUXÍLIO ESTUDANTIL - UTFPR.docx",
            "description": "Modelo oficial para solicitação de cancelamento voluntário do Auxílio Estudantil."
          }
        ]
      },
      {
        "index": 28,
        "title": "EDITAL OFICIAL",
        "eyebrow": "DOCUMENTO BASE",
        "subtitle": "Publicação Oficial SEI-UTFPR",
        "externalUrl": "https://sei.utfpr.edu.br/sei/publicacoes/controlador_publicacoes.php?acao=publicacao_visualizar&id_documento=6394999&id_orgao_publicacao=0",
        "dark": false,
        "elements": [
          {
            "type": "official_link",
            "title": "Edital Oficial nº 01/2026 PROAE",
            "url": "https://sei.utfpr.edu.br/sei/publicacoes/controlador_publicacoes.php?acao=publicacao_visualizar&id_documento=6394999&id_orgao_publicacao=0",
            "description": "O Edital Oficial nº 01/2026 PROAE está publicado e disponível para consulta pública na íntegra no Sistema Eletrônico de Informações (SEI) da UTFPR."
          }
        ]
      }
    ]
  }
];
