import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import TelaInicial from './screens/TelaInicial';
import Login from './screens/Login';
import EsqueceuSenha from './screens/EsqueceuSenha';
import Cadastro from './screens/Cadastro';
import SelecaoAreas from './screens/SelecaoAreas';
import SelecaoNiveis from './screens/SelecaoNiveis';
import ConfirmacaoInteresses from './screens/ConfirmacaoInteresses';
import Home from './screens/Home';
import Perfil from './screens/Perfil';

const Stack = createNativeStackNavigator();

// Componente de navegação que verifica autenticação
function AppNavigator() {
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuth();

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
          <Stack.Screen name="Perfil" component={Perfil} />
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
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
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
