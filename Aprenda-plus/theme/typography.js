// Sistema de Tipografia
// Baseado nas guidelines da Apple (SF Pro) e Google (Roboto)
// Usando fontes do sistema para melhor performance e consistência

export const typography = {
  // Tamanhos de Fonte
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 60,
  },
  
  // Pesos de Fonte
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Estilos de Texto Pré-definidos
  styles: {
    // Títulos
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
      color: '#E0EEFF',
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
      color: '#E0EEFF',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      color: '#E0EEFF',
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      color: '#E0EEFF',
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      color: '#E0EEFF',
    },
    h6: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 22,
      color: '#E0EEFF',
    },
    
    // Textos
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      color: '#E0EEFF',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      color: '#E0EEFF',
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 26,
      color: '#E0EEFF',
    },
    
    // Textos Secundários
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      color: '#B0B0B0',
    },
    captionSmall: {
      fontSize: 10,
      fontWeight: '400',
      lineHeight: 14,
      color: '#B0B0B0',
    },
    
    // Botões
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
      color: '#FFFFFF',
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 18,
      color: '#FFFFFF',
    },
    
    // Links
    link: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      color: '#A660DB',
      textDecorationLine: 'underline',
    },
    
    // Labels
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      color: '#E0EEFF',
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      color: '#B0B0B0',
    },
  },
};

export default typography;

