// Design System - Tema Centralizado
// Exporta todos os tokens de design para uso consistente no app

import colors from './colors';
import typography from './typography';
import spacing from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  
  // Componentes Pré-estilizados (opcional - para facilitar uso)
  components: {
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: spacing.radius.xl,
      padding: spacing.cardPadding,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      primary: {
        backgroundColor: colors.buttonPrimary,
        borderRadius: spacing.radius.md,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        minHeight: spacing.sizes.buttonHeight,
      },
      secondary: {
        backgroundColor: colors.buttonSecondary,
        borderRadius: spacing.radius.md,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        minHeight: spacing.sizes.buttonHeight,
      },
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: spacing.radius.md,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      color: colors.inputText,
      fontSize: typography.sizes.md,
    },
  },
};

export default theme;

// Exportações individuais para facilitar importação
export { colors, typography, spacing };

