import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = '@aprenda_plus:points';
const TROPHIES_KEY = '@aprenda_plus:trophies';
const COMPLETED_CHALLENGES_KEY = '@aprenda_plus:completed_challenges';
const GAME_PERFORMANCE_KEY = '@aprenda_plus:game_performance';
const COURSES_KEY = '@aprenda_plus:courses';
const GENERATED_CHALLENGES_KEY = '@aprenda_plus:generated_challenges';
const CHALLENGE_PROGRESSION_KEY = '@aprenda_plus:challenge_progression';

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

  // Salvar desempenho em um jogo/quiz
  async saveGamePerformance(userId, gameData) {
    try {
      const key = `${GAME_PERFORMANCE_KEY}_${userId}`;
      const performances = await this.getGamePerformances(userId);
      
      performances.push({
        ...gameData,
        timestamp: new Date().toISOString(),
      });
      
      await AsyncStorage.setItem(key, JSON.stringify(performances));
      return true;
    } catch (error) {
      console.error('Erro ao salvar desempenho:', error);
      return false;
    }
  },

  // Obter histórico de desempenho
  async getGamePerformances(userId) {
    try {
      const key = `${GAME_PERFORMANCE_KEY}_${userId}`;
      const performances = await AsyncStorage.getItem(key);
      return performances ? JSON.parse(performances) : [];
    } catch (error) {
      console.error('Erro ao obter desempenhos:', error);
      return [];
    }
  },

  // Calcular média de desempenho
  async getAveragePerformance(userId) {
    try {
      const performances = await this.getGamePerformances(userId);
      if (performances.length === 0) return 0;
      
      const totalScore = performances.reduce((sum, p) => sum + (p.score || 0), 0);
      const totalQuestions = performances.reduce((sum, p) => sum + (p.totalQuestions || 1), 0);
      
      return totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    } catch (error) {
      console.error('Erro ao calcular média:', error);
      return 0;
    }
  },

  // Salvar progresso de curso
  async saveCourseProgress(userId, courseId, progress) {
    try {
      const key = `${COURSES_KEY}_${userId}`;
      const courses = await this.getUserCourses(userId);
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex >= 0) {
        courses[courseIndex].progress = progress;
        courses[courseIndex].updatedAt = new Date().toISOString();
      } else {
        courses.push({
          id: courseId,
          progress,
          enrolledAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completed: false,
        });
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error('Erro ao salvar progresso do curso:', error);
      return false;
    }
  },

  // Marcar curso como concluído
  async completeCourse(userId, courseId) {
    try {
      const key = `${COURSES_KEY}_${userId}`;
      const courses = await this.getUserCourses(userId);
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex >= 0) {
        courses[courseIndex].progress = 100;
        courses[courseIndex].completed = true;
        courses[courseIndex].completedAt = new Date().toISOString();
      } else {
        courses.push({
          id: courseId,
          progress: 100,
          completed: true,
          enrolledAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error('Erro ao marcar curso como concluído:', error);
      return false;
    }
  },

  // Obter cursos do usuário
  async getUserCourses(userId) {
    try {
      const key = `${COURSES_KEY}_${userId}`;
      const courses = await AsyncStorage.getItem(key);
      return courses ? JSON.parse(courses) : [];
    } catch (error) {
      console.error('Erro ao obter cursos:', error);
      return [];
    }
  },

  // Obter cursos em andamento
  async getCoursesInProgress(userId) {
    try {
      const courses = await this.getUserCourses(userId);
      return courses.filter(c => !c.completed && c.progress > 0 && c.progress < 100);
    } catch (error) {
      console.error('Erro ao obter cursos em andamento:', error);
      return [];
    }
  },

  // Obter cursos concluídos
  async getCompletedCourses(userId) {
    try {
      const courses = await this.getUserCourses(userId);
      return courses.filter(c => c.completed === true);
    } catch (error) {
      console.error('Erro ao obter cursos concluídos:', error);
      return [];
    }
  },

  // Salvar desafios gerados
  async saveGeneratedChallenges(userId, challenges) {
    try {
      const key = `${GENERATED_CHALLENGES_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(challenges));
      return true;
    } catch (error) {
      console.error('Erro ao salvar desafios gerados:', error);
      return false;
    }
  },

  // Obter desafios gerados
  async getGeneratedChallenges(userId) {
    try {
      const key = `${GENERATED_CHALLENGES_KEY}_${userId}`;
      const challenges = await AsyncStorage.getItem(key);
      return challenges ? JSON.parse(challenges) : [];
    } catch (error) {
      console.error('Erro ao obter desafios gerados:', error);
      return [];
    }
  },

  // Obter progressão de desafios (quantos desafios foram completados por área)
  async getChallengeProgression(userId) {
    try {
      const key = `${CHALLENGE_PROGRESSION_KEY}_${userId}`;
      const progression = await AsyncStorage.getItem(key);
      return progression ? JSON.parse(progression) : {};
    } catch (error) {
      console.error('Erro ao obter progressão:', error);
      return {};
    }
  },

  // Atualizar progressão de desafios
  async updateChallengeProgression(userId, area, increment = 1) {
    try {
      const key = `${CHALLENGE_PROGRESSION_KEY}_${userId}`;
      const progression = await this.getChallengeProgression(userId);
      progression[area] = (progression[area] || 0) + increment;
      await AsyncStorage.setItem(key, JSON.stringify(progression));
      return progression;
    } catch (error) {
      console.error('Erro ao atualizar progressão:', error);
      return {};
    }
  },
};

