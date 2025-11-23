// Cliente HTTP para API Java do Aprenda+
// URL: https://aprendaplus-web-0703.azurewebsites.net
// Este cliente é usado exclusivamente para autenticação (login e cadastro)

import axios from 'axios';
import { AuthStorage } from '../AuthStorage';

// URL base da API Java do Aprenda+
const APPRENDA_PLUS_API_URL = 'https://aprendaplus-web-0703.azurewebsites.net';

// Criar instância do Axios para API Java
const aprendaPlusClient = axios.create({
  baseURL: APPRENDA_PLUS_API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação nas requisições
aprendaPlusClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AuthStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
aprendaPlusClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // Tratamento de erros centralizado
    if (error.response) {
      const { status, data } = error.response;
      
      // Erro 401 - Não autorizado
      if (status === 401) {
        await AuthStorage.removeUser();
        return Promise.reject({
          type: 'AUTH_ERROR',
          status,
          message: data?.message || 'Email ou senha incorretos',
          data,
        });
      }
      
      // Erro 400 - Bad Request
      if (status === 400) {
        return Promise.reject({
          type: 'VALIDATION_ERROR',
          status,
          message: data?.message || 'Dados inválidos',
          errors: data?.errors || [],
          data,
        });
      }
      
      // Erro 500 - Erro interno do servidor
      if (status >= 500) {
        return Promise.reject({
          type: 'SERVER_ERROR',
          status,
          message: data?.message || 'Erro interno do servidor. Tente novamente mais tarde.',
          data,
        });
      }
      
      // Outros erros
      return Promise.reject({
        type: 'API_ERROR',
        status,
        message: data?.message || 'Erro ao processar requisição.',
        data,
      });
    }
    
    // Erro de rede
    if (error.request) {
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
        originalError: error,
      });
    }
    
    // Outros erros
    return Promise.reject({
      type: 'UNKNOWN_ERROR',
      message: 'Erro desconhecido. Tente novamente.',
      originalError: error,
    });
  }
);

/**
 * Métodos para autenticação na API Java do Aprenda+
 */

/**
 * Realizar login na API Java
 * @param {string} email 
 * @param {string} senha 
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const login = async (email, senha) => {
  try {
    const response = await aprendaPlusClient.post('/api/auth/login', {
      email,
      senha,
    });
    
    // A API retorna diretamente o objeto de resposta
    // { success: true/false, message: "...", user: {...} }
    return {
      success: response.success !== false, // true se success não for false
      data: response,
    };
  } catch (error) {
    // Se for um erro tratado pelo interceptor, já vem formatado
    if (error.type) {
      return {
        success: false,
        error,
      };
    }
    
    // Erro não tratado
    return {
      success: false,
      error: {
        type: 'UNKNOWN_ERROR',
        message: error.message || 'Erro ao fazer login',
        originalError: error,
      },
    };
  }
};

/**
 * Realizar cadastro na API Java
 * @param {string} nome 
 * @param {string} email 
 * @param {string} senha 
 * @param {string} confirmarSenha 
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const register = async (nome, email, senha, confirmarSenha) => {
  try {
    const response = await aprendaPlusClient.post('/api/auth/register', {
      nome,
      email,
      senha,
      confirmarSenha,
    });
    
    // A API retorna: { sucesso: true/false, mensagem: "...", usuario: {...} }
    return {
      success: response.sucesso !== false, // true se sucesso não for false
      data: response,
    };
  } catch (error) {
    // Se for um erro tratado pelo interceptor, já vem formatado
    if (error.type) {
      return {
        success: false,
        error,
      };
    }
    
    // Erro não tratado
    return {
      success: false,
      error: {
        type: 'UNKNOWN_ERROR',
        message: error.message || 'Erro ao realizar cadastro',
        originalError: error,
      },
    };
  }
};

/**
 * Recuperar senha
 * @param {string} email 
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await aprendaPlusClient.post('/api/auth/forgot-password', {
      email,
    });
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// Exportar instância do cliente para uso direto se necessário
export default aprendaPlusClient;

