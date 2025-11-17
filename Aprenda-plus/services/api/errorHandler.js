import { Alert } from 'react-native';

/**
 * Tratamento centralizado de erros da API
 * Fornece feedback visual adequado para diferentes tipos de erros
 */

/**
 * Obtém mensagem de erro amigável baseada no tipo de erro
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return 'Erro desconhecido. Tente novamente.';
  }

  // Se já é uma string, retornar diretamente
  if (typeof error === 'string') {
    return error;
  }

  // Se tem mensagem customizada
  if (error.message) {
    return error.message;
  }

  // Mensagens baseadas no tipo de erro
  switch (error.type) {
    case 'AUTH_ERROR':
      return 'Sessão expirada. Faça login novamente.';
    
    case 'FORBIDDEN_ERROR':
      return 'Você não tem permissão para realizar esta ação.';
    
    case 'NOT_FOUND_ERROR':
      return 'Recurso não encontrado.';
    
    case 'VALIDATION_ERROR':
      if (error.errors && error.errors.length > 0) {
        return error.errors.map(e => e.message || e).join('\n');
      }
      return 'Dados inválidos. Verifique os campos e tente novamente.';
    
    case 'SERVER_ERROR':
      return 'Erro interno do servidor. Tente novamente mais tarde.';
    
    case 'NETWORK_ERROR':
      return 'Erro de conexão. Verifique sua internet e tente novamente.';
    
    case 'API_ERROR':
      return 'Erro ao processar requisição. Tente novamente.';
    
    default:
      return 'Erro desconhecido. Tente novamente.';
  }
};

/**
 * Exibe alerta de erro para o usuário
 */
export const showErrorAlert = (error, title = 'Erro') => {
  const message = getErrorMessage(error);
  Alert.alert(title, message);
};

/**
 * Exibe alerta de sucesso para o usuário
 */
export const showSuccessAlert = (message, title = 'Sucesso', onPress = null) => {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: onPress || (() => {}),
    },
  ]);
};

/**
 * Exibe alerta de confirmação
 */
export const showConfirmAlert = (
  message,
  title = 'Confirmar',
  onConfirm = () => {},
  onCancel = () => {}
) => {
  Alert.alert(title, message, [
    {
      text: 'Cancelar',
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: 'Confirmar',
      onPress: onConfirm,
    },
  ]);
};

/**
 * Trata erro de API e retorna objeto padronizado
 */
export const handleApiError = (error) => {
  const message = getErrorMessage(error);
  
  return {
    success: false,
    message,
    error,
  };
};

/**
 * Trata resposta de sucesso da API
 */
export const handleApiSuccess = (data, message = 'Operação realizada com sucesso!') => {
  return {
    success: true,
    message,
    data,
  };
};

export default {
  getErrorMessage,
  showErrorAlert,
  showSuccessAlert,
  showConfirmAlert,
  handleApiError,
  handleApiSuccess,
};

