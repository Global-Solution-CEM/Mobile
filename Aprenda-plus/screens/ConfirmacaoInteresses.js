import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';
import { CoursesService } from '../services/CoursesService';
import { useI18n } from '../i18n/I18nContext';
import { getAreasNames } from '../i18n/helpers';

export default function ConfirmacaoInteresses({ navigation }) {
  const { t } = useI18n();
  const AREAS_NAMES = getAreasNames(t);
  const { user, saveUserPreferences } = useAuth();
  const [areasInteresse, setAreasInteresse] = useState([]);
  const [cursosSugeridos, setCursosSugeridos] = useState([]);

  useEffect(() => {
    loadAreasInteresse();
  }, []);

  useEffect(() => {
    if (areasInteresse.length > 0) {
      loadCursosSugeridos();
    }
  }, [areasInteresse]);

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

  const loadCursosSugeridos = async () => {
    try {
      if (user?.id && areasInteresse.length > 0) {
        // Carregar recomendações usando a API
        const result = await CoursesService.getSuggestedCourses(
          user.id,
          areasInteresse,
          {
            name: user.name,
            email: user.email,
          }
        );
        
        if (result.success && result.data) {
          setCursosSugeridos(result.data);
        } else {
          console.warn('Erro ao carregar recomendações:', result.error);
          setCursosSugeridos([]);
        }
      } else {
        setCursosSugeridos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos sugeridos:', error);
      setCursosSugeridos([]);
    }
  };

  const getAreaDisplay = (areaItem) => {
    // Verificar se é formato novo (objeto) ou antigo (string)
    if (typeof areaItem === 'object' && areaItem.area) {
      return `${AREAS_NAMES[areaItem.area] || areaItem.area} (${areaItem.nivel})`;
    }
    return AREAS_NAMES[areaItem] || areaItem;
  };

  const handleConfirmar = async () => {
    // Marcar onboarding como completo e navegar para Home
    const result = await saveUserPreferences(areasInteresse, true);
    if (result.success) {
      navigation.navigate('Home');
    }
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
            <Text style={styles.title}>{t('confirmeInteresses')}</Text>
            
            <Text style={styles.description}>
              {t('confirmeInteressesDesc')}
            </Text>

            {areasInteresse.length > 0 && (
              <View style={styles.areasSection}>
                <Text style={styles.sectionTitle}>{t('suasAreasInteresse')}</Text>
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

            {cursosSugeridos.length > 0 && (
              <View style={styles.cursosSection}>
                <Text style={styles.sectionTitle}>{t('cursosSugeridos')}</Text>
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
            )}

            <TouchableOpacity style={styles.confirmarButton} onPress={handleConfirmar}>
              <Text style={styles.confirmarButtonText}>{t('confirmarContinuar')}</Text>
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
  sectionTitle: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  areasSection: {
    width: '100%',
    marginBottom: 24,
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

