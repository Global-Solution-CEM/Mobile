import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function App() {
  // Animações para os textos
  const fadeAnimWelcome = useRef(new Animated.Value(0)).current;
  const slideAnimWelcome = useRef(new Animated.Value(50)).current;
  
  const fadeAnimAppName = useRef(new Animated.Value(0)).current;
  const slideAnimAppName = useRef(new Animated.Value(50)).current;
  
  const fadeAnimDescription = useRef(new Animated.Value(0)).current;
  const slideAnimDescription = useRef(new Animated.Value(50)).current;
  
  // Animações para o botão
  const fadeAnimButton = useRef(new Animated.Value(0)).current;
  const scaleAnimButton = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação do texto "Bem Vindo ao"
    Animated.parallel([
      Animated.timing(fadeAnimWelcome, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimWelcome, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação do texto "Aprenda+" com delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnimAppName, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimAppName, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Animação da descrição com delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnimDescription, {
          toValue: 0.85,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimDescription, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Animação do botão com delay e scale
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnimButton, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimButton, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);
  }, []);

  const handleComecar = () => {
    // Navegação será implementada posteriormente
    console.log('Botão Começar pressionado');
  };

  return (
    <ImageBackground 
      source={require('./assets/bg-inicial.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Animated.Text 
            style={[
              styles.welcomeText,
              {
                opacity: fadeAnimWelcome,
                transform: [{ translateY: slideAnimWelcome }],
              },
            ]}
          >
            Bem Vindo ao
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.appName,
              {
                opacity: fadeAnimAppName,
                transform: [{ translateY: slideAnimAppName }],
              },
            ]}
          >
            Aprenda+
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.description,
              {
                opacity: fadeAnimDescription,
                transform: [{ translateY: slideAnimDescription }],
              },
            ]}
          >
            Você aprende, evolui e conquista novas oportunidades tudo em um só lugar.
          </Animated.Text>
          
          <Animated.View
            style={{
              opacity: fadeAnimButton,
              transform: [{ scale: scaleAnimButton }],
            }}
          >
            <TouchableOpacity 
              style={styles.button}
              onPress={handleComecar}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Começar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: 60,
    color: '#E0EEFF',
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  appName: {
    fontSize: 60,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  description: {
    fontSize: 15,
    color: '#E0EEFF',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 250,
    marginTop: 30,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
