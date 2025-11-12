import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

export default function Cadastro({ navigation }) {
  return (
    <ImageBackground 
      source={require('../assets/bg-inicial.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <BlurView intensity={80} tint="dark" style={styles.card}>
              <Text style={styles.title}>Cadastre-se</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#B0B0B0"
                  autoCapitalize="words"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry
                />
                
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.footer}>
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Já possui uma conta? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Faça login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#E0EEFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#E0EEFF',
    fontSize: 14,
  },
  loginLink: {
    color: '#A660DB',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

