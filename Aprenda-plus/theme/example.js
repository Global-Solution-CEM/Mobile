// Exemplo de uso do Design System
// Este arquivo demonstra como usar o tema em componentes

import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from './index';

// Exemplo 1: Usando cores do tema
export const exampleStyles1 = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  title: {
    ...typography.styles.h1,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radius.md,
    padding: spacing.base,
  },
});

// Exemplo 2: Componente de Card
export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: spacing.radius.xl,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    ...spacing.shadows.md,
  },
  cardTitle: {
    ...typography.styles.h3,
    marginBottom: spacing.md,
  },
  cardBody: {
    ...typography.styles.body,
    color: colors.textSecondary,
  },
});

// Exemplo 3: Botão com estados
export const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: spacing.radius.md,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    minHeight: spacing.sizes.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.buttonPrimaryDisabled,
    opacity: 0.6,
  },
  buttonText: {
    ...typography.styles.button,
  },
});

// Exemplo 4: Input com validação
export const inputStyles = StyleSheet.create({
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: spacing.radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.inputText,
    fontSize: typography.sizes.md,
    minHeight: spacing.sizes.inputHeight,
  },
  inputError: {
    borderColor: colors.inputBorderError,
    borderWidth: 2,
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});

// Exemplo 5: Badge/Status
export const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.full,
    alignSelf: 'flex-start',
  },
  badgeSuccess: {
    backgroundColor: colors.successLight,
  },
  badgeError: {
    backgroundColor: colors.errorLight,
  },
  badgeText: {
    ...typography.styles.caption,
    fontWeight: typography.weights.semibold,
  },
  badgeTextSuccess: {
    color: colors.success,
  },
  badgeTextError: {
    color: colors.error,
  },
});

export default {
  exampleStyles1,
  cardStyles,
  buttonStyles,
  inputStyles,
  badgeStyles,
};

