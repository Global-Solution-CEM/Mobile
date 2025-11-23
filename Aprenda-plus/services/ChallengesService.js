// Serviço para gerar desafios baseados nas áreas de interesse do usuário
// Sistema de aprendizado contínuo estilo Duolingo

import { GameStorage } from './GameStorage';

// Gerar um desafio específico com variação
const generateSingleChallenge = (area, nivel, tipo, variation, t) => {
  const basePoints = nivel === 'Iniciante' ? 200 : nivel === 'Intermediário' ? 400 : 600;
  const variationMultiplier = 1 + (variation * 0.1); // Aumenta pontos levemente com variações
  
  const challengeTemplates = {
    ia: {
      quiz: {
        titulo: variation === 0 ? t('desafioQuizIA') : `${t('desafioQuizIA')} ${variation + 1}`,
          descricao: t('desafioQuizIADesc'),
          icone: '🤖',
      },
      memoria: {
        titulo: variation === 0 ? t('desafioMemoriaIA') : `${t('desafioMemoriaIA')} ${variation + 1}`,
          descricao: t('desafioMemoriaIADesc'),
          icone: '🧠',
      },
      pratica: {
        titulo: `Prática de IA ${variation + 1}`,
        descricao: 'Aplique seus conhecimentos de IA',
        icone: '🎯',
      },
    },
    dados: {
      quiz: {
        titulo: variation === 0 ? t('desafioQuizDados') : `${t('desafioQuizDados')} ${variation + 1}`,
          descricao: t('desafioQuizDadosDesc'),
          icone: '📊',
      },
      logica: {
        titulo: variation === 0 ? t('desafioLogicaDados') : `${t('desafioLogicaDados')} ${variation + 1}`,
          descricao: t('desafioLogicaDadosDesc'),
          icone: '🔢',
      },
      analise: {
        titulo: `Análise de Dados ${variation + 1}`,
        descricao: 'Analise e interprete dados',
        icone: '📈',
      },
    },
    programacao: {
      quiz: {
        titulo: variation === 0 ? t('desafioQuizProgramacao') : `${t('desafioQuizProgramacao')} ${variation + 1}`,
          descricao: t('desafioQuizProgramacaoDesc'),
          icone: '💻',
      },
      codigo: {
        titulo: variation === 0 ? t('desafioCodigoProgramacao') : `${t('desafioCodigoProgramacao')} ${variation + 1}`,
          descricao: t('desafioCodigoProgramacaoDesc'),
          icone: '⌨️',
      },
      pratica: {
        titulo: `Prática de Código ${variation + 1}`,
        descricao: 'Pratique programação',
        icone: '⚡',
      },
    },
  };

  const template = challengeTemplates[area]?.[tipo] || {
    titulo: `${t('desafioQuiz')} - ${t(area)} ${variation + 1}`,
          descricao: t('desafioQuizDesc'),
          icone: '📚',
  };

  return {
    id: `${tipo}_${area}_${nivel}_v${variation}`,
    tipo: tipo,
          area: area,
          nivel: nivel,
    variation: variation,
    titulo: template.titulo,
    descricao: template.descricao,
    pontos: Math.round(basePoints * variationMultiplier),
    icone: template.icone,
          dificuldade: nivel,
  };
};

// Gerar desafios iniciais (3 desafios)
export const generateInitialChallenges = (areasInteresse, t) => {
  const challenges = [];
  const CHALLENGES_TO_SHOW = 3;
  
  // Priorizar primeira área de interesse
  if (areasInteresse && areasInteresse.length > 0) {
    const firstArea = typeof areasInteresse[0] === 'object' ? areasInteresse[0].area : areasInteresse[0];
    const firstNivel = typeof areasInteresse[0] === 'object' ? areasInteresse[0].nivel : 'Iniciante';
    
    // Gerar 3 desafios iniciais da primeira área
    const tipos = ['quiz', 'quiz', 'quiz']; // Começar com quizzes
    
    for (let i = 0; i < CHALLENGES_TO_SHOW; i++) {
      const challenge = generateSingleChallenge(firstArea, firstNivel, tipos[i] || 'quiz', 0, t);
      challenges.push(challenge);
    }
  }
  
  return challenges;
};

// Gerar próximo desafio baseado no progresso
export const generateNextChallenge = (areasInteresse, completedChallenges, generatedChallenges, t) => {
  if (!areasInteresse || areasInteresse.length === 0) {
    return null;
  }

  // Contar quantos desafios foram completados por área
  const areaProgress = {};
  completedChallenges.forEach(challengeId => {
    const parts = challengeId.split('_');
    if (parts.length >= 3) {
      const area = parts[1];
      areaProgress[area] = (areaProgress[area] || 0) + 1;
    }
  });

  // Encontrar área com menos progresso (para balancear)
  let targetArea = areasInteresse[0];
  let minProgress = Infinity;
  
  areasInteresse.forEach(areaItem => {
    const area = typeof areaItem === 'object' ? areaItem.area : areaItem;
    const progress = areaProgress[area] || 0;
    if (progress < minProgress) {
      minProgress = progress;
      targetArea = areaItem;
    }
  });

  const area = typeof targetArea === 'object' ? targetArea.area : targetArea;
  const nivel = typeof targetArea === 'object' ? targetArea.nivel : 'Iniciante';

  // Encontrar próxima variação disponível
  const existingIds = generatedChallenges.map(c => c.id);
  let variation = 0;
  let challengeId = '';
  
  // Tipos de desafio em rotação
  const tipos = ['quiz', 'quiz', 'quiz']; // Por enquanto focar em quizzes
  const tipoIndex = (completedChallenges.length) % tipos.length;
  const tipo = tipos[tipoIndex];

  // Encontrar variação que ainda não foi gerada
  do {
    challengeId = `${tipo}_${area}_${nivel}_v${variation}`;
    if (!existingIds.includes(challengeId)) {
      break;
    }
    variation++;
  } while (variation < 100); // Limite de segurança

  return generateSingleChallenge(area, nivel, tipo, variation, t);
};

