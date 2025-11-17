// Sistema de Espaçamento
// Baseado em múltiplos de 4px (padrão iOS/Android)

export const spacing = {
  // Espaçamentos Base (múltiplos de 4)
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  
  // Espaçamentos Específicos
  screenPadding: 24, // Padding padrão das telas
  cardPadding: 32, // Padding padrão dos cards
  cardPaddingSmall: 16, // Padding pequeno dos cards
  sectionSpacing: 32, // Espaçamento entre seções
  itemSpacing: 16, // Espaçamento entre itens
  itemSpacingSmall: 12, // Espaçamento pequeno entre itens
  itemSpacingLarge: 24, // Espaçamento grande entre itens
  
  // Border Radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999, // Círculo completo
  },
  
  // Tamanhos de Componentes
  sizes: {
    buttonHeight: 48, // Altura padrão de botões
    buttonHeightSmall: 40, // Altura pequena de botões
    inputHeight: 48, // Altura padrão de inputs
    iconSize: 24, // Tamanho padrão de ícones
    iconSizeSmall: 20, // Tamanho pequeno de ícones
    iconSizeLarge: 32, // Tamanho grande de ícones
    avatarSize: 48, // Tamanho padrão de avatar
    avatarSizeSmall: 32, // Tamanho pequeno de avatar
    avatarSizeLarge: 64, // Tamanho grande de avatar
  },
  
  // Shadows (iOS/Android)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Android
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4, // Android
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8, // Android
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12, // Android
    },
  },
};

export default spacing;

