import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';

// Mapeamento de IDs de áreas para nomes
const AREAS_NAMES = {
  ia: 'Inteligência Artificial',
  dados: 'Ciência de Dados',
  sustentabilidade: 'Sustentabilidade',
  programacao: 'Programação',
  design: 'Design',
  marketing: 'Marketing Digital',
  gestao: 'Gestão',
  vendas: 'Vendas',
  rh: 'Recursos Humanos',
  financas: 'Finanças',
  saude: 'Saúde',
  educacao: 'Educação',
};

export default function ConfirmacaoInteresses({ navigation }) {
  const { user } = useAuth();
  const [areasInteresse, setAreasInteresse] = useState([]);

  useEffect(() => {
    loadAreasInteresse();
  }, []);

  const loadAreasInteresse = async () => {
    try {
      if (user?.id) {
        const preferences = await AuthStorage.getUserPreferences(user.id);
        if (preferences?.areasInteresse) {
          setAreasInteresse(preferences.areasInteresse);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar áreas de interesse:', error);
    }
  };

  const getAreaDisplay = (areaItem) => {
    // Verificar se é formato novo (objeto) ou antigo (string)
    if (typeof areaItem === 'object' && areaItem.area) {
      return `${AREAS_NAMES[areaItem.area] || areaItem.area} (${areaItem.nivel})`;
    }
    return AREAS_NAMES[areaItem] || areaItem;
  };

  const handleConfirmar = () => {
    navigation.navigate('Home');
  };

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>Confirme seus interesses</Text>
            
            <Text style={styles.description}>
              Revise suas áreas de interesse e níveis de conhecimento selecionados:
            </Text>

            {areasInteresse.length > 0 && (
              <View style={styles.areasSection}>
                {areasInteresse.map((area, index) => (
                  <View 
                    key={typeof area === 'object' ? area.area : area || index} 
                    style={styles.areaItem}
                  >
                    <Text style={styles.areaItemText}>
                      {getAreaDisplay(area)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.confirmarButton} onPress={handleConfirmar}>
              <Text style={styles.confirmarButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </ScrollView>
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
    paddingVertical: 40,
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
    fontSize: 28,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#E0EEFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    opacity: 0.9,
  },
  areasSection: {
    width: '100%',
    marginBottom: 32,
  },
  areaItem: {
    backgroundColor: 'rgba(166, 96, 219, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A660DB',
  },
  areaItemText: {
    color: '#E0EEFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  confirmarButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  confirmarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

