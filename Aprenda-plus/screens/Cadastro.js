import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { getValidationError, validateForm } from '../utils/validation';

export default function Cadastro({ navigation }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { register } = useAuth();

  const handleRegister = async () => {
    // Validar formulário
    const validation = validateForm({ name, email, password, confirmPassword });
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      Alert.alert(t('preenchaTodosCampos'), Object.values(validation.errors)[0]);
      return;
    }

    setLoading(true);
    setErrors({});
    const result = await register(name.trim(), email.trim().toLowerCase(), password, confirmPassword);
    setLoading(false);

    if (result.success) {
      Alert.alert('Sucesso', result.message, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const error = getValidationError(field, { name, email, password, confirmPassword }[field], { password, confirmPassword });
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <BlurView intensity={80} tint="dark" style={styles.card}>
              <Text style={styles.title}>{t('cadastreSeTitulo')}</Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, touched.name && errors.name && styles.inputError]}
                  placeholder={t('nomeCompleto')}
                  placeholderTextColor="#B0B0B0"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (touched.name) {
                      const error = getValidationError('name', text);
                      if (error) {
                        setErrors({ ...errors, name: error });
                      } else {
                        const newErrors = { ...errors };
                        delete newErrors.name;
                        setErrors(newErrors);
                      }
                    }
                  }}
                  onBlur={() => handleBlur('name')}
                  editable={!loading}
                  accessible={true}
                  accessibilityLabel={t('nomeCompleto')}
                  accessibilityHint={t('digiteSeuNomeCompleto')}
                  accessibilityRole="textbox"
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
                
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
                      // Validar confirmação também
                      if (touched.confirmPassword && confirmPassword) {
                        const confirmError = getValidationError('confirmPassword', confirmPassword, { password: text });
                        if (confirmError) {
                          setErrors({ ...errors, confirmPassword: confirmError });
                        } else {
                          const newErrors = { ...errors };
                          delete newErrors.confirmPassword;
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
                
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, touched.confirmPassword && errors.confirmPassword && styles.inputError]}
                    placeholder={t('confirmarSenha')}
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (touched.confirmPassword) {
                        const error = getValidationError('confirmPassword', text, { password });
                        if (error) {
                          setErrors({ ...errors, confirmPassword: error });
                        } else {
                          const newErrors = { ...errors };
                          delete newErrors.confirmPassword;
                          setErrors(newErrors);
                        }
                      }
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
                    editable={!loading}
                    accessible={true}
                    accessibilityLabel={t('confirmarSenha')}
                    accessibilityHint={t('confirmeSuaSenha')}
                    accessibilityRole="textbox"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={showConfirmPassword ? t('ocultarSenha') : t('mostrarSenha')}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#B0B0B0"
                    />
                  </TouchableOpacity>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                
                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={t('botaoCadastrar')}
                  accessibilityHint={loading ? t('processandoCadastro') : t('pressioneParaCadastrar')}
                  accessibilityState={{ disabled: loading }}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.buttonText}>{t('cadastrar')}</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.footer}>
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>{t('jaTemConta')} </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>{t('fazerLogin')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </ScrollView>
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
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

