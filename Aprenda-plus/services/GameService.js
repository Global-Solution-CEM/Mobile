// Serviço de Game/Progresso
// Preparado para integração futura com API Java
// Atualmente usa AsyncStorage, mas pode ser facilmente migrado para API

import { GameStorage } from './GameStorage';
import { read, create, update } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';
import { handleApiError, handleApiSuccess } from './api/errorHandler';

// Flag para alternar entre AsyncStorage e API
// TODO: Alterar para true quando a API Java estiver pronta
const USE_API = false;

export const GameService = {
  /**
   * Obter pontos do usuário
   * @param {string} userId 
   * @returns {Promise<number>}
   */
  async getUserPoints(userId) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.GAME.POINTS(userId));
        return result.success ? result.data.points : 0;
      } catch (error) {
        console.error('Erro ao obter pontos:', error);
        return 0;
      }
    } else {
      // Implementação atual com AsyncStorage
      return await GameStorage.getUserPoints(userId);
    }
  },

  /**
   * Adicionar pontos ao usuário
   * @param {string} userId 
   * @param {number} points 
   * @returns {Promise<{success: boolean, points?: number, message?: string}>}
   */
  async addPoints(userId, points) {
    if (USE_API) {
      try {
        const result = await update(API_ENDPOINTS.GAME.ADD_POINTS(userId), userId, {
          points,
        });
        return result.success 
          ? handleApiSuccess({ points: result.data.points }, 'Pontos adicionados!')
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        const newPoints = await GameStorage.addPoints(userId, points);
        return {
          success: true,
          points: newPoints,
          message: 'Pontos adicionados!',
        };
      } catch (error) {
        console.error('Erro ao adicionar pontos:', error);
        return {
          success: false,
          message: 'Erro ao adicionar pontos',
        };
      }
    }
  },

  /**
   * Obter desafios concluídos
   * @param {string} userId 
   * @returns {Promise<array>}
   */
  async getCompletedChallenges(userId) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.GAME.COMPLETED_CHALLENGES(userId));
        return result.success ? result.data : [];
      } catch (error) {
        console.error('Erro ao obter desafios concluídos:', error);
        return [];
      }
    } else {
      // Implementação atual com AsyncStorage
      return await GameStorage.getCompletedChallenges(userId);
    }
  },

  /**
   * Marcar desafio como concluído
   * @param {string} userId 
   * @param {string} challengeId 
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async completeChallenge(userId, challengeId) {
    if (USE_API) {
      try {
        const result = await create(API_ENDPOINTS.CHALLENGES.COMPLETE(challengeId), {
          userId,
        });
        return result.success 
          ? handleApiSuccess(result.data, 'Desafio concluído!')
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com AsyncStorage
      try {
        await GameStorage.completeChallenge(userId, challengeId);
        return {
          success: true,
          message: 'Desafio concluído!',
        };
      } catch (error) {
        console.error('Erro ao marcar desafio como concluído:', error);
        return {
          success: false,
          message: 'Erro ao marcar desafio como concluído',
        };
      }
    }
  },

  /**
   * Obter troféus do usuário
   * @param {string} userId 
   * @returns {Promise<array>}
   */
  async getUserTrophies(userId) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.GAME.TROPHIES(userId));
        return result.success ? result.data : [];
      } catch (error) {
        console.error('Erro ao obter troféus:', error);
        return [];
      }
    } else {
      // Implementação atual com AsyncStorage
      return await GameStorage.getUserTrophies(userId);
    }
  },
};

export default GameService;

