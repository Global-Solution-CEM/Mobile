import axios from 'axios';
import { Platform } from 'react-native';
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
      // Validação crítica: endpoint de recomendações DEVE usar POST
      if (config.url && config.url.includes('/suggested/')) {
        if (config.method && config.method.toLowerCase() !== 'post') {
          console.error('❌ ERRO CRÍTICO: Tentativa de usar', config.method, 'no endpoint de recomendações!');
          console.error('❌ Endpoint:', config.url);
          console.error('❌ Forçando método POST...');
          config.method = 'post';
        }
      }
      
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
      const baseURL = error.config?.baseURL || 'URL não disponível';
      const url = error.config?.url || 'URL não disponível';
      const fullURL = `${baseURL}${url}`;
      
      let message = 'Erro de conexão com a API.';
      let details = '';
      
      if (__DEV__) {
        // Detectar se é dispositivo físico (usa localhost mas não é web)
        const isPhysicalDevice = baseURL.includes('localhost') && 
                                 Platform.OS !== 'web' && 
                                 !baseURL.includes('10.0.2.2');
        
        if (isPhysicalDevice) {
          details = `\n\n⚠️ DISPOSITIVO FÍSICO DETECTADO!\n\n` +
                   `Para conectar em dispositivo físico:\n` +
                   `1. Descubra o IP da sua máquina:\n` +
                   `   - Windows: execute "ipconfig" no terminal\n` +
                   `   - Mac/Linux: execute "ifconfig" ou "ip addr"\n` +
                   `2. Edite: Aprenda-plus/services/api/config.js\n` +
                   `3. Configure: const DEVICE_IP = 'SEU_IP_AQUI';\n` +
                   `4. Certifique-se de que o dispositivo e a máquina estão na mesma rede Wi-Fi\n` +
                   `5. Verifique se o firewall permite conexões na porta 8000\n\n` +
                   `URL tentada: ${fullURL}`;
        } else {
          details = `\n\nDetalhes:\n- URL: ${fullURL}\n- Verifique se a API está rodando em ${baseURL}\n- Para Android Emulator, use: http://10.0.2.2:8000\n- Para iOS/Web, use: http://localhost:8000\n- Para dispositivo físico, configure DEVICE_IP em config.js`;
        }
        message = `Erro de conexão com a API de recomendações.${details}`;
      } else {
        message = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        url: fullURL,
        baseURL,
        config: error.config,
      });
      
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message,
        details,
        url: fullURL,
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
    // BLOQUEAR: endpoint de recomendações NÃO pode usar GET
    if (endpoint.includes('/suggested/')) {
      const errorMsg = '❌ ERRO: Tentativa de usar GET no endpoint de recomendações! O endpoint /api/courses/suggested/{user_id} requer POST, não GET. Use CoursesService.getSuggestedCourses() ao invés de read().';
      console.error(errorMsg);
      console.error('❌ Endpoint:', endpoint);
      throw new Error(errorMsg);
    }
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
    // Validação CRÍTICA: endpoint de recomendações DEVE usar POST
    if (endpoint.includes('/suggested/')) {
      const methodUpper = method.toUpperCase();
      if (methodUpper !== 'POST') {
        console.error('❌ ERRO CRÍTICO: Endpoint de recomendações requer POST, mas recebeu:', method);
        console.error('❌ Endpoint:', endpoint);
        throw new Error(`Endpoint ${endpoint} requer método POST, mas recebeu ${method}`);
      }
      
      // Log detalhado
      console.log('📤 ========================================');
      console.log('📤 FAZENDO REQUISIÇÃO POST PARA RECOMENDAÇÕES');
      console.log('📤 Endpoint:', endpoint);
      console.log('📤 Método:', methodUpper);
      console.log('📤 Payload:', data ? JSON.stringify(data, null, 2) : 'sem dados');
      console.log('📤 ========================================');
    }
    
    // Garantir que o método está correto e em maiúsculas
    const finalMethod = endpoint.includes('/suggested/') ? 'POST' : method.toUpperCase();
    
    // Usar apiClient.post diretamente para garantir POST
    let response;
    if (endpoint.includes('/suggested/')) {
      // Para endpoint de recomendações, usar POST explicitamente
      response = await apiClient.post(endpoint, data, config);
    } else {
      // Para outros endpoints, usar o método genérico
      response = await apiClient.request({
        method: finalMethod,
        url: endpoint,
        data,
        ...config,
      });
    }
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    if (endpoint.includes('/suggested/')) {
      console.error('❌ ERRO na requisição de recomendações:', error);
    }
    return {
      success: false,
      error,
    };
  }
};

// Exportar instância do cliente para uso direto se necessário
export default apiClient;

