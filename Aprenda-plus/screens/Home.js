import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';
import { getCursosSugeridos } from '../services/CursosService';

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

export default function Home({ navigation }) {
  const { user, logout } = useAuth();
  const [cursosSugeridos, setCursosSugeridos] = useState([]);
  const [areasInteresse, setAreasInteresse] = useState([]);

  useEffect(() => {
    loadCursosSugeridos();
  }, []);

  const loadCursosSugeridos = async () => {
    try {
      if (user?.id) {
        const preferences = await AuthStorage.getUserPreferences(user.id);
        if (preferences?.areasInteresse) {
          setAreasInteresse(preferences.areasInteresse);
          const cursos = getCursosSugeridos(preferences.areasInteresse);
          setCursosSugeridos(cursos);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cursos sugeridos:', error);
    }
  };

  const getAreaDisplay = (areaItem) => {
    // Verificar se é formato novo (objeto) ou antigo (string)
    if (typeof areaItem === 'object' && areaItem.area) {
      return `${AREAS_NAMES[areaItem.area] || areaItem.area} (${areaItem.nivel})`;
    }
    return AREAS_NAMES[areaItem] || areaItem;
  };

  const handleLogout = async () => {
    await logout();
    // Navegação será feita automaticamente pelo App.js quando isAuthenticated mudar
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
            <Text style={styles.title}>Bem-vindo, {user?.name || 'Usuário'}!</Text>
            
            {areasInteresse.length > 0 && (
              <View style={styles.areasSection}>
                <Text style={styles.sectionTitle}>Suas áreas de interesse:</Text>
                <View style={styles.areasTags}>
                  {areasInteresse.map((area, index) => (
                    <View key={typeof area === 'object' ? area.area : area || index} style={styles.areaTag}>
                      <Text style={styles.areaTagText}>
                        {getAreaDisplay(area)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {cursosSugeridos.length > 0 ? (
              <View style={styles.cursosSection}>
                <Text style={styles.sectionTitle}>Cursos sugeridos para você:</Text>
                {cursosSugeridos.map((curso) => (
                  <View key={curso.id} style={styles.cursoCard}>
                    <Text style={styles.cursoIcon}>{curso.icone}</Text>
                    <View style={styles.cursoInfo}>
                      <Text style={styles.cursoTitulo}>{curso.titulo}</Text>
                      <Text style={styles.cursoDescricao}>{curso.descricao}</Text>
                      <View style={styles.cursoMeta}>
                        <Text style={styles.cursoMetaText}>{curso.duracao}</Text>
                        <Text style={styles.cursoMetaText}>•</Text>
                        <Text style={styles.cursoMetaText}>{curso.nivel}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhum curso sugerido no momento.
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sair</Text>
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
    justifyContent: 'flex-start',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  areasSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#A660DB',
    fontWeight: '600',
    marginBottom: 12,
  },
  areasTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  areaTag: {
    backgroundColor: 'rgba(166, 96, 219, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#A660DB',
  },
  areaTagText: {
    color: '#E0EEFF',
    fontSize: 12,
    fontWeight: '500',
  },
  cursosSection: {
    width: '100%',
    marginBottom: 24,
  },
  cursoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cursoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cursoInfo: {
    flex: 1,
  },
  cursoTitulo: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  cursoDescricao: {
    fontSize: 13,
    color: '#B0B0B0',
    marginBottom: 8,
    lineHeight: 18,
  },
  cursoMeta: {
    flexDirection: 'row',
  },
  cursoMetaText: {
    fontSize: 12,
    color: '#A660DB',
    fontWeight: '500',
    marginRight: 8,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
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

