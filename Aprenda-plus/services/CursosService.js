// Base de dados de cursos (simulação - em produção viria de uma API)
export const CURSOS = [
  // Inteligência Artificial
  {
    id: '1',
    titulo: 'Introdução à Inteligência Artificial',
    descricao: 'Aprenda os fundamentos da IA e machine learning',
    area: 'ia',
    duracao: '40 horas',
    nivel: 'Iniciante',
    icone: '🤖',
  },
  {
    id: '2',
    titulo: 'ChatGPT e IA Generativa',
    descricao: 'Domine o uso de ferramentas de IA generativa',
    area: 'ia',
    duracao: '20 horas',
    nivel: 'Intermediário',
    icone: '💬',
  },
  {
    id: '3',
    titulo: 'Machine Learning Prático',
    descricao: 'Implemente modelos de ML do zero',
    area: 'ia',
    duracao: '60 horas',
    nivel: 'Avançado',
    icone: '🧠',
  },
  // Ciência de Dados
  {
    id: '4',
    titulo: 'Análise de Dados com Python',
    descricao: 'Aprenda a analisar dados usando Python e pandas',
    area: 'dados',
    duracao: '50 horas',
    nivel: 'Iniciante',
    icone: '📊',
  },
  {
    id: '5',
    titulo: 'Visualização de Dados',
    descricao: 'Crie dashboards e visualizações impactantes',
    area: 'dados',
    duracao: '30 horas',
    nivel: 'Intermediário',
    icone: '📈',
  },
  {
    id: '6',
    titulo: 'Big Data e Data Science',
    descricao: 'Trabalhe com grandes volumes de dados',
    area: 'dados',
    duracao: '70 horas',
    nivel: 'Avançado',
    icone: '💾',
  },
  // Sustentabilidade
  {
    id: '7',
    titulo: 'Sustentabilidade Empresarial',
    descricao: 'Implemente práticas sustentáveis nas empresas',
    area: 'sustentabilidade',
    duracao: '35 horas',
    nivel: 'Iniciante',
    icone: '🌱',
  },
  {
    id: '8',
    titulo: 'Energias Renováveis',
    descricao: 'Conheça as principais fontes de energia limpa',
    area: 'sustentabilidade',
    duracao: '45 horas',
    nivel: 'Intermediário',
    icone: '⚡',
  },
  {
    id: '9',
    titulo: 'Economia Circular',
    descricao: 'Aprenda sobre modelos de negócio sustentáveis',
    area: 'sustentabilidade',
    duracao: '25 horas',
    nivel: 'Intermediário',
    icone: '♻️',
  },
  // Programação
  {
    id: '10',
    titulo: 'JavaScript do Zero',
    descricao: 'Aprenda programação web com JavaScript',
    area: 'programacao',
    duracao: '80 horas',
    nivel: 'Iniciante',
    icone: '💻',
  },
  {
    id: '11',
    titulo: 'React Native para Mobile',
    descricao: 'Desenvolva apps mobile com React Native',
    area: 'programacao',
    duracao: '60 horas',
    nivel: 'Intermediário',
    icone: '📱',
  },
  {
    id: '12',
    titulo: 'Python Avançado',
    descricao: 'Domine recursos avançados do Python',
    area: 'programacao',
    duracao: '50 horas',
    nivel: 'Avançado',
    icone: '🐍',
  },
  // Design
  {
    id: '13',
    titulo: 'UI/UX Design',
    descricao: 'Crie interfaces bonitas e funcionais',
    area: 'design',
    duracao: '40 horas',
    nivel: 'Iniciante',
    icone: '🎨',
  },
  {
    id: '14',
    titulo: 'Figma Avançado',
    descricao: 'Domine todas as ferramentas do Figma',
    area: 'design',
    duracao: '30 horas',
    nivel: 'Intermediário',
    icone: '✏️',
  },
  // Marketing Digital
  {
    id: '15',
    titulo: 'Marketing de Conteúdo',
    descricao: 'Crie estratégias de conteúdo eficazes',
    area: 'marketing',
    duracao: '35 horas',
    nivel: 'Iniciante',
    icone: '📱',
  },
  {
    id: '16',
    titulo: 'Google Ads e SEO',
    descricao: 'Aprenda a fazer campanhas de sucesso',
    area: 'marketing',
    duracao: '45 horas',
    nivel: 'Intermediário',
    icone: '🔍',
  },
  // Gestão
  {
    id: '17',
    titulo: 'Gestão de Projetos',
    descricao: 'Metodologias ágeis e gestão de equipes',
    area: 'gestao',
    duracao: '50 horas',
    nivel: 'Intermediário',
    icone: '📈',
  },
  {
    id: '18',
    titulo: 'Liderança e Coaching',
    descricao: 'Desenvolva habilidades de liderança',
    area: 'gestao',
    duracao: '40 horas',
    nivel: 'Intermediário',
    icone: '👔',
  },
  // Vendas
  {
    id: '19',
    titulo: 'Vendas Consultivas',
    descricao: 'Técnicas avançadas de vendas',
    area: 'vendas',
    duracao: '30 horas',
    nivel: 'Intermediário',
    icone: '💼',
  },
  // Recursos Humanos
  {
    id: '20',
    titulo: 'Recrutamento e Seleção',
    descricao: 'Processos modernos de RH',
    area: 'rh',
    duracao: '35 horas',
    nivel: 'Iniciante',
    icone: '👥',
  },
  // Finanças
  {
    id: '21',
    titulo: 'Educação Financeira',
    descricao: 'Gerencie suas finanças pessoais',
    area: 'financas',
    duracao: '25 horas',
    nivel: 'Iniciante',
    icone: '💰',
  },
  {
    id: '22',
    titulo: 'Análise Financeira',
    descricao: 'Análise de balanços e indicadores',
    area: 'financas',
    duracao: '50 horas',
    nivel: 'Avançado',
    icone: '📊',
  },
  // Saúde
  {
    id: '23',
    titulo: 'Saúde Mental no Trabalho',
    descricao: 'Promova bem-estar nas organizações',
    area: 'saude',
    duracao: '20 horas',
    nivel: 'Iniciante',
    icone: '🏥',
  },
  // Educação
  {
    id: '24',
    titulo: 'Metodologias Ativas',
    descricao: 'Técnicas modernas de ensino',
    area: 'educacao',
    duracao: '40 horas',
    nivel: 'Intermediário',
    icone: '📚',
  },
];

