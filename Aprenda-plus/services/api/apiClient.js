import axios from 'axios';
import API_CONFIG from './config';
import { AuthStorage } from '../AuthStorage';

// Criar instância do Axios com configuração base
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Interceptor para adicionar token de autenticação nas requisições
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => {
    // Retornar apenas os dados da resposta
    return response.data;
  },
  async (error) => {
    // Tratamento de erros centralizado
    if (error.response) {
      // Erro com resposta do servidor
      const { status, data } = error.response;
      
      // Erro 401 - Não autorizado (token inválido/expirado)
      if (status === 401) {
        // Limpar dados de autenticação
        await AuthStorage.removeUser();
        // Retornar erro específico para tratamento no componente
        return Promise.reject({
          type: 'AUTH_ERROR',
          status,
          message: data?.message || 'Sessão expirada. Faça login novamente.',
          data,
        });
      }
      
      // Erro 403 - Proibido
      if (status === 403) {
        return Promise.reject({
          type: 'FORBIDDEN_ERROR',
          status,
          message: data?.message || 'Você não tem permissão para realizar esta ação.',
          data,
        });
      }
      
      // Erro 404 - Não encontrado
      if (status === 404) {
        return Promise.reject({
          type: 'NOT_FOUND_ERROR',
          status,
          message: data?.message || 'Recurso não encontrado.',
          data,
        });
      }
      
      // Erro 422 - Validação
      if (status === 422) {
        return Promise.reject({
          type: 'VALIDATION_ERROR',
          status,
          message: data?.message || 'Dados inválidos.',
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
    
    // Erro de rede (sem resposta do servidor)
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
 * Métodos CRUD genéricos para integração com API RESTful
 */

// CREATE - Criar novo recurso
export const create = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
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

// READ - Obter recurso(s)
export const read = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
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

// READ BY ID - Obter recurso por ID
export const readById = async (endpoint, id) => {
  try {
    const response = await apiClient.get(`${endpoint}/${id}`);
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

// UPDATE - Atualizar recurso
export const update = async (endpoint, id, data) => {
  try {
    const response = await apiClient.put(`${endpoint}/${id}`, data);
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

// PATCH - Atualização parcial de recurso
export const patch = async (endpoint, id, data) => {
  try {
    const response = await apiClient.patch(`${endpoint}/${id}`, data);
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

// DELETE - Deletar recurso
export const remove = async (endpoint, id) => {
  try {
    const response = await apiClient.delete(`${endpoint}/${id}`);
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

// Método genérico para requisições customizadas
export const request = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
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
export default apiClient;

