import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';

export default function Login({ navigation }) {
  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>Login</Text>
            
            <View style={styles.inputContainer}>
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
              
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenha')}>
                <Text style={styles.footerText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
              
              <View style={styles.cadastroContainer}>
                <Text style={styles.cadastroText}>Não possui uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                  <Text style={styles.cadastroLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </BackgroundImage>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#E0EEFF',
    fontSize: 14,
    marginBottom: 16,
    textDecorationLine: 'underline',
  },
  cadastroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadastroText: {
    color: '#E0EEFF',
    fontSize: 14,
  },
  cadastroLink: {
    color: '#A660DB',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

