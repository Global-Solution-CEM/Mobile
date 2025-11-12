import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import TelaInicial from './screens/TelaInicial';
import Login from './screens/Login';
import EsqueceuSenha from './screens/EsqueceuSenha';
import Cadastro from './screens/Cadastro';

const Stack = createNativeStackNavigator();

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
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="TelaInicial"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
