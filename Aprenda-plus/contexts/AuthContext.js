import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthStorage } from '../services/AuthStorage';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Verificar se o usuário está logado ao iniciar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await AuthStorage.getUser();
      const token = await AuthStorage.getToken();
      
      if (userData && token) {
        setUser(userData);
        setIsAuthenticated(true);
        
        // Verificar se completou onboarding E se está no formato novo (com níveis)
        const preferences = await AuthStorage.getUserPreferences(userData.id);
        
        // Se não existem preferências, usuário não completou onboarding
        if (!preferences) {
          setHasCompletedOnboarding(false);
        } else {
          const hasCompleted = preferences.completedOnboarding || false;
          
          // Verificar se as preferências estão no formato novo (com níveis)
          const isFormatoNovo = preferences.areasInteresse && 
            Array.isArray(preferences.areasInteresse) &&
            preferences.areasInteresse.length > 0 &&
            typeof preferences.areasInteresse[0] === 'object' &&
            preferences.areasInteresse[0].area &&
            preferences.areasInteresse[0].nivel;
          
          // Só considera onboarding completo se tiver o formato novo com níveis
          setHasCompletedOnboarding(hasCompleted && isFormatoNovo);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setHasCompletedOnboarding(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setUser(null);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Verificar credenciais
      const userData = await AuthStorage.verifyCredentials(email, password);
      
      if (!userData) {
        return {
          success: false,
          message: 'Email ou senha incorretos',
        };
      }

      // Criar token simples (em produção, viria do backend)
      const token = `token_${Date.now()}_${userData.id}`;
      
      const userToSave = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        token,
      };

      // Salvar dados do usuário
      const saved = await AuthStorage.saveUser(userToSave);
      
      if (saved) {
        setUser(userToSave);
        setIsAuthenticated(true);
        
        // Verificar se completou onboarding E se está no formato novo (com níveis)
        const preferences = await AuthStorage.getUserPreferences(userData.id);
        
        // Se não existem preferências, usuário não completou onboarding
        if (!preferences) {
          setHasCompletedOnboarding(false);
        } else {
          const hasCompleted = preferences.completedOnboarding || false;
          
          // Verificar se as preferências estão no formato novo (com níveis)
          const isFormatoNovo = preferences.areasInteresse && 
            Array.isArray(preferences.areasInteresse) &&
            preferences.areasInteresse.length > 0 &&
            typeof preferences.areasInteresse[0] === 'object' &&
            preferences.areasInteresse[0].area &&
            preferences.areasInteresse[0].nivel;
          
          // Só considera onboarding completo se tiver o formato novo com níveis
          setHasCompletedOnboarding(hasCompleted && isFormatoNovo);
        }
        
        return {
          success: true,
          message: 'Login realizado com sucesso!',
          user: userToSave,
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
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      // Validações básicas
      if (!name || !email || !password || !confirmPassword) {
        return {
          success: false,
          message: 'Preencha todos os campos',
        };
      }

      if (password !== confirmPassword) {
        return {
          success: false,
          message: 'As senhas não coincidem',
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres',
        };
      }

      // Verificar se o email já está cadastrado
      const users = await AuthStorage.getRegisteredUsers();
      const emailExists = users.some((u) => u.email === email);

      if (emailExists) {
        return {
          success: false,
          message: 'Este email já está cadastrado',
        };
      }

      // Salvar novo usuário
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
  };

  const saveUserPreferences = async (areasComNiveis, markCompleted = false) => {
    try {
      if (!user || !user.id) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      // Converter para formato compatível (array de áreas ou array de objetos com área e nível)
      let areasParaSalvar;
      if (Array.isArray(areasComNiveis) && areasComNiveis.length > 0) {
        // Se é array de objetos {area, nivel}
        if (typeof areasComNiveis[0] === 'object' && areasComNiveis[0].area) {
          areasParaSalvar = areasComNiveis;
        } else {
          // Se é array simples de IDs (compatibilidade com código antigo)
          areasParaSalvar = areasComNiveis;
        }
      } else {
        areasParaSalvar = areasComNiveis;
      }

      const saved = await AuthStorage.saveUserPreferences(user.id, areasParaSalvar, markCompleted);
      
      if (saved) {
        // Só atualizar o estado se for para marcar como completo
        if (markCompleted) {
          setHasCompletedOnboarding(true);
        }
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
  };

  const updateProfile = async (name, email, password) => {
    try {
      if (!user || !user.id) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (password) updates.password = password;

      const updated = await AuthStorage.updateRegisteredUser(user.id, updates);
      
      if (updated) {
        // Atualizar dados do usuário logado
        const updatedUser = {
          ...user,
          ...updates,
        };
        await AuthStorage.saveUser(updatedUser);
        setUser(updatedUser);
        
        return {
          success: true,
          message: 'Perfil atualizado com sucesso!',
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
  };

  const deleteAccount = async () => {
    try {
      if (!user || !user.id) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      const deleted = await AuthStorage.deleteRegisteredUser(user.id);
      
      if (deleted) {
        await AuthStorage.removeUser();
        setUser(null);
        setIsAuthenticated(false);
        setHasCompletedOnboarding(false);
        
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
  };

  const logout = async () => {
    try {
      await AuthStorage.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        hasCompletedOnboarding,
        login,
        register,
        logout,
        saveUserPreferences,
        updateProfile,
        deleteAccount,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

