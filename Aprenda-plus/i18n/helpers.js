// Helper para obter áreas de interesse traduzidas
export const getAreasInteresse = (t) => [
  { id: 'ia', name: t('ia'), icon: '🤖' },
  { id: 'dados', name: t('dados'), icon: '📊' },
  { id: 'sustentabilidade', name: t('sustentabilidade'), icon: '🌱' },
  { id: 'programacao', name: t('programacao'), icon: '💻' },
  { id: 'design', name: t('design'), icon: '🎨' },
  { id: 'marketing', name: t('marketing'), icon: '📱' },
  { id: 'gestao', name: t('gestao'), icon: '📈' },
  { id: 'vendas', name: t('vendas'), icon: '💼' },
  { id: 'rh', name: t('rh'), icon: '👥' },
  { id: 'financas', name: t('financas'), icon: '💰' },
  { id: 'saude', name: t('saude'), icon: '🏥' },
  { id: 'educacao', name: t('educacao'), icon: '📚' },
];

// Helper para obter níveis traduzidos
export const getNiveis = (t) => [
  { id: 'Iniciante', name: t('iniciante'), descricao: t('inicianteDesc'), icon: '🌱' },
  { id: 'Intermediário', name: t('intermediario'), descricao: t('intermediarioDesc'), icon: '📚' },
  { id: 'Avançado', name: t('avancado'), descricao: t('avancadoDesc'), icon: '🚀' },
];

// Helper para obter nomes de áreas traduzidos
export const getAreasNames = (t) => ({
  ia: t('ia'),
  dados: t('dados'),
  sustentabilidade: t('sustentabilidade'),
  programacao: t('programacao'),
  design: t('design'),
  marketing: t('marketing'),
  gestao: t('gestao'),
  vendas: t('vendas'),
  rh: t('rh'),
  financas: t('financas'),
  saude: t('saude'),
  educacao: t('educacao'),
});

