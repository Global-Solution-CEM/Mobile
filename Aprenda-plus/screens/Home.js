import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';
import CircularMenu from '../components/CircularMenu';
import HeaderBack from '../components/HeaderBack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';
import { getCursosSugeridos } from '../services/CursosService';
import { useI18n } from '../i18n/I18nContext';

export default function Home({ navigation }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [cursosSugeridos, setCursosSugeridos] = useState([]);

  useEffect(() => {
    loadCursosSugeridos();
  }, []);

  const loadCursosSugeridos = async () => {
    try {
      if (user?.id) {
        const preferences = await AuthStorage.getUserPreferences(user.id);
        if (preferences?.areasInteresse) {
          const cursos = getCursosSugeridos(preferences.areasInteresse);
          setCursosSugeridos(cursos);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cursos sugeridos:', error);
    }
  };


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
            <Text style={styles.title}>{t('cursosSugeridosParaVoce')}</Text>

            {cursosSugeridos.length > 0 ? (
              <View style={styles.cursosSection}>
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
                  {t('nenhumCursoSugerido')}
                </Text>
              </View>
            )}
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="Home" />
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
  title: {
    fontSize: 28,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
});

