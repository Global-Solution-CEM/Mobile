# Arquitetura do Projeto - Aprenda+

Este documento descreve a estrutura e organização do código do projeto.

## 📁 Estrutura de Pastas

```
Aprenda-plus/
├── App.js                 # Componente raiz e configuração de navegação
├── index.js              # Ponto de entrada da aplicação
├── app.json              # Configuração do Expo
├── package.json          # Dependências e scripts
│
├── assets/               # Recursos estáticos
│   ├── Aprenda.png      # Logo/ícone do app
│   └── bg-inicial.png   # Imagem de fundo
│
├── components/           # Componentes reutilizáveis
│   ├── BackgroundImage.js
│   ├── CircularMenu.js
│   └── HeaderBack.js
│
├── contexts/             # Context API do React
│   └── AuthContext.js   # Contexto de autenticação
│
├── i18n/                 # Internacionalização
│   ├── helpers.js       # Funções auxiliares
│   ├── I18nContext.js   # Contexto de idioma
│   └── translations/    # Traduções
│       ├── pt.js
│       ├── en.js
│       └── es.js
│
├── screens/              # Telas da aplicação
│   ├── TelaInicial.js
│   ├── Login.js
│   ├── Cadastro.js
│   ├── Home.js
│   └── ...
│
├── services/             # Serviços e lógica de negócio
│   ├── api/             # Integração com API
│   │   ├── apiClient.js
│   │   ├── config.js
│   │   ├── endpoints.js
│   │   ├── errorHandler.js
│   │   └── index.js
│   ├── AuthService.js
│   ├── AuthStorage.js
│   ├── CoursesService.js
│   ├── CursosService.js
│   ├── GameService.js
│   ├── GameStorage.js
│   └── ChallengesService.js
│
├── theme/                # Design System
│   ├── colors.js
│   ├── typography.js
│   ├── spacing.js
│   ├── index.js
│   └── README.md
│
└── utils/                # Utilitários
    └── validation.js
```

## 🎯 Princípios de Organização

### 1. Separação de Responsabilidades

- **Screens**: Apenas lógica de apresentação e interação do usuário
- **Components**: Componentes reutilizáveis sem lógica de negócio
- **Services**: Lógica de negócio e comunicação com API/storage
- **Contexts**: Gerenciamento de estado global
- **Utils**: Funções auxiliares puras
- **Theme**: Tokens de design e estilos

### 2. Nomenclatura

#### Arquivos e Pastas
- **PascalCase** para componentes: `CircularMenu.js`, `HeaderBack.js`
- **camelCase** para utilitários: `validation.js`, `helpers.js`
- **camelCase** para serviços: `AuthService.js`, `GameStorage.js`
- **kebab-case** para assets: `bg-inicial.png`

#### Componentes React
- **PascalCase**: `function Home()`, `const CircularMenu = () => {}`
- Nomes descritivos e em português (conforme padrão do projeto)

#### Variáveis e Funções
- **camelCase**: `const userName = ''`, `function handleLogin() {}`
- Nomes descritivos: `isAuthenticated`, `hasCompletedOnboarding`
- Prefixos para handlers: `handle*`, `on*`

#### Constantes
- **UPPER_SNAKE_CASE**: `const API_BASE_URL = ''`
- **camelCase** para objetos: `const API_ENDPOINTS = {}`

### 3. Estrutura de Componentes

```javascript
// 1. Imports (React, React Native, bibliotecas, componentes locais)
import React from 'react';
import { View, Text } from 'react-native';

// 2. Componente
export default function ComponentName({ props }) {
  // 3. Hooks
  const [state, setState] = useState();
  
  // 4. Funções auxiliares
  const handleAction = () => {};
  
  // 5. Render
  return (
    <View>
      <Text>Content</Text>
    </View>
  );
}

// 6. Styles
const styles = StyleSheet.create({});
```

### 4. Estrutura de Serviços

```javascript
// 1. Imports
import { apiClient } from './api';

// 2. Constantes
const SERVICE_NAME = 'ServiceName';

// 3. Funções exportadas
export const ServiceName = {
  async methodName() {
    // Implementação
  },
};

// 4. Export default
export default ServiceName;
```

## 📋 Convenções de Código

### Indentação
- **2 espaços** (não tabs)
- Consistente em todo o projeto

### Aspas
- **Aspas simples** para strings JavaScript
- **Aspas duplas** para atributos JSX

### Ponto e vírgula
- **Sempre usar** ponto e vírgula

### Quebras de linha
- Máximo **100 caracteres** por linha
- Quebras lógicas para legibilidade

### Imports
- Ordenados: React → React Native → Bibliotecas → Locais
- Agrupados por tipo
- Imports absolutos quando possível

### Comentários
- Comentários em português
- JSDoc para funções complexas
- Comentários explicativos quando necessário

## 🛠️ Ferramentas de Qualidade

### ESLint
- Configuração em `.eslintrc.js`
- Regras para React Native
- Validação de código

### Prettier
- Configuração em `.prettierrc.js`
- Formatação automática
- Integração com ESLint

### EditorConfig
- Configuração em `.editorconfig`
- Consistência entre editores
- Indentação e charset

## 📦 Dependências

### Core
- `react`: ^19.1.0
- `react-native`: 0.81.5
- `expo`: ~54.0.23

### Navegação
- `@react-navigation/native`: ^7.1.19
- `@react-navigation/native-stack`: ^7.6.2

### Storage
- `@react-native-async-storage/async-storage`: ^2.2.0

### HTTP
- `axios`: ^1.13.2

### UI
- `expo-blur`: ^15.0.7
- `expo-status-bar`: ~3.0.8

Todas as dependências são:
- ✅ Atualizadas
- ✅ Necessárias
- ✅ Bem mantidas
- ✅ Compatíveis entre si

## 🔍 Boas Práticas Implementadas

1. **Componentes Funcionais**: Uso exclusivo de componentes funcionais com Hooks
2. **Custom Hooks**: Separação de lógica reutilizável
3. **Context API**: Gerenciamento de estado global
4. **Separação de Concerns**: Lógica separada da apresentação
5. **Error Handling**: Tratamento centralizado de erros
6. **Loading States**: Indicadores de carregamento
7. **Acessibilidade**: Propriedades de acessibilidade
8. **Internacionalização**: Suporte a múltiplos idiomas
9. **Design System**: Tema centralizado
10. **Type Safety**: Validação de dados

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Inicia no Android
npm run ios        # Inicia no iOS
npm run web        # Inicia no navegador
```

## 🚀 Próximos Passos

Para melhorar ainda mais a arquitetura:

1. Adicionar TypeScript (opcional)
2. Configurar testes unitários
3. Adicionar CI/CD
4. Documentação de componentes com Storybook (opcional)
5. Migração gradual para usar o tema centralizado

