// Serviço para gerar desafios baseados nas áreas de interesse do usuário

export const generateChallenges = (areasInteresse, t) => {
  const challenges = [];

  // Mapear áreas para desafios
  areasInteresse.forEach((areaItem) => {
    const area = typeof areaItem === 'object' ? areaItem.area : areaItem;
    const nivel = typeof areaItem === 'object' ? areaItem.nivel : 'Iniciante';

    switch (area) {
      case 'ia':
        challenges.push({
          id: `quiz_ia_${nivel}`,
          tipo: 'quiz',
          area: 'ia',
          nivel: nivel,
          titulo: t('desafioQuizIA'),
          descricao: t('desafioQuizIADesc'),
          pontos: nivel === 'Iniciante' ? 200 : nivel === 'Intermediário' ? 400 : 600,
          icone: '🤖',
          dificuldade: nivel,
        });
        challenges.push({
          id: `memoria_ia_${nivel}`,
          tipo: 'memoria',
          area: 'ia',
          nivel: nivel,
          titulo: t('desafioMemoriaIA'),
          descricao: t('desafioMemoriaIADesc'),
          pontos: nivel === 'Iniciante' ? 150 : nivel === 'Intermediário' ? 300 : 450,
          icone: '🧠',
          dificuldade: nivel,
        });
        break;

      case 'dados':
        challenges.push({
          id: `quiz_dados_${nivel}`,
          tipo: 'quiz',
          area: 'dados',
          nivel: nivel,
          titulo: t('desafioQuizDados'),
          descricao: t('desafioQuizDadosDesc'),
          pontos: nivel === 'Iniciante' ? 200 : nivel === 'Intermediário' ? 400 : 600,
          icone: '📊',
          dificuldade: nivel,
        });
        challenges.push({
          id: `logica_dados_${nivel}`,
          tipo: 'logica',
          area: 'dados',
          nivel: nivel,
          titulo: t('desafioLogicaDados'),
          descricao: t('desafioLogicaDadosDesc'),
          pontos: nivel === 'Iniciante' ? 250 : nivel === 'Intermediário' ? 500 : 750,
          icone: '🔢',
          dificuldade: nivel,
        });
        break;

      case 'programacao':
        challenges.push({
          id: `quiz_programacao_${nivel}`,
          tipo: 'quiz',
          area: 'programacao',
          nivel: nivel,
          titulo: t('desafioQuizProgramacao'),
          descricao: t('desafioQuizProgramacaoDesc'),
          pontos: nivel === 'Iniciante' ? 200 : nivel === 'Intermediário' ? 400 : 600,
          icone: '💻',
          dificuldade: nivel,
        });
        challenges.push({
          id: `codigo_programacao_${nivel}`,
          tipo: 'codigo',
          area: 'programacao',
          nivel: nivel,
          titulo: t('desafioCodigoProgramacao'),
          descricao: t('desafioCodigoProgramacaoDesc'),
          pontos: nivel === 'Iniciante' ? 300 : nivel === 'Intermediário' ? 600 : 900,
          icone: '⌨️',
          dificuldade: nivel,
        });
        break;

      default:
        // Desafios genéricos para outras áreas
        challenges.push({
          id: `quiz_${area}_${nivel}`,
          tipo: 'quiz',
          area: area,
          nivel: nivel,
          titulo: `${t('desafioQuiz')} - ${t(area)}`,
          descricao: t('desafioQuizDesc'),
          pontos: nivel === 'Iniciante' ? 200 : nivel === 'Intermediário' ? 400 : 600,
          icone: '📚',
          dificuldade: nivel,
        });
        break;
    }
  });

  return challenges;
};

