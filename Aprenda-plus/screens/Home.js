import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';

export default function Home({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navegação será feita automaticamente pelo App.js quando isAuthenticated mudar
  };

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <BlurView intensity={80} tint="dark" style={styles.card}>
          <Text style={styles.title}>Bem-vindo!</Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{user?.name || 'Usuário'}</Text>
            
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || ''}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </BlurView>
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
  userInfo: {
    width: '100%',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

