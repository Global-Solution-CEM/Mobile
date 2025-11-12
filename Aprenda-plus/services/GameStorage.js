import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = '@aprenda_plus:points';
const TROPHIES_KEY = '@aprenda_plus:trophies';
const COMPLETED_CHALLENGES_KEY = '@aprenda_plus:completed_challenges';

export const GameStorage = {
  // Obter pontos do usuário
  async getUserPoints(userId) {
    try {
      const key = `${POINTS_KEY}_${userId}`;
      const points = await AsyncStorage.getItem(key);
      return points ? parseInt(points, 10) : 0;
    } catch (error) {
      console.error('Erro ao obter pontos:', error);
      return 0;
    }
  },

  // Adicionar pontos ao usuário
  async addPoints(userId, points) {
    try {
      const key = `${POINTS_KEY}_${userId}`;
      const currentPoints = await this.getUserPoints(userId);
      const newPoints = currentPoints + points;
      await AsyncStorage.setItem(key, newPoints.toString());
      return newPoints;
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      return 0;
    }
  },

  // Obter troféus do usuário
  async getUserTrophies(userId) {
    try {
      const key = `${TROPHIES_KEY}_${userId}`;
      const trophies = await AsyncStorage.getItem(key);
      return trophies ? JSON.parse(trophies) : [];
    } catch (error) {
      console.error('Erro ao obter troféus:', error);
      return [];
    }
  },

  // Adicionar troféu ao usuário
  async addTrophy(userId, trophy) {
    try {
      const key = `${TROPHIES_KEY}_${userId}`;
      const trophies = await this.getUserTrophies(userId);
      
      // Verificar se já tem esse troféu
      if (!trophies.find(t => t.id === trophy.id)) {
        trophies.push({
          ...trophy,
          earnedAt: new Date().toISOString(),
        });
        await AsyncStorage.setItem(key, JSON.stringify(trophies));
      }
      return trophies;
    } catch (error) {
      console.error('Erro ao adicionar troféu:', error);
      return [];
    }
  },

  // Marcar desafio como concluído
  async completeChallenge(userId, challengeId) {
    try {
      const key = `${COMPLETED_CHALLENGES_KEY}_${userId}`;
      const completed = await this.getCompletedChallenges(userId);
      
      if (!completed.includes(challengeId)) {
        completed.push(challengeId);
        await AsyncStorage.setItem(key, JSON.stringify(completed));
      }
      return completed;
    } catch (error) {
      console.error('Erro ao marcar desafio como concluído:', error);
      return [];
    }
  },

  // Obter desafios concluídos
  async getCompletedChallenges(userId) {
    try {
      const key = `${COMPLETED_CHALLENGES_KEY}_${userId}`;
      const completed = await AsyncStorage.getItem(key);
      return completed ? JSON.parse(completed) : [];
    } catch (error) {
      console.error('Erro ao obter desafios concluídos:', error);
      return [];
    }
  },

  // Verificar se desafio foi concluído
  async isChallengeCompleted(userId, challengeId) {
    try {
      const completed = await this.getCompletedChallenges(userId);
      return completed.includes(challengeId);
    } catch (error) {
      return false;
    }
  },
};