// Perguntas para quiz de IA
export const getIAQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que significa IA?',
        options: ['Inteligência Artificial', 'Internet Avançada', 'Interface Automática', 'Integração Aplicada'],
        correct: 0,
      },
      {
        question: 'Qual é um exemplo de uso de IA no dia a dia?',
        options: ['Assistentes virtuais', 'Lâmpadas', 'Cadeiras', 'Livros'],
        correct: 0,
      },
      {
        question: 'Machine Learning é um tipo de:',
        options: ['IA', 'Hardware', 'Rede social', 'Aplicativo'],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é um algoritmo de Machine Learning?',
        options: [
          'Um conjunto de regras que permite ao computador aprender',
          'Um tipo de hardware',
          'Uma linguagem de programação',
          'Um banco de dados',
        ],
        correct: 0,
      },
      {
        question: 'Qual técnica é usada para treinar redes neurais?',
        options: ['Backpropagation', 'Frontend', 'Backend', 'Database'],
        correct: 0,
      },
      {
        question: 'O que é Deep Learning?',
        options: [
          'Aprendizado profundo usando múltiplas camadas',
          'Aprendizado superficial',
          'Aprendizado rápido',
          'Aprendizado lento',
        ],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'Qual é a diferença entre supervised e unsupervised learning?',
        options: [
          'Supervised usa dados rotulados, unsupervised não',
          'Não há diferença',
          'Supervised é mais rápido',
          'Unsupervised é mais simples',
        ],
        correct: 0,
      },
      {
        question: 'O que é overfitting em Machine Learning?',
        options: [
          'Modelo que memoriza os dados de treino',
          'Modelo muito simples',
          'Modelo muito rápido',
          'Modelo muito lento',
        ],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Perguntas para quiz de Dados
export const getDadosQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que é Data Science?',
        options: ['Ciência que extrai conhecimento de dados', 'Ciência de computadores', 'Ciência de redes', 'Ciência de hardware'],
        correct: 0,
      },
      {
        question: 'Qual ferramenta é comum em Data Science?',
        options: ['Python', 'Word', 'Excel básico', 'Paint'],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é um DataFrame?',
        options: ['Estrutura de dados tabular', 'Tipo de gráfico', 'Tipo de banco', 'Tipo de rede'],
        correct: 0,
      },
      {
        question: 'Qual biblioteca Python é usada para análise de dados?',
        options: ['Pandas', 'React', 'Vue', 'Angular'],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'O que é feature engineering?',
        options: ['Criação de variáveis relevantes', 'Criação de gráficos', 'Criação de bancos', 'Criação de redes'],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Perguntas para quiz de Programação
export const getProgramacaoQuizQuestions = (nivel) => {
  const questions = {
    Iniciante: [
      {
        question: 'O que é uma variável?',
        options: ['Um espaço para armazenar dados', 'Um tipo de função', 'Um tipo de loop', 'Um tipo de erro'],
        correct: 0,
      },
      {
        question: 'O que faz um loop?',
        options: ['Repete código várias vezes', 'Para o código', 'Inicia o código', 'Salva o código'],
        correct: 0,
      },
    ],
    Intermediário: [
      {
        question: 'O que é uma função?',
        options: ['Bloco de código reutilizável', 'Tipo de variável', 'Tipo de dado', 'Tipo de erro'],
        correct: 0,
      },
      {
        question: 'O que é recursão?',
        options: ['Função que chama a si mesma', 'Função que não faz nada', 'Função que só executa uma vez', 'Função que sempre falha'],
        correct: 0,
      },
    ],
    Avançado: [
      {
        question: 'O que é um design pattern?',
        options: ['Solução reutilizável para problemas comuns', 'Tipo de variável', 'Tipo de função', 'Tipo de erro'],
        correct: 0,
      },
    ],
  };
  return questions[nivel] || questions.Iniciante;
};

// Obter perguntas baseado na área
export const getQuizQuestions = (area, nivel) => {
  switch (area) {
    case 'ia':
      return getIAQuizQuestions(nivel);
    case 'dados':
      return getDadosQuizQuestions(nivel);
    case 'programacao':
      return getProgramacaoQuizQuestions(nivel);
    default:
      return getIAQuizQuestions('Iniciante');
  }
};

