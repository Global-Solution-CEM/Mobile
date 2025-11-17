module.exports = {
  root: true,
  extends: [
    'expo',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
  },
  rules: {
    // Regras de formatação
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    
    // Regras de React
    'react/prop-types': 'off', // TypeScript ou PropTypes opcional
    'react/react-in-jsx-scope': 'off', // Não necessário no React 17+
    'react/display-name': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    
    // Regras de React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Regras de código limpo
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    
    // Regras de nomenclatura
    'camelcase': ['warn', { 
      properties: 'always',
      ignoreDestructuring: false,
    }],
    
    // Regras de espaçamento
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

