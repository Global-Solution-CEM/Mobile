import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';

export default function TelaInicial({ navigation }) {
  // Animações para os textos
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(30)).current;
  
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const appNameTranslateY = useRef(new Animated.Value(30)).current;
  
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(30)).current;
  const descriptionOpacityValue = descriptionOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.85],
  });
  
  // Animações para o botão
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação do texto "Bem Vindo ao"
    Animated.parallel([
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação do texto "Aprenda+" com delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(appNameOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(appNameTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Animação da descrição com delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(descriptionOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Animação do botão com delay e efeito de scale
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);
  }, []);

  const handleComecar = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Animated.Text 
            style={[
              styles.welcomeText,
              {
                opacity: welcomeOpacity,
                transform: [{ translateY: welcomeTranslateY }],
              },
            ]}
          >
            Bem Vindo ao
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.appName,
              {
                opacity: appNameOpacity,
                transform: [{ translateY: appNameTranslateY }],
              },
            ]}
          >
            Aprenda+
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.description,
              {
                opacity: descriptionOpacityValue,
                transform: [{ translateY: descriptionTranslateY }],
              },
            ]}
          >
            Você aprende, evolui e conquista novas oportunidades tudo em um só lugar.
          </Animated.Text>
          
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{ scale: buttonScale }],
              },
            ]}
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
    </BackgroundImage>
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
    color: '#A660DB',
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
  buttonContainer: {
    marginTop: 30,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    width: 250,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

