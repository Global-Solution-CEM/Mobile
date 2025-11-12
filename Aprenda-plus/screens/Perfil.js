import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import HeaderBack from '../components/HeaderBack';
import CircularMenu from '../components/CircularMenu';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';
import { useI18n } from '../i18n/I18nContext';

export default function Perfil({ navigation }) {
  const { t } = useI18n();
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert(t('preenchaTodosCampos'), t('preenchaTodosCampos')); // TODO: adicionar tradução específica
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      Alert.alert(t('preenchaTodosCampos'), t('senhasNaoCoincidem'));
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      Alert.alert(t('preenchaTodosCampos'), t('senhaMinima'));
      return;
    }

    setLoading(true);
    const result = await updateProfile(
      formData.name,
      formData.email,
      formData.newPassword || undefined
    );
    setLoading(false);

    if (result.success) {
      Alert.alert(t('perfilAtualizado'), result.message);
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        password: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } else {
      Alert.alert(t('preenchaTodosCampos'), result.message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('excluirConta'),
      t('excluirContaConfirmacao'),
      [
        {
          text: t('cancelar'),
          style: 'cancel',
        },
        {
          text: t('excluirConta'),
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const result = await deleteAccount();
            setLoading(false);

            if (result.success) {
              Alert.alert('Sucesso', result.message);
              // Navegação será feita automaticamente pelo App.js quando isAuthenticated mudar
            } else {
              Alert.alert('Erro', result.message);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('sair'),
      t('sairConfirmacao'),
      [
        {
          text: t('cancelar'),
          style: 'cancel',
        },
        {
          text: t('sair'),
          onPress: async () => {
            await logout();
            // Navegação será feita automaticamente pelo App.js
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <HeaderBack navigation={navigation} title="Voltar" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#E0EEFF" />
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('informacoesPessoais')}</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('nome')}</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder={t('nomeCompleto')}
                  placeholderTextColor="#B0B0B0"
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('email')}</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder={t('email')}
                  placeholderTextColor="#B0B0B0"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={isEditing}
                />
              </View>

              {isEditing && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('novaSenha')}</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={formData.newPassword}
                        onChangeText={(value) => handleInputChange('newPassword', value)}
                        placeholder={t('senha')}
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry={!showNewPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={showNewPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="#B0B0B0"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('confirmarNovaSenha')}</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      placeholder={t('confirmarSenha')}
                      placeholderTextColor="#B0B0B0"
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </>
              )}
            </View>

            <View style={styles.actions}>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>{t('salvarAlteracoes')}</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        password: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    disabled={loading}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>{t('cancelar')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => setIsEditing(true)}
                  >
                    <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>{t('editarPerfil')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>{t('sair')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDeleteAccount}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>{t('excluirConta')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="Perfil" />
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    minHeight: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  userName: {
    fontSize: 24,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#E0EEFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#E0EEFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: '#E0EEFF',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  actions: {
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    color: '#E0EEFF',
  },
  logoutButton: {
    backgroundColor: '#A660DB',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

