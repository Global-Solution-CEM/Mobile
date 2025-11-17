# Guia de Integração com API Java

Este documento descreve como o projeto está preparado para integração futura com uma API RESTful desenvolvida em Java.

## Estrutura Criada

### 1. Configuração da API (`services/api/config.js`)
- Configuração centralizada da URL base da API
- Suporte para ambiente de desenvolvimento e produção
- Timeout e headers padrão configuráveis

### 2. Cliente de API (`services/api/apiClient.js`)
- Instância do Axios configurada
- Interceptors para:
  - Adicionar token de autenticação automaticamente
  - Tratar erros de forma centralizada
- Métodos CRUD genéricos:
  - `create(endpoint, data)` - POST
  - `read(endpoint, params)` - GET
  - `readById(endpoint, id)` - GET por ID
  - `update(endpoint, id, data)` - PUT
  - `patch(endpoint, id, data)` - PATCH
  - `remove(endpoint, id)` - DELETE

### 3. Endpoints (`services/api/endpoints.js`)
- Mapeamento de todos os endpoints da API
- Organizado por recursos (Auth, Users, Courses, etc.)
- Funções para gerar endpoints dinâmicos

### 4. Tratamento de Erros (`services/api/errorHandler.js`)
- Tratamento centralizado de erros
- Mensagens amigáveis para diferentes tipos de erro
- Funções para exibir alertas de erro/sucesso
- Suporte para erros de validação, autenticação, rede, etc.

### 5. Serviços Preparados
- `AuthService.js` - Autenticação e gerenciamento de usuários
- `CoursesService.js` - Gerenciamento de cursos
- `GameService.js` - Sistema de pontos e progresso

## Como Migrar para API

### Passo 1: Configurar URL da API
Edite `services/api/config.js` e atualize `BASE_URL` com a URL real da sua API Java:

```javascript
BASE_URL: 'http://seu-servidor:8080/api'
```

### Passo 2: Ativar Uso da API
Em cada serviço (`AuthService.js`, `CoursesService.js`, `GameService.js`), altere a flag:

```javascript
const USE_API = true; // Mudar de false para true
```

### Passo 3: Ajustar Endpoints
Verifique e ajuste os endpoints em `services/api/endpoints.js` para corresponder aos endpoints reais da sua API Java.

### Passo 4: Testar Integração
Teste cada operação CRUD:
- Create: Cadastro de usuário, criação de recursos
- Read: Login, listagem de cursos, etc.
- Update: Atualização de perfil, progresso
- Delete: Exclusão de conta

## Estrutura de Resposta Esperada da API

### Sucesso
```json
{
  "id": 1,
  "name": "Nome",
  "email": "email@example.com"
}
```

### Erro
```json
{
  "message": "Mensagem de erro",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## Tratamento de Erros

O sistema trata automaticamente:
- **401**: Sessão expirada - limpa dados locais
- **403**: Sem permissão
- **404**: Recurso não encontrado
- **422**: Erros de validação
- **500+**: Erros do servidor
- **Network**: Erros de conexão

## Autenticação

O token JWT é automaticamente adicionado em todas as requisições através do interceptor. O token é obtido do `AuthStorage` e enviado no header:

```
Authorization: Bearer {token}
```

## Compatibilidade

O projeto mantém compatibilidade com a implementação atual (AsyncStorage) enquanto a API está em desenvolvimento. Basta alterar a flag `USE_API` quando a API estiver pronta.

## Exemplo de Uso

```javascript
import { AuthService } from './services/AuthService';
import { showErrorAlert, showSuccessAlert } from './services/api/errorHandler';

// Login
const result = await AuthService.login(email, password);
if (result.success) {
  showSuccessAlert(result.message);
} else {
  showErrorAlert(result.error);
}
```

## Próximos Passos

1. ✅ Estrutura de API criada
2. ✅ Métodos CRUD implementados
3. ✅ Tratamento de erros configurado
4. ⏳ Aguardando API Java estar pronta
5. ⏳ Testar integração completa
6. ⏳ Migrar dados do AsyncStorage para API

