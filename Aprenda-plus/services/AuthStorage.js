import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@aprenda_plus:user';
const TOKEN_KEY = '@aprenda_plus:token';

export const AuthStorage = {
  // Salvar dados do usuário
  async saveUser(userData) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      if (userData.token) {
        await AsyncStorage.setItem(TOKEN_KEY, userData.token);
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      return false;
    }
  },

  // Obter dados do usuário
  async getUser() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },

  // Obter token
  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  },

  // Verificar se está logado
  async isLoggedIn() {
    try {
      const user = await this.getUser();
      const token = await this.getToken();
      return !!(user && token);
    } catch (error) {
      return false;
    }
  },

  // Remover dados do usuário (logout)
  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return false;
    }
  },

  // Salvar usuários cadastrados (simulação de banco de dados)
  async saveRegisteredUser(email, password, name) {
    try {
      const usersKey = '@aprenda_plus:registered_users';
      const users = await this.getRegisteredUsers();
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // Em produção, isso deve ser criptografado
        name,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      await AsyncStorage.setItem(usersKey, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário cadastrado:', error);
      return false;
    }
  },

  // Obter usuários cadastrados
  async getRegisteredUsers() {
    try {
      const usersKey = '@aprenda_plus:registered_users';
      const users = await AsyncStorage.getItem(usersKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  },

  // Verificar credenciais de login
  async verifyCredentials(email, password) {
    try {
      const users = await this.getRegisteredUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      return user || null;
    } catch (error) {
      console.error('Erro ao verificar credenciais:', error);
      return null;
    }
  },

  // Salvar preferências do usuário (áreas de interesse com níveis)
  async saveUserPreferences(userId, areasComNiveis) {
    try {
      const preferencesKey = `@aprenda_plus:preferences_${userId}`;
      
      // Verificar se é array de objetos {area, nivel} ou array simples
      let areasInteresse;
      if (Array.isArray(areasComNiveis) && areasComNiveis.length > 0) {
        if (typeof areasComNiveis[0] === 'object' && areasComNiveis[0].area) {
          // Formato novo: [{area: 'ia', nivel: 'Iniciante'}, ...]
          areasInteresse = areasComNiveis;
        } else {
          // Formato antigo: ['ia', 'dados', ...] (compatibilidade)
          areasInteresse = areasComNiveis;
        }
      } else {
        areasInteresse = areasComNiveis;
      }

      const preferences = {
        areasInteresse: areasInteresse,
        completedOnboarding: true,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(preferencesKey, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      return false;
    }
  },

  // Obter preferências do usuário
  async getUserPreferences(userId) {
    try {
      const preferencesKey = `@aprenda_plus:preferences_${userId}`;
      const preferences = await AsyncStorage.getItem(preferencesKey);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Erro ao obter preferências:', error);
      return null;
    }
  },
};