// Obter nível atual de uma área baseado no progresso
export const getCurrentLevelForArea = async (userId, area) => {
  try {
    const completed = await GameStorage.getCompletedChallenges(userId);
    
    // Contar desafios completados desta área
    // IDs seguem padrão: tipo_area_nivel_vX (ex: quiz_ia_Iniciante_v0)
    const areaCompleted = completed.filter(id => {
      const parts = id.split('_');
      return parts.length >= 3 && parts[1] === area;
    }).length;
    
    // Progressão: 0-3 = Iniciante, 4-7 = Intermediário, 8+ = Avançado
    if (areaCompleted < 4) {
      return 'Iniciante';
    } else if (areaCompleted < 8) {
      return 'Intermediário';
    } else {
      return 'Avançado';
    }
  } catch (error) {
    console.error('Erro ao obter nível da área:', error);
    return 'Iniciante';
  }
};

// Gerar 10 desafios para uma área específica
export const generateChallengesForArea = (area, nivel, t) => {
  const challenges = [];
  const CHALLENGES_PER_AREA = 10;
  
  // Gerar 10 desafios progressivos
  for (let i = 0; i < CHALLENGES_PER_AREA; i++) {
    // Variação do desafio (0-9)
    const variation = i;
    
    // Determinar tipo de desafio (rotacionar entre quiz, quiz, quiz para manter foco)
    const tipos = ['quiz', 'quiz', 'quiz'];
    const tipo = tipos[i % tipos.length];
    
    const challenge = generateSingleChallenge(area, nivel, tipo, variation, t);
    challenges.push(challenge);
  }

  return challenges;
};

