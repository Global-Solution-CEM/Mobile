import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { getValidationError } from '../utils/validation';

export default function Login({ navigation }) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validar campos
    const emailError = getValidationError('email', email);
    const passwordError = getValidationError('password', password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      Alert.alert(t('preenchaTodosCampos'), emailError || passwordError);
      return;
    }

    setLoading(true);
    setErrors({});
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result.success) {
      // Navegação será feita automaticamente pelo App.js quando isAuthenticated mudar
      // Não mostrar alerta de sucesso para melhor UX
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = getValidationError(field, { email, password }[field]);
    if (error) {
      setErrors({ ...errors, [field]: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>{t('login')}</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, touched.email && errors.email && styles.inputError]}
                placeholder={t('email')}
                placeholderTextColor="#B0B0B0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (touched.email) {
                    const error = getValidationError('email', text);
                    if (error) {
                      setErrors({ ...errors, email: error });
                    } else {
                      const newErrors = { ...errors };
                      delete newErrors.email;
                      setErrors(newErrors);
                    }
                  }
                }}
                onBlur={() => handleBlur('email')}
                editable={!loading}
                accessible={true}
                accessibilityLabel={t('campoEmail')}
                accessibilityHint={t('digiteSeuEnderecoDeEmail')}
                accessibilityRole="textbox"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, touched.password && errors.password && styles.inputError]}
                  placeholder={t('senha')}
                  placeholderTextColor="#B0B0B0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (touched.password) {
                      const error = getValidationError('password', text);
                      if (error) {
                        setErrors({ ...errors, password: error });
                      } else {
                        const newErrors = { ...errors };
                        delete newErrors.password;
                        setErrors(newErrors);
                      }
                    }
                  }}
                  onBlur={() => handleBlur('password')}
                  editable={!loading}
                  accessible={true}
                  accessibilityLabel={t('campoSenha')}
                  accessibilityHint={t('digiteSuaSenha')}
                  accessibilityRole="textbox"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? t('ocultarSenha') : t('mostrarSenha')}
                  accessibilityHint={t('alternarVisibilidadeDaSenha')}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#B0B0B0"
                  />
                  </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={t('botaoEntrar')}
                accessibilityHint={loading ? t('fazendoLogin') : t('pressioneParaFazerLogin')}
                accessibilityState={{ disabled: loading }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>{t('entrar')}</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('EsqueceuSenha')}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel={t('esqueceuSenha')}
                accessibilityHint={t('recuperarSenha')}
              >
                <Text style={styles.footerText}>{t('esqueceuSenha')}</Text>
              </TouchableOpacity>
              
              <View style={styles.cadastroContainer}>
                <Text style={styles.cadastroText}>{t('naoTemConta')} </Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Cadastro')}
                  accessible={true}
                  accessibilityRole="link"
                  accessibilityLabel={t('cadastreSe')}
                  accessibilityHint={t('criarNovaConta')}
                >
                  <Text style={styles.cadastroLink}>{t('cadastreSe')}</Text>
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
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    paddingVertical: 14,
    fontSize: 16,
    color: '#E0EEFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
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
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 4,
  },
});

