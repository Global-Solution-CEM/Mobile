# Design System - Aprenda+

Sistema de design centralizado para garantir consistência visual em todo o aplicativo.

## Estrutura

### Cores (`colors.js`)
Paleta de cores baseada nas guidelines da Apple (Human Interface Guidelines) e Google (Material Design).

**Cores Principais:**
- `primary`: #007AFF (Azul iOS - ações principais)
- `secondary`: #A660DB (Roxo - destaques)
- `background`: #0a0e27 (Fundo escuro)

**Uso:**
```javascript
import { colors } from '../theme';

<View style={{ backgroundColor: colors.primary }}>
  <Text style={{ color: colors.textPrimary }}>Texto</Text>
</View>
```

### Tipografia (`typography.js`)
Sistema de tipografia usando fontes do sistema (SF Pro no iOS, Roboto no Android).

**Tamanhos:**
- xs: 10px
- sm: 12px
- base: 14px
- md: 16px
- lg: 18px
- xl: 20px
- 2xl: 24px
- 3xl: 28px
- 4xl: 32px

**Uso:**
```javascript
import { typography } from '../theme';

<Text style={typography.styles.h1}>Título</Text>
<Text style={typography.styles.body}>Corpo do texto</Text>
```

### Espaçamento (`spacing.js`)
Sistema de espaçamento baseado em múltiplos de 4px (padrão iOS/Android).

**Espaçamentos:**
- xs: 4px
- sm: 8px
- md: 12px
- base: 16px
- lg: 20px
- xl: 24px
- 2xl: 32px

**Uso:**
```javascript
import { spacing } from '../theme';

<View style={{ 
  padding: spacing.base,
  marginBottom: spacing.lg,
  borderRadius: spacing.radius.md 
}}>
```

## Guidelines

### Apple Human Interface Guidelines
- Uso de cores do sistema iOS (#007AFF)
- Espaçamentos em múltiplos de 4px
- Tipografia SF Pro (fonte do sistema)
- Sombras suaves e blur effects

### Google Material Design
- Elevação com shadows
- Cores vibrantes mas acessíveis
- Espaçamento consistente
- Tipografia Roboto (fonte do sistema)

## Identidade Visual

### Tema Escuro
O aplicativo usa um tema escuro consistente:
- Fundo: Azul escuro (#0a0e27)
- Cards: Branco com transparência (rgba(255, 255, 255, 0.1))
- Texto: Branco azulado (#E0EEFF)

### Cores de Ação
- **Primária**: Azul (#007AFF) - ações principais
- **Secundária**: Roxo (#A660DB) - destaques e seleções
- **Sucesso**: Verde (#4CAF50) - confirmações
- **Erro**: Vermelho (#FF3B30) - erros e alertas

### Componentes
Todos os componentes seguem o mesmo padrão visual:
- Border radius: 12px (médio), 20px (grande)
- Padding: 16px (padrão), 32px (cards)
- Blur effects: expo-blur com intensidade 80

## Migração

Para migrar componentes existentes para usar o tema:

1. Importar o tema:
```javascript
import { colors, typography, spacing } from '../theme';
```

2. Substituir valores hardcoded:
```javascript
// Antes
backgroundColor: '#007AFF'

// Depois
backgroundColor: colors.primary
```

3. Usar estilos pré-definidos:
```javascript
// Antes
fontSize: 32,
fontWeight: 'bold',
color: '#E0EEFF'

// Depois
{...typography.styles.h1}
```

## Consistência

Todos os componentes devem:
- Usar cores do tema
- Seguir espaçamentos padronizados
- Usar tipografia do sistema
- Manter border radius consistente
- Aplicar sombras quando apropriado

