// Serviço de Autenticação
// Preparado para integração futura com API Java
// Atualmente usa AsyncStorage, mas pode ser facilmente migrado para API

import { AuthStorage } from './AuthStorage';
import { create, read, update, remove } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';
import { handleApiError, handleApiSuccess } from './api/errorHandler';

// Flag para alternar entre AsyncStorage e API
// TODO: Alterar para true quando a API Java estiver pronta
const USE_API = false;

export const AuthService = {
  /**
   * Login de usuário
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, message: string, user?: object, token?: string}>}
   */
  async login(email, password) {
    if (USE_API) {
      try {
        const result = await create(API_ENDPOINTS.AUTH.LOGIN, {
          email,
          password,
        });

        if (result.success) {
          const { user, token } = result.data;
          // Salvar token localmente
          await AuthStorage.saveUser({ ...user, token });
          return handleApiSuccess({ user, token }, 'Login realizado com sucesso!');
        } else {
          return handleApiError(result.error);
        }
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        const userData = await AuthStorage.verifyCredentials(email, password);
        
        if (!userData) {
          return {
            success: false,
            message: 'Email ou senha incorretos',
          };
        }

        const token = `token_${Date.now()}_${userData.id}`;
        const userToSave = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          token,
        };

        const saved = await AuthStorage.saveUser(userToSave);
        
        if (saved) {
          return {
            success: true,
            message: 'Login realizado com sucesso!',
            user: userToSave,
            token,
          };
        } else {
          return {
            success: false,
            message: 'Erro ao salvar dados do usuário',
          };
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        return {
          success: false,
          message: 'Erro ao fazer login. Tente novamente.',
        };
      }
    }
  },

  /**
   * Registro de novo usuário
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async register(name, email, password) {
    if (USE_API) {
      try {
        const result = await create(API_ENDPOINTS.AUTH.REGISTER, {
          name,
          email,
          password,
        });

        if (result.success) {
          return handleApiSuccess(result.data, 'Cadastro realizado com sucesso!');
        } else {
          return handleApiError(result.error);
        }
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        const users = await AuthStorage.getRegisteredUsers();
        const emailExists = users.some((u) => u.email === email);

        if (emailExists) {
          return {
            success: false,
            message: 'Este email já está cadastrado',
          };
        }

        const saved = await AuthStorage.saveRegisteredUser(email, password, name);
        
        if (saved) {
          return {
            success: true,
            message: 'Cadastro realizado com sucesso!',
          };
        } else {
          return {
            success: false,
            message: 'Erro ao realizar cadastro. Tente novamente.',
          };
        }
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        return {
          success: false,
          message: 'Erro ao realizar cadastro. Tente novamente.',
        };
      }
    }
  },

  /**
   * Atualizar perfil do usuário
   * @param {string} userId 
   * @param {object} updates 
   * @returns {Promise<{success: boolean, message: string, user?: object}>}
   */
  async updateProfile(userId, updates) {
    if (USE_API) {
      try {
        const result = await update(API_ENDPOINTS.USERS.UPDATE_PROFILE(userId), userId, updates);

        if (result.success) {
          // Atualizar dados locais
          await AuthStorage.saveUser(result.data);
          return handleApiSuccess(result.data, 'Perfil atualizado com sucesso!');
        } else {
          return handleApiError(result.error);
        }
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        const updated = await AuthStorage.updateRegisteredUser(userId, updates);
        
        if (updated) {
          const user = await AuthStorage.getUser();
          const updatedUser = { ...user, ...updates };
          await AuthStorage.saveUser(updatedUser);
          
          return {
            success: true,
            message: 'Perfil atualizado com sucesso!',
            user: updatedUser,
          };
        } else {
          return {
            success: false,
            message: 'Erro ao atualizar perfil',
          };
        }
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return {
          success: false,
          message: 'Erro ao atualizar perfil. Tente novamente.',
        };
      }
    }
  },

  /**
   * Deletar conta do usuário
   * @param {string} userId 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async deleteAccount(userId) {
    if (USE_API) {
      try {
        const result = await remove(API_ENDPOINTS.USERS.DELETE_USER(userId), userId);

        if (result.success) {
          await AuthStorage.removeUser();
          return handleApiSuccess(null, 'Conta excluída com sucesso!');
        } else {
          return handleApiError(result.error);
        }
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        const deleted = await AuthStorage.deleteRegisteredUser(userId);
        
        if (deleted) {
          await AuthStorage.removeUser();
          return {
            success: true,
            message: 'Conta excluída com sucesso!',
          };
        } else {
          return {
            success: false,
            message: 'Erro ao excluir conta',
          };
        }
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        return {
          success: false,
          message: 'Erro ao excluir conta. Tente novamente.',
        };
      }
    }
  },

  /**
   * Salvar preferências do usuário
   * @param {string} userId 
   * @param {object} preferences 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async savePreferences(userId, preferences) {
    if (USE_API) {
      try {
        const result = await update(
          API_ENDPOINTS.USERS.PREFERENCES(userId),
          userId,
          preferences
        );

        if (result.success) {
          return handleApiSuccess(result.data, 'Preferências salvas com sucesso!');
        } else {
          return handleApiError(result.error);
        }
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        const saved = await AuthStorage.saveUserPreferences(
          userId,
          preferences.areasInteresse,
          preferences.completedOnboarding
        );
        
        if (saved) {
          return {
            success: true,
            message: 'Preferências salvas com sucesso!',
          };
        } else {
          return {
            success: false,
            message: 'Erro ao salvar preferências',
          };
        }
      } catch (error) {
        console.error('Erro ao salvar preferências:', error);
        return {
          success: false,
          message: 'Erro ao salvar preferências. Tente novamente.',
        };
      }
    }
  },

  /**
   * Obter preferências do usuário
   * @param {string} userId 
   * @returns {Promise<object|null>}
   */
  async getPreferences(userId) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.USERS.PREFERENCES(userId));
        return result.success ? result.data : null;
      } catch (error) {
        console.error('Erro ao obter preferências:', error);
        return null;
      }
    } else {
      // Implementação atual com AsyncStorage
      return await AuthStorage.getUserPreferences(userId);
    }
  },
};

export default AuthService;

