// Configuração da API
// TODO: Atualizar com a URL real da API Java quando estiver disponível

const API_CONFIG = {
  // URL base da API - será configurada quando a API Java estiver pronta
  BASE_URL: __DEV__ 
    ? 'http://localhost:8080/api' // Desenvolvimento local
    : 'https://api.aprendaplus.com/api', // Produção
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 30000, // 30 segundos
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;