// Função para obter cursos sugeridos baseados nas áreas de interesse e níveis
export const getCursosSugeridos = (areasInteresse) => {
  if (!areasInteresse || areasInteresse.length === 0) {
    return [];
  }

  let cursosFiltrados = [];

  // Verificar se é formato novo (com níveis) ou antigo (apenas IDs)
  const isFormatoNovo = Array.isArray(areasInteresse) && 
    areasInteresse.length > 0 && 
    typeof areasInteresse[0] === 'object' && 
    areasInteresse[0].area;

  if (isFormatoNovo) {
    // Formato novo: [{area: 'ia', nivel: 'Iniciante'}, ...]
    areasInteresse.forEach(({ area, nivel }) => {
      const cursosDaArea = CURSOS.filter(
        (curso) => curso.area === area && curso.nivel === nivel
      );
      cursosFiltrados = [...cursosFiltrados, ...cursosDaArea];
    });
  } else {
    // Formato antigo: ['ia', 'dados', ...] (compatibilidade)
    cursosFiltrados = CURSOS.filter((curso) =>
      areasInteresse.includes(curso.area)
    );
  }

  // Limitar a 6 cursos sugeridos (2 por área, se tiver 3 áreas)
  return cursosFiltrados.slice(0, 6);
};

// Função para obter todos os cursos de uma área específica
export const getCursosPorArea = (area) => {
  return CURSOS.filter((curso) => curso.area === area);
};

