import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './i18n/I18nContext';
import TelaInicial from './screens/TelaInicial';
import Login from './screens/Login';
import EsqueceuSenha from './screens/EsqueceuSenha';
import Cadastro from './screens/Cadastro';
import SelecaoAreas from './screens/SelecaoAreas';
import SelecaoNiveis from './screens/SelecaoNiveis';
import ConfirmacaoInteresses from './screens/ConfirmacaoInteresses';
import Home from './screens/Home';
import MeusCursos from './screens/MeusCursos';
import Trilhas from './screens/Trilhas';
import Desafios from './screens/Desafios';
import DesafiosPorArea from './screens/DesafiosPorArea';
import DesafioJogo from './screens/DesafioJogo';
import Perfil from './screens/Perfil';
import Configuracoes from './screens/Configuracoes';

const Stack = createNativeStackNavigator();

// Componente de navegação que verifica autenticação
function AppNavigator() {
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuth();
  const navigationRef = useRef(null);

  // Navegar baseado no estado de autenticação e onboarding
  useEffect(() => {
    if (loading) return;
    
    // Aguardar um pouco para garantir que o NavigationContainer está pronto
    const timer = setTimeout(() => {
      if (!navigationRef.current) return;

      const currentRoute = navigationRef.current.getCurrentRoute();
      const currentRouteName = currentRoute?.name;

      // Não navegar se já estiver na tela correta ou em uma tela do fluxo de onboarding
      if (currentRouteName === 'ConfirmacaoInteresses' || 
          currentRouteName === 'SelecaoNiveis' ||
          currentRouteName === 'SelecaoAreas') {
        // Se está em uma tela do onboarding, só navegar se não estiver autenticado
        if (!isAuthenticated) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'TelaInicial' }],
          });
        }
        return;
      }

      if (!isAuthenticated) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'TelaInicial' }],
        });
      } else if (isAuthenticated && !hasCompletedOnboarding) {
        // Só navegar para SelecaoAreas se não estiver já em uma tela do onboarding
        if (currentRouteName !== 'SelecaoAreas' && 
            currentRouteName !== 'SelecaoNiveis' && 
            currentRouteName !== 'ConfirmacaoInteresses') {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'SelecaoAreas' }],
          });
        }
      } else if (isAuthenticated && hasCompletedOnboarding) {
        // Só navegar para Home se não estiver em uma tela do onboarding
        if (currentRouteName !== 'SelecaoAreas' && 
            currentRouteName !== 'SelecaoNiveis' && 
            currentRouteName !== 'ConfirmacaoInteresses') {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding, loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Determinar a rota inicial baseada no estado de autenticação e onboarding
  const getInitialRoute = () => {
    if (!isAuthenticated) {
      return 'TelaInicial';
    }
    if (isAuthenticated && !hasCompletedOnboarding) {
      return 'SelecaoAreas';
    }
    return 'Home';
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        initialRouteName={getInitialRoute()}
        screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        animationDuration: 300,
        cardStyleInterpolator: slideFromRight,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
      }}
    >
      {isAuthenticated ? (
        // Rotas autenticadas - sempre registrar todas para permitir navegação
        <>
          <Stack.Screen name="SelecaoAreas" component={SelecaoAreas} />
          <Stack.Screen name="SelecaoNiveis" component={SelecaoNiveis} />
          <Stack.Screen name="ConfirmacaoInteresses" component={ConfirmacaoInteresses} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MeusCursos" component={MeusCursos} />
          <Stack.Screen name="Trilhas" component={Trilhas} />
          <Stack.Screen name="Desafios" component={Desafios} />
          <Stack.Screen name="DesafiosPorArea" component={DesafiosPorArea} />
          <Stack.Screen name="DesafioJogo" component={DesafioJogo} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="Configuracoes" component={Configuracoes} />
        </>
      ) : (
        // Rotas não autenticadas
        <>
          <Stack.Screen 
            name="TelaInicial" 
            component={TelaInicial}
            options={{
              cardStyleInterpolator: fadeTransition,
            }}
          />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      )}
    </Stack.Navigator>
    </NavigationContainer>
  );
}

// Configuração de animação customizada
const slideFromRight = ({ current, next, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
        {
          scale: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.9],
              })
            : 1,
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
  };
};

const fadeTransition = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
  };
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
  },
});
