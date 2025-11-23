// Serviço de Autenticação
// Integrado com API Java do Aprenda+ (https://aprendaplus-web-0703.azurewebsites.net)
// API de IoT permanece intacta e é usada apenas para recomendações

import { AuthStorage } from './AuthStorage';
import { login as aprendaPlusLogin, register as aprendaPlusRegister } from './api/aprendaPlusApiClient';
import { handleApiError, handleApiSuccess } from './api/errorHandler';

// Usar API externa do Aprenda+ para autenticação
const USE_API = true;

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
        // Usar API Java do Aprenda+ para login
        const result = await aprendaPlusLogin(email, password);

        if (result.success && result.data) {
          const responseData = result.data;
          
          // A API Java retorna: { success: true, message: "...", user: { id, nome, email, pontosTotais, onboardingConcluido } }
          if (responseData.success && responseData.user) {
            const userData = responseData.user;
            
            // Criar objeto de usuário padronizado
            const user = {
              id: userData.id,
              email: userData.email,
              name: userData.nome, // API retorna "nome", não "name"
              pontosTotais: userData.pontosTotais || 0,
              onboardingConcluido: userData.onboardingConcluido || false,
            };
            
            // Gerar token local (a API não retorna token JWT)
            const token = `token_${Date.now()}_${user.id}`;
            
            // Salvar dados do usuário localmente
            await AuthStorage.saveUser({ ...user, token });
            
            return {
              success: true,
              message: responseData.message || 'Login realizado com sucesso!',
              user: { ...user, token },
              token,
            };
          } else {
            // Se não retornou user, pode ser erro
            return {
              success: false,
              message: responseData.message || 'Erro ao fazer login',
            };
          }
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
        // Usar API Java do Aprenda+ para cadastro
        const result = await aprendaPlusRegister(name, email, password, password);

        if (result.success && result.data) {
          const responseData = result.data;
          
          // A API Java retorna: { sucesso: true, mensagem: "...", usuario: { id, nome, email, ... } }
          if (responseData.sucesso && responseData.usuario) {
            const userData = responseData.usuario;
            const user = {
              id: userData.id,
              email: userData.email,
              name: userData.nome, // API retorna "nome", não "name"
              pontosTotais: userData.pontosTotais || 0,
              onboardingConcluido: userData.onboardingConcluido || false,
            };
            
            const token = `token_${Date.now()}_${user.id}`;
            await AuthStorage.saveUser({ ...user, token });
            
            return {
              success: true,
              message: responseData.mensagem || 'Cadastro realizado com sucesso!',
              user: { ...user, token },
            };
          } else if (responseData.sucesso) {
            // Cadastro bem-sucedido mas sem dados do usuário
            return {
              success: true,
              message: responseData.mensagem || 'Cadastro realizado com sucesso!',
            };
          } else {
            // Erro no cadastro
            return {
              success: false,
              message: responseData.mensagem || 'Erro ao realizar cadastro',
            };
          }
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
    // Nota: Atualização de perfil ainda não implementada na API externa
    // Por enquanto, usar AsyncStorage local
    if (false) { // Desabilitado até API estar pronta
      try {
        // TODO: Implementar quando API Java tiver endpoint de atualização
        return handleApiError({ message: 'Endpoint não implementado' });
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
    // Nota: Exclusão de conta ainda não implementada na API externa
    // Por enquanto, usar AsyncStorage local
    if (false) { // Desabilitado até API estar pronta
      try {
        // TODO: Implementar quando API Java tiver endpoint de exclusão
        return handleApiError({ message: 'Endpoint não implementado' });
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
    // Nota: Preferências ainda não implementadas na API externa
    // Por enquanto, usar AsyncStorage local
    if (false) { // Desabilitado até API estar pronta
      try {
        // TODO: Implementar quando API Java tiver endpoint de preferências
        return handleApiError({ message: 'Endpoint não implementado' });
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

