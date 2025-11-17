// Sistema de Cores - Design Tokens
// Baseado nas guidelines da Apple (Human Interface Guidelines) e Google (Material Design)

export const colors = {
  // Cores Primárias
  primary: '#007AFF', // Azul iOS - cor principal de ação
  primaryDark: '#0051D5',
  primaryLight: '#5AC8FA',
  
  // Cores Secundárias
  secondary: '#A660DB', // Roxo - cor de destaque
  secondaryDark: '#7B3FA3',
  secondaryLight: '#C88FE8',
  
  // Cores de Fundo
  background: '#0a0e27', // Azul escuro - fundo principal
  backgroundCard: 'rgba(255, 255, 255, 0.1)', // Cards com blur
  backgroundCardLight: 'rgba(255, 255, 255, 0.15)',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  
  // Cores de Texto
  textPrimary: '#E0EEFF', // Texto principal (branco azulado)
  textSecondary: '#B0B0B0', // Texto secundário (cinza claro)
  textTertiary: '#8E8E93', // Texto terciário (cinza médio)
  textInverse: '#000000', // Texto em fundo claro
  
  // Cores de Status
  success: '#4CAF50', // Verde - sucesso
  successLight: 'rgba(76, 175, 80, 0.2)',
  error: '#FF3B30', // Vermelho - erro
  errorLight: 'rgba(255, 59, 48, 0.2)',
  warning: '#FFA500', // Laranja - aviso
  warningLight: 'rgba(255, 165, 0, 0.2)',
  info: '#007AFF', // Azul - informação
  infoLight: 'rgba(0, 122, 255, 0.2)',
  
  // Cores de Destaque
  accent: '#FFD700', // Dourado - pontos/troféus
  accentLight: 'rgba(255, 215, 0, 0.2)',
  
  // Cores de Borda
  border: 'rgba(255, 255, 255, 0.2)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderDark: 'rgba(255, 255, 255, 0.3)',
  
  // Cores de Botão
  buttonPrimary: '#007AFF',
  buttonPrimaryDisabled: 'rgba(0, 122, 255, 0.5)',
  buttonSecondary: '#A660DB',
  buttonDanger: '#FF3B30',
  buttonText: '#FFFFFF',
  
  // Cores de Input
  inputBackground: 'rgba(255, 255, 255, 0.15)',
  inputBorder: 'rgba(255, 255, 255, 0.2)',
  inputBorderError: '#FF3B30',
  inputText: '#E0EEFF',
  inputPlaceholder: '#B0B0B0',
  
  // Cores de Progresso
  progressBackground: 'rgba(255, 255, 255, 0.2)',
  progressFill: '#007AFF',
  progressSuccess: '#4CAF50',
  
  // Cores de Ícone
  iconPrimary: '#E0EEFF',
  iconSecondary: '#B0B0B0',
  iconAccent: '#007AFF',
  iconSuccess: '#4CAF50',
  iconError: '#FF3B30',
  
  // Cores de Sombra
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // Transparências
  transparent: 'transparent',
  white10: 'rgba(255, 255, 255, 0.1)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white30: 'rgba(255, 255, 255, 0.3)',
  black50: 'rgba(0, 0, 0, 0.5)',
  black80: 'rgba(0, 0, 0, 0.8)',
};

export default colors;