// Perguntas para quiz de IA - Expandidas e relacionadas à área
export const getIAQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que significa a sigla IA?',
        options: ['Inteligência Artificial', 'Internet Avançada', 'Interface Automática', 'Integração Aplicada'],
        correct: 0,
      },
      {
        question: 'Qual é um exemplo prático de uso de IA no dia a dia?',
        options: ['Assistentes virtuais como Siri, Alexa e Google Assistant', 'Lâmpadas LED inteligentes', 'Cadeiras ergonômicas', 'Livros físicos'],
        correct: 0,
      },
      {
        question: 'Machine Learning (Aprendizado de Máquina) é:',
        options: ['Um subcampo da Inteligência Artificial que permite sistemas aprenderem com dados', 'Um tipo de hardware de computador', 'Uma rede social', 'Um aplicativo móvel'],
        correct: 0,
      },
      {
        question: 'O que é um chatbot?',
        options: ['Um programa de computador que simula conversas humanas usando IA', 'Um sistema de backup de dados', 'Um organizador de arquivos', 'Um editor de imagens'],
        correct: 0,
      },
      {
        question: 'Qual destas empresas é pioneira no uso de IA em seus produtos?',
        options: ['Google (com TensorFlow e Google Assistant)', 'Uma loja física tradicional', 'Uma padaria local', 'Um supermercado convencional'],
        correct: 0,
      },
      {
        question: 'O que é reconhecimento facial?',
        options: ['Tecnologia de IA que identifica pessoas em imagens', 'Sistema de iluminação', 'Tipo de câmera', 'Software de edição'],
        correct: 0,
      },
      {
        question: 'O que faz um sistema de recomendação?',
        options: ['Sugere produtos ou conteúdo baseado em preferências usando IA', 'Recomenda restaurantes', 'Sugere rotas de viagem', 'Indica horários'],
        correct: 0,
      },
      {
        question: 'O que é automação inteligente?',
        options: ['Uso de IA para automatizar tarefas que antes precisavam de humanos', 'Automação de fábricas', 'Sistemas de alarme', 'Controle remoto'],
        correct: 0,
      },
      {
        question: 'Qual é a diferença entre IA e programação tradicional?',
        options: ['IA aprende com dados, programação tradicional segue regras fixas', 'Não há diferença', 'IA é mais rápida', 'Programação tradicional é mais inteligente'],
        correct: 0,
      },
      {
        question: 'O que é processamento de linguagem natural?',
        options: ['Capacidade de computadores entenderem e processarem texto humano', 'Processamento de imagens', 'Análise de vídeos', 'Edição de áudio'],
        correct: 0,
      },
      {
        question: 'Onde a IA é mais utilizada atualmente?',
        options: ['Em assistentes virtuais, carros autônomos e sistemas de recomendação', 'Apenas em laboratórios', 'Só em filmes', 'Apenas em jogos'],
        correct: 0,
      },
      {
        question: 'O que é um algoritmo?',
        options: ['Conjunto de instruções passo a passo para resolver um problema', 'Um tipo de computador', 'Uma linguagem de programação', 'Um banco de dados'],
        correct: 0,
      },
      {
        question: 'O que significa "treinar" um modelo de IA?',
        options: ['Ensinar o modelo usando dados para que ele aprenda padrões', 'Ligar o computador', 'Instalar software', 'Configurar internet'],
        correct: 0,
      },
      {
        question: 'O que é uma rede neural?',
        options: ['Sistema inspirado no cérebro humano que processa informações', 'Rede de computadores', 'Conexão de internet', 'Sistema de segurança'],
        correct: 0,
      },
      {
        question: 'Por que a IA é importante?',
        options: ['Pode resolver problemas complexos e automatizar tarefas inteligentes', 'É apenas uma moda', 'Substitui todos os humanos', 'Não tem importância'],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é um algoritmo de Machine Learning?',
        options: [
          'Um conjunto de regras matemáticas que permite ao computador aprender padrões a partir de dados',
          'Um tipo específico de hardware de computador',
          'Uma linguagem de programação exclusiva para IA',
          'Um sistema de banco de dados relacional',
        ],
        correct: 0,
      },
      {
        question: 'Qual é a técnica fundamental usada para treinar redes neurais artificiais?',
        options: ['Backpropagation (retropropagação do erro)', 'Desenvolvimento Frontend', 'Desenvolvimento Backend', 'Consultas SQL'],
        correct: 0,
      },
      {
        question: 'O que caracteriza Deep Learning (Aprendizado Profundo)?',
        options: [
          'Uso de redes neurais com múltiplas camadas ocultas para aprender representações hierárquicas',
          'Aprendizado superficial com poucos dados de treinamento',
          'Aprendizado instantâneo sem necessidade de treinamento',
          'Aprendizado lento com alta taxa de erro',
        ],
        correct: 0,
      },
      {
        question: 'O que é NLP (Natural Language Processing)?',
        options: [
          'Campo da IA que permite computadores processarem, entenderem e gerarem linguagem humana',
          'Programação de novos sistemas operacionais',
          'Criação de interfaces gráficas de usuário',
          'Gerenciamento de bancos de dados relacionais',
        ],
        correct: 0,
      },
      {
        question: 'O que é Computer Vision (Visão Computacional)?',
        options: [
          'Campo da IA que permite máquinas interpretarem e entenderem informações visuais',
          'Tecnologia de aprimoramento da visão humana',
          'Câmeras digitais de alta resolução',
          'Monitores de alta qualidade gráfica',
        ],
        correct: 0,
      },
      {
        question: 'O que é um dataset em Machine Learning?',
        options: [
          'Conjunto de dados usado para treinar, validar ou testar um modelo',
          'Um tipo de software de análise',
          'Um banco de dados comercial',
          'Um sistema de armazenamento',
        ],
        correct: 0,
      },
      {
        question: 'O que é feature engineering?',
        options: [
          'Processo de selecionar e transformar variáveis relevantes para melhorar modelos',
          'Criação de novos hardwares',
          'Desenvolvimento de interfaces',
          'Configuração de servidores',
        ],
        correct: 0,
      },
      {
        question: 'O que é validação cruzada (cross-validation)?',
        options: [
          'Técnica para avaliar performance de modelo dividindo dados em múltiplos conjuntos',
          'Validação de documentos',
          'Verificação de identidade',
          'Teste de hardware',
        ],
        correct: 0,
      },
      {
        question: 'O que é um modelo de classificação?',
        options: [
          'Modelo que categoriza dados em classes ou categorias',
          'Modelo que apenas descreve dados',
          'Modelo que deleta dados',
          'Modelo que organiza arquivos',
        ],
        correct: 0,
      },
      {
        question: 'O que é TensorFlow?',
        options: [
          'Framework open-source do Google para Machine Learning e Deep Learning',
          'Linguagem de programação',
          'Sistema operacional',
          'Banco de dados',
        ],
        correct: 0,
      },
      {
        question: 'O que é PyTorch?',
        options: [
          'Framework de Machine Learning desenvolvido pelo Facebook',
          'Editor de texto',
          'Navegador web',
          'Sistema de arquivos',
        ],
        correct: 0,
      },
      {
        question: 'O que é um neurônio artificial?',
        options: [
          'Unidade básica de processamento em uma rede neural que recebe entradas e produz saída',
          'Célula do cérebro humano',
          'Componente de hardware',
          'Tipo de algoritmo simples',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma camada (layer) em uma rede neural?',
        options: [
          'Grupo de neurônios que processa informações em um estágio específico',
          'Camada de sistema operacional',
          'Nível de segurança',
          'Tipo de arquivo',
        ],
        correct: 0,
      },
      {
        question: 'O que é gradient descent?',
        options: [
          'Algoritmo de otimização usado para encontrar mínimo de funções de erro',
          'Descida de montanha',
          'Método de backup',
          'Técnica de compressão',
        ],
        correct: 0,
      },
      {
        question: 'O que é um modelo de regressão?',
        options: [
          'Modelo que prevê valores numéricos contínuos',
          'Modelo que apenas classifica',
          'Modelo que organiza dados',
          'Modelo que deleta informações',
        ],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'Qual é a principal diferença entre Supervised Learning e Unsupervised Learning?',
        options: [
          'Supervised Learning usa dados rotulados (com respostas conhecidas), enquanto Unsupervised Learning encontra padrões em dados não rotulados',
          'Não há diferença significativa entre os dois métodos',
          'Supervised Learning é sempre mais rápido que Unsupervised Learning',
          'Unsupervised Learning é sempre mais simples de implementar',
        ],
        correct: 0,
      },
      {
        question: 'O que caracteriza overfitting em Machine Learning?',
        options: [
          'Quando o modelo memoriza os dados de treinamento mas falha em generalizar para dados novos',
          'Quando o modelo é muito simples e não consegue aprender padrões',
          'Quando o modelo executa muito rapidamente',
          'Quando o treinamento do modelo demora muito tempo',
        ],
        correct: 0,
      },
      {
        question: 'O que é Reinforcement Learning (Aprendizado por Reforço)?',
        options: [
          'Paradigma de aprendizado onde um agente aprende através de interação com ambiente, recebendo recompensas ou punições',
          'Aprendizado baseado em repetição mecânica de tarefas',
          'Aprendizado através de cópia direta de dados',
          'Aprendizado baseado apenas em memorização',
        ],
        correct: 0,
      },
      {
        question: 'O que é Transfer Learning (Aprendizado por Transferência)?',
        options: [
          'Técnica de reutilizar conhecimento de um modelo pré-treinado em uma tarefa relacionada',
          'Transferência física de dados entre computadores',
          'Movimentação de arquivos entre diretórios',
          'Cópia de código fonte entre projetos',
        ],
        correct: 0,
      },
      {
        question: 'O que são GANs (Generative Adversarial Networks)?',
        options: [
          'Arquitetura de duas redes neurais competindo: gerador cria dados falsos e discriminador tenta identificá-los',
          'Redes de computadores fisicamente conectados',
          'Sistemas de segurança de rede corporativa',
          'Protocolos de comunicação entre dispositivos',
        ],
        correct: 0,
      },
      {
        question: 'O que é dropout em redes neurais?',
        options: [
          'Técnica de regularização que desativa aleatoriamente neurônios durante treinamento para prevenir overfitting',
          'Remoção permanente de neurônios da rede',
          'Técnica de aceleração de treinamento',
          'Método de inicialização de pesos',
        ],
        correct: 0,
      },
      {
        question: 'O que é batch normalization?',
        options: [
          'Técnica que normaliza inputs de cada camada para acelerar treinamento e melhorar estabilidade',
          'Normalização de lotes de produção',
          'Organização de dados em grupos',
          'Método de backup em lote',
        ],
        correct: 0,
      },
      {
        question: 'O que é attention mechanism?',
        options: [
          'Mecanismo que permite modelo focar em partes específicas da entrada ao processar',
          'Sistema de alertas',
          'Método de notificação',
          'Técnica de atenção do usuário',
        ],
        correct: 0,
      },
      {
        question: 'O que são transformers em Deep Learning?',
        options: [
          'Arquitetura de rede neural baseada em attention mechanism, usada em NLP e outras áreas',
          'Dispositivos que transformam energia',
          'Algoritmos de conversão de dados',
          'Sistemas de transformação de arquivos',
        ],
        correct: 0,
      },
      {
        question: 'O que é fine-tuning?',
        options: [
          'Processo de ajustar um modelo pré-treinado para uma tarefa específica',
          'Ajuste fino de hardware',
          'Calibração de instrumentos',
          'Otimização de código',
        ],
        correct: 0,
      },
      {
        question: 'O que é ensemble learning?',
        options: [
          'Técnica que combina múltiplos modelos para melhorar performance e robustez',
          'Aprendizado em grupo',
          'Treinamento coletivo',
          'Método de colaboração',
        ],
        correct: 0,
      },
      {
        question: 'O que é early stopping?',
        options: [
          'Técnica que para treinamento quando performance para de melhorar para prevenir overfitting',
          'Parada precoce de processos',
          'Interrupção de sistemas',
          'Cancelamento de operações',
        ],
        correct: 0,
      },
      {
        question: 'O que é learning rate?',
        options: [
          'Taxa que controla velocidade de aprendizado durante treinamento de modelo',
          'Velocidade de processamento',
          'Taxa de atualização',
          'Frequência de aprendizado',
        ],
        correct: 0,
      },
      {
        question: 'O que é um embedding?',
        options: [
          'Representação vetorial densa que captura significado semântico de dados',
          'Inserção de código',
          'Integração de sistemas',
          'Incorporação de arquivos',
        ],
        correct: 0,
      },
      {
        question: 'O que é BERT?',
        options: [
          'Modelo de linguagem pré-treinado que revolucionou NLP usando arquitetura transformer',
          'Tipo de algoritmo simples',
          'Framework de desenvolvimento',
          'Sistema de banco de dados',
        ],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Perguntas para quiz de Dados - Expandidas e relacionadas à área
export const getDadosQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que é Data Science (Ciência de Dados)?',
        options: [
          'Campo interdisciplinar que usa métodos científicos para extrair conhecimento e insights de dados',
          'Ciência que estuda apenas computadores físicos',
          'Ciência focada apenas em redes sociais',
          'Ciência que desenvolve hardware',
        ],
        correct: 0,
      },
      {
        question: 'Qual linguagem de programação é mais utilizada em Data Science?',
        options: ['Python com bibliotecas como Pandas, NumPy e Scikit-learn', 'Microsoft Word', 'Excel básico', 'Paint'],
        correct: 0,
      },
      {
        question: 'O que são dados estruturados?',
        options: [
          'Dados organizados em formato tabular com colunas e tipos bem definidos (ex: planilhas, bancos relacionais)',
          'Dados completamente desorganizados',
          'Dados apenas em formato de texto livre',
          'Dados exclusivamente em formato de imagens',
        ],
        correct: 0,
      },
      {
        question: 'O que é visualização de dados?',
        options: [
          'Representação gráfica de dados para facilitar compreensão e identificação de padrões',
          'Cópia de dados para outro sistema',
          'Exclusão de dados considerados antigos',
          'Criação artificial de novos dados',
        ],
        correct: 0,
      },
      {
        question: 'Qual é o objetivo principal da análise de dados?',
        options: [
          'Descobrir padrões, tendências e insights que apoiem tomadas de decisão',
          'Armazenar dados indefinidamente sem análise',
          'Deletar dados considerados antigos',
          'Apenas copiar dados para backup',
        ],
        correct: 0,
      },
      {
        question: 'O que é um banco de dados?',
        options: [
          'Sistema organizado para armazenar e gerenciar grandes volumes de dados',
          'Um tipo de planilha simples',
          'Um arquivo de texto',
          'Um programa de edição',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma planilha?',
        options: [
          'Documento com células organizadas em linhas e colunas para dados tabulares',
          'Tipo de banco de dados complexo',
          'Sistema de backup',
          'Programa de edição de imagens',
        ],
        correct: 0,
      },
      {
        question: 'O que são dados não estruturados?',
        options: [
          'Dados sem formato fixo como textos, imagens, vídeos e áudios',
          'Dados organizados em tabelas',
          'Dados apenas numéricos',
          'Dados em formato JSON',
        ],
        correct: 0,
      },
      {
        question: 'O que é análise exploratória de dados?',
        options: [
          'Processo de investigar dados para descobrir padrões e anomalias',
          'Cópia de dados para backup',
          'Exclusão de dados antigos',
          'Criação de novos dados',
        ],
        correct: 0,
      },
      {
        question: 'O que é um gráfico de barras?',
        options: [
          'Visualização que representa dados usando barras de diferentes alturas',
          'Tipo de banco de dados',
          'Método de backup',
          'Sistema de segurança',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma média?',
        options: [
          'Valor calculado somando todos os valores e dividindo pela quantidade',
          'Valor máximo de um conjunto',
          'Valor mínimo de um conjunto',
          'Valor do meio de um conjunto',
        ],
        correct: 0,
      },
      {
        question: 'O que é um outlier?',
        options: [
          'Valor que se destaca significativamente dos demais em um conjunto de dados',
          'Valor médio',
          'Valor comum',
          'Valor padrão',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma coluna em uma tabela?',
        options: [
          'Campo vertical que representa um atributo ou característica dos dados',
          'Linha horizontal',
          'Célula individual',
          'Tipo de gráfico',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma linha em uma tabela?',
        options: [
          'Registro horizontal que representa uma instância ou observação',
          'Coluna vertical',
          'Célula individual',
          'Tipo de análise',
        ],
        correct: 0,
      },
      {
        question: 'O que é um CSV?',
        options: [
          'Formato de arquivo de texto com valores separados por vírgulas',
          'Tipo de banco de dados',
          'Linguagem de programação',
          'Sistema operacional',
        ],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é um DataFrame na biblioteca Pandas?',
        options: [
          'Estrutura de dados tabular bidimensional (linhas e colunas) similar a uma planilha Excel',
          'Tipo específico de gráfico de barras',
          'Um sistema de banco de dados completo',
          'Um tipo de arquitetura de rede neural',
        ],
        correct: 0,
      },
      {
        question: 'Qual biblioteca Python é a mais popular para manipulação e análise de dados?',
        options: ['Pandas (Python Data Analysis Library)', 'React (biblioteca JavaScript)', 'Vue.js (framework JavaScript)', 'Angular (framework JavaScript)'],
        correct: 0,
      },
      {
        question: 'O que significa ETL no contexto de dados?',
        options: [
          'Extract, Transform, Load - processo de extrair dados de fontes, transformá-los e carregá-los em destino',
          'Uma linguagem de programação específica',
          'Um tipo específico de banco de dados',
          'Um framework para desenvolvimento web',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma query SQL?',
        options: [
          'Comando em linguagem SQL para consultar, inserir, atualizar ou deletar dados em banco de dados',
          'Uma pergunta formulada em português',
          'Um comando exclusivo de terminal Linux',
          'Uma função específica do JavaScript',
        ],
        correct: 0,
      },
      {
        question: 'O que caracteriza Big Data?',
        options: [
          'Grandes volumes de dados (Volume), alta velocidade (Velocity) e variedade (Variety) que requerem tecnologias especiais',
          'Dados pequenos e simples de processar',
          'Dados exclusivamente em formato de texto',
          'Apenas dados históricos antigos',
        ],
        correct: 0,
      },
      {
        question: 'O que é limpeza de dados (data cleaning)?',
        options: [
          'Processo de identificar e corrigir erros, inconsistências e valores ausentes em datasets',
          'Deletar todos os dados antigos',
          'Organizar arquivos em pastas',
          'Criptografar dados',
        ],
        correct: 0,
      },
      {
        question: 'O que é NumPy?',
        options: [
          'Biblioteca Python para computação numérica e arrays multidimensionais',
          'Framework web',
          'Banco de dados',
          'Editor de texto',
        ],
        correct: 0,
      },
      {
        question: 'O que é Matplotlib?',
        options: [
          'Biblioteca Python para criação de gráficos e visualizações',
          'Sistema de banco de dados',
          'Framework de desenvolvimento',
          'Linguagem de programação',
        ],
        correct: 0,
      },
      {
        question: 'O que é um histograma?',
        options: [
          'Gráfico que mostra distribuição de frequências de valores em intervalos',
          'Tipo de tabela',
          'Método de backup',
          'Sistema de segurança',
        ],
        correct: 0,
      },
      {
        question: 'O que é correlação?',
        options: [
          'Medida de relação entre duas variáveis',
          'Conexão de internet',
          'Método de backup',
          'Tipo de gráfico',
        ],
        correct: 0,
      },
      {
        question: 'O que é um scatter plot?',
        options: [
          'Gráfico de dispersão que mostra relação entre duas variáveis',
          'Tipo de tabela',
          'Método de análise',
          'Sistema de dados',
        ],
        correct: 0,
      },
      {
        question: 'O que é SQL?',
        options: [
          'Linguagem de consulta estruturada para bancos de dados relacionais',
          'Tipo de banco de dados',
          'Framework web',
          'Editor de código',
        ],
        correct: 0,
      },
      {
        question: 'O que é um JOIN em SQL?',
        options: [
          'Operação que combina dados de múltiplas tabelas baseado em relacionamento',
          'Método de backup',
          'Tipo de gráfico',
          'Sistema de segurança',
        ],
        correct: 0,
      },
      {
        question: 'O que é agregação de dados?',
        options: [
          'Processo de resumir dados usando funções como soma, média, contagem',
          'Cópia de dados',
          'Exclusão de dados',
          'Criação de dados',
        ],
        correct: 0,
      },
      {
        question: 'O que é um pivot table?',
        options: [
          'Tabela dinâmica que reorganiza e resume dados de forma cruzada',
          'Tipo de banco de dados',
          'Método de backup',
          'Sistema de arquivos',
        ],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'O que é Feature Engineering (Engenharia de Features)?',
        options: [
          'Processo de criar, selecionar e transformar variáveis (features) para melhorar performance de modelos de ML',
          'Criação de visualizações gráficas atraentes',
          'Desenvolvimento de novos sistemas de banco de dados',
          'Configuração de redes de computadores',
        ],
        correct: 0,
      },
      {
        question: 'O que é Data Mining (Mineração de Dados)?',
        options: [
          'Processo de descobrir padrões, correlações e anomalias em grandes volumes de dados usando técnicas estatísticas e ML',
          'Escavação física de servidores de dados',
          'Deleção sistemática de dados considerados antigos',
          'Cópia simples de dados entre sistemas diferentes',
        ],
        correct: 0,
      },
      {
        question: 'O que caracteriza um modelo preditivo?',
        options: [
          'Modelo que utiliza dados históricos para fazer previsões sobre eventos ou comportamentos futuros',
          'Modelo que apenas descreve estatisticamente dados do passado',
          'Modelo que apenas organiza dados em categorias',
          'Modelo que remove dados considerados irrelevantes',
        ],
        correct: 0,
      },
      {
        question: 'O que é A/B Testing (Teste A/B)?',
        options: [
          'Metodologia de experimentação que compara duas versões (A e B) para determinar qual performa melhor',
          'Teste de velocidade de conexão de internet',
          'Teste de componentes de hardware',
          'Teste básico de funcionalidades de software',
        ],
        correct: 0,
      },
      {
        question: 'O que é Data Warehousing?',
        options: [
          'Arquitetura de armazenamento centralizado de dados históricos otimizada para análise e business intelligence',
          'Processo de deletar dados considerados antigos',
          'Cópia simples de dados para fins de backup',
          'Organização básica de arquivos em diretórios',
        ],
        correct: 0,
      },
      {
        question: 'O que é normalização de dados?',
        options: [
          'Processo de padronizar dados para escala comum, removendo redundâncias e inconsistências',
          'Deletar dados duplicados',
          'Organizar dados alfabeticamente',
          'Criptografar todos os dados',
        ],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Perguntas para quiz de Programação - Expandidas e relacionadas à área
export const getProgramacaoQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que é uma variável em programação?',
        options: [
          'Um espaço nomeado na memória do computador usado para armazenar dados que podem ser modificados',
          'Um tipo específico de função',
          'Um tipo específico de loop',
          'Um tipo específico de erro',
        ],
        correct: 0,
      },
      {
        question: 'O que faz um loop (estrutura de repetição)?',
        options: [
          'Executa um bloco de código repetidamente enquanto uma condição for verdadeira',
          'Para completamente a execução do programa',
          'Inicia o programa pela primeira vez',
          'Salva automaticamente o código em arquivo',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma estrutura condicional (if/else)?',
        options: [
          'Estrutura que executa diferentes blocos de código baseado em condições verdadeiras ou falsas',
          'Um tipo especial de variável',
          'Um tipo específico de loop',
          'Um tipo específico de função',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma string em programação?',
        options: [
          'Tipo de dado que representa uma sequência de caracteres (texto)',
          'Um número inteiro positivo',
          'Um número decimal (ponto flutuante)',
          'Um valor booleano (verdadeiro ou falso)',
        ],
        correct: 0,
      },
      {
        question: 'O que é um array (ou lista) em programação?',
        options: [
          'Estrutura de dados que armazena uma coleção ordenada de elementos do mesmo ou diferentes tipos',
          'Um único valor simples',
          'Uma função específica',
          'Um tipo de erro de programação',
        ],
        correct: 0,
      },
      {
        question: 'O que é um algoritmo?',
        options: [
          'Sequência lógica de passos para resolver um problema',
          'Um tipo de variável',
          'Um erro no código',
          'Um arquivo de texto',
        ],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é uma função em programação?',
        options: [
          'Bloco de código nomeado e reutilizável que recebe parâmetros, executa uma tarefa e pode retornar um valor',
          'Um tipo específico de variável',
          'Um tipo de dado primitivo básico',
          'Um tipo específico de erro',
        ],
        correct: 0,
      },
      {
        question: 'O que é recursão em programação?',
        options: [
          'Técnica onde uma função chama a si mesma para resolver problemas dividindo-os em subproblemas menores',
          'Função que não executa nenhuma ação',
          'Função que executa apenas uma única vez',
          'Função que sempre retorna um erro',
        ],
        correct: 0,
      },
      {
        question: 'O que é um objeto em Programação Orientada a Objetos (POO)?',
        options: [
          'Instância de uma classe que encapsula dados (atributos) e comportamentos (métodos)',
          'Um tipo simples de variável primitiva',
          'Um tipo específico de estrutura de loop',
          'Um tipo específico de erro de compilação',
        ],
        correct: 0,
      },
      {
        question: 'O que é uma API (Application Programming Interface)?',
        options: [
          'Conjunto de protocolos e ferramentas que permite comunicação e integração entre diferentes sistemas de software',
          'Um tipo específico de banco de dados relacional',
          'Uma linguagem de programação específica',
          'Um framework exclusivo para desenvolvimento web',
        ],
        correct: 0,
      },
      {
        question: 'O que é Git?',
        options: [
          'Sistema de controle de versão distribuído usado para rastrear mudanças em código-fonte durante desenvolvimento',
          'Uma linguagem de programação moderna',
          'Um framework para desenvolvimento web',
          'Um sistema de banco de dados NoSQL',
        ],
        correct: 0,
      },
      {
        question: 'O que é um framework?',
        options: [
          'Estrutura de código pré-construída que fornece base para desenvolvimento de aplicações',
          'Um tipo de variável',
          'Um erro de programação',
          'Um arquivo de configuração',
        ],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'O que é um Design Pattern (Padrão de Projeto)?',
        options: [
          'Solução reutilizável e testada para problemas recorrentes de design de software',
          'Um tipo avançado de variável',
          'Um tipo complexo de função',
          'Um tipo específico de erro de runtime',
        ],
        correct: 0,
      },
      {
        question: 'O que é programação assíncrona?',
        options: [
          'Paradigma que permite execução de operações sem bloquear o thread principal, melhorando performance',
          'Execução sequencial obrigatória de código',
          'Execução de código apenas uma única vez',
          'Execução de código sem retorno de valores',
        ],
        correct: 0,
      },
      {
        question: 'O que é Test-Driven Development (TDD)?',
        options: [
          'Metodologia de desenvolvimento onde testes são escritos antes do código de produção (Red-Green-Refactor)',
          'Desenvolvimento sem uso de testes automatizados',
          'Desenvolvimento usando apenas testes manuais',
          'Desenvolvimento onde testes são escritos apenas no final do projeto',
        ],
        correct: 0,
      },
      {
        question: 'O que é refatoração de código?',
        options: [
          'Processo de melhorar estrutura e legibilidade do código sem alterar seu comportamento funcional',
          'Adicionar novas funcionalidades ao código existente',
          'Deletar código considerado antigo ou desnecessário',
          'Copiar código de outros projetos sem modificação',
        ],
        correct: 0,
      },
      {
        question: 'O que são os princípios SOLID?',
        options: [
          'Cinco princípios fundamentais de design orientado a objetos: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion',
          'Uma linguagem de programação específica',
          'Um framework JavaScript moderno',
          'Um sistema de banco de dados NoSQL',
        ],
        correct: 0,
      },
      {
        question: 'O que é complexidade algorítmica (Big O)?',
        options: [
          'Notação matemática que descreve eficiência de algoritmos em termos de tempo e espaço',
          'Tipo de variável complexa',
          'Erro de complexidade no código',
          'Sistema de organização de arquivos',
        ],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Perguntas para quiz de Marketing - Relacionadas à área
export const getMarketingQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que é Marketing Digital?',
        options: [
          'Promoção de produtos e serviços através de canais digitais',
          'Venda física em lojas',
          'Produção de produtos',
          'Gestão de estoque',
        ],
        correct: 0,
      },
      {
        question: 'O que é SEO?',
        options: [
          'Otimização para mecanismos de busca',
          'Sistema de estoque online',
          'Software de edição',
          'Servidor de email',
        ],
        correct: 0,
      },
      {
        question: 'O que são redes sociais no marketing?',
        options: [
          'Plataformas para conectar e engajar com público',
          'Redes de computadores',
          'Sistemas de backup',
          'Bancos de dados',
        ],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é Inbound Marketing?',
        options: [
          'Estratégia de atrair clientes com conteúdo relevante',
          'Marketing agressivo de vendas',
          'Publicidade em TV',
          'Vendas porta a porta',
        ],
        correct: 0,
      },
      {
        question: 'O que é funil de vendas?',
        options: [
          'Jornada do cliente desde o conhecimento até a compra',
          'Processo de produção',
          'Sistema de estoque',
          'Método de pagamento',
        ],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'O que é Marketing Automation?',
        options: [
          'Automação de tarefas de marketing com tecnologia',
          'Marketing manual',
          'Vendas pessoais',
          'Publicidade tradicional',
        ],
        correct: 0,
      },
      {
        question: 'O que é Customer Lifetime Value (CLV)?',
        options: [
          'Valor total que cliente gera durante relacionamento com empresa',
          'Valor de primeira compra',
          'Custo de aquisição',
          'Valor de estoque',
        ],
        correct: 0,
      },
      {
        question: 'O que é attribution modeling?',
        options: [
          'Método de atribuir conversões a diferentes pontos de contato no funil',
          'Modelagem de produtos',
          'Criação de campanhas',
          'Análise de concorrência',
        ],
        correct: 0,
      },
      {
        question: 'O que é growth hacking?',
        options: [
          'Metodologia de crescimento rápido usando experimentação e dados',
          'Hackear sistemas',
          'Marketing tradicional',
          'Vendas agressivas',
        ],
        correct: 0,
      },
      {
        question: 'O que é AARRR (Pirate Metrics)?',
        options: [
          'Framework: Acquisition, Activation, Retention, Revenue, Referral',
          'Tipo de gráfico',
          'Método de backup',
          'Sistema de segurança',
        ],
        correct: 0,
      },
      {
        question: 'O que é content marketing?',
        options: [
          'Estratégia de criar e distribuir conteúdo valioso para atrair audiência',
          'Venda de conteúdo',
          'Produção de anúncios',
          'Marketing de produtos',
        ],
        correct: 0,
      },
      {
        question: 'O que é SEO (Search Engine Optimization)?',
        options: [
          'Otimização para melhorar ranking em mecanismos de busca',
          'Criação de sites',
          'Design de interfaces',
          'Desenvolvimento de apps',
        ],
        correct: 0,
      },
      {
        question: 'O que é remarketing?',
        options: [
          'Estratégia de reengajar visitantes que não converteram',
          'Criação de novos produtos',
          'Marketing inicial',
          'Vendas diretas',
        ],
        correct: 0,
      },
      {
        question: 'O que é marketing de influência?',
        options: [
          'Estratégia de usar influenciadores para promover produtos',
          'Marketing interno',
          'Vendas pessoais',
          'Publicidade tradicional',
        ],
        correct: 0,
      },
      {
        question: 'O que é customer journey mapping?',
        options: [
          'Mapeamento de experiência do cliente em todos os pontos de contato',
          'Criação de rotas',
          'Análise de tráfego',
          'Design de produtos',
        ],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Perguntas para quiz de Gestão - Relacionadas à área
export const getGestaoQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que é gestão?',
        options: [
          'Processo de coordenar recursos para atingir objetivos',
          'Venda de produtos',
          'Produção de bens',
          'Controle de qualidade',
        ],
        correct: 0,
      },
      {
        question: 'O que é planejamento estratégico?',
        options: [
          'Definir objetivos de longo prazo e como alcançá-los',
          'Vender produtos',
          'Contratar funcionários',
          'Fazer relatórios',
        ],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é gestão de equipes?',
        options: [
          'Liderar e coordenar pessoas para resultados',
          'Vender produtos',
          'Produzir bens',
          'Controlar estoque',
        ],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'O que é gestão de mudança organizacional?',
        options: [
          'Processo de gerenciar transições na organização',
          'Venda de novos produtos',
          'Contratação de pessoal',
          'Mudança de local',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão estratégica?',
        options: [
          'Processo de definir e executar estratégias de longo prazo',
          'Gestão diária',
          'Controle de estoque',
          'Vendas operacionais',
        ],
        correct: 0,
      },
      {
        question: 'O que é balanced scorecard?',
        options: [
          'Framework de gestão que equilibra métricas financeiras e não financeiras',
          'Tipo de gráfico',
          'Método de backup',
          'Sistema de segurança',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão de riscos?',
        options: [
          'Processo de identificar, avaliar e mitigar riscos organizacionais',
          'Eliminação de riscos',
          'Ignorar riscos',
          'Aceitar todos os riscos',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão de stakeholders?',
        options: [
          'Processo de gerenciar relacionamentos com partes interessadas',
          'Gestão de funcionários',
          'Controle de estoque',
          'Vendas diretas',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão de portfólio?',
        options: [
          'Gestão coordenada de múltiplos projetos ou produtos',
          'Gestão de um único projeto',
          'Controle financeiro',
          'Gestão de pessoal',
        ],
        correct: 0,
      },
      {
        question: 'O que é OKR (Objectives and Key Results)?',
        options: [
          'Framework de definição de objetivos e resultados-chave mensuráveis',
          'Tipo de gráfico',
          'Método de backup',
          'Sistema de segurança',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão ágil?',
        options: [
          'Metodologia de gestão adaptativa e iterativa',
          'Gestão rápida',
          'Gestão tradicional',
          'Gestão centralizada',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão de conhecimento?',
        options: [
          'Processo de capturar, organizar e compartilhar conhecimento organizacional',
          'Gestão de documentos',
          'Controle de arquivos',
          'Backup de dados',
        ],
        correct: 0,
      },
      {
        question: 'O que é gestão de inovação?',
        options: [
          'Processo de gerenciar criação e implementação de inovações',
          'Criação de produtos',
          'Vendas de novos produtos',
          'Marketing de inovação',
        ],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Obter perguntas baseado na área e variação do desafio
// Cada desafio (variation 0-9) terá perguntas diferentes
export const getQuizQuestions = (area, nivel, variation = 0) => {
  // Obter todas as perguntas disponíveis para a área e nível
  let allQuestions = [];
  
  switch (area) {
    case 'ia':
      allQuestions = getIAQuizQuestions(nivel);
      break;
    case 'dados':
      allQuestions = getDadosQuizQuestions(nivel);
      break;
    case 'programacao':
      allQuestions = getProgramacaoQuizQuestions(nivel);
      break;
    case 'marketing':
      allQuestions = getMarketingQuizQuestions(nivel);
      break;
    case 'gestao':
      allQuestions = getGestaoQuizQuestions(nivel);
      break;
    default:
      allQuestions = getIAQuizQuestions(nivel);
      break;
  }
  
  // Se não há perguntas suficientes, retornar todas disponíveis
  if (allQuestions.length === 0) {
    return [];
  }
  
  // Selecionar 5 perguntas diferentes baseado na variação
  // Usar variação como offset para garantir perguntas diferentes
  const questionsPerChallenge = 5;
  const startIndex = (variation * questionsPerChallenge) % allQuestions.length;
  
  // Selecionar perguntas de forma circular
  const selectedQuestions = [];
  for (let i = 0; i < questionsPerChallenge; i++) {
    const index = (startIndex + i) % allQuestions.length;
    selectedQuestions.push(allQuestions[index]);
  }
  
  return selectedQuestions;
};

