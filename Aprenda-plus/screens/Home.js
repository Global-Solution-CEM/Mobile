import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import CircularMenu from '../components/CircularMenu';
import HeaderBack from '../components/HeaderBack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';
import { GameStorage } from '../services/GameStorage';
import { CoursesService } from '../services/CoursesService';
import { getCurrentLevelForArea, generateChallengesForArea } from '../services/ChallengesService';
import { useI18n } from '../i18n/I18nContext';

export default function Home({ navigation }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [cursosSugeridos, setCursosSugeridos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    cursosEmAndamento: 0,
    cursosConcluidos: 0,
    desafiosCompletos: 0,
    pontos: 0,
    progressoGeral: 0,
  });
  const [proximoCurso, setProximoCurso] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Recarregar quando voltar para a tela (para atualizar pontos)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user?.id) {
        // Carregar pontos reais
        const pontos = await GameStorage.getUserPoints(user.id);
        const completedChallenges = await GameStorage.getCompletedChallenges(user.id);
        
        // Carregar cursos reais
        const cursosEmAndamento = await GameStorage.getCoursesInProgress(user.id);
        const cursosConcluidos = await GameStorage.getCompletedCourses(user.id);
        
        // Calcular progresso geral baseado nas 3 áreas de interesse
        const preferences = await AuthStorage.getUserPreferences(user.id);
        let progressoGeral = 0;
        
        if (preferences?.areasInteresse && preferences.areasInteresse.length > 0) {
          // Pegar até 3 áreas
          const areasToShow = preferences.areasInteresse.slice(0, 3);
          
          // Calcular progresso de cada área
          const areasProgress = await Promise.all(
            areasToShow.map(async (areaItem) => {
              const area = typeof areaItem === 'object' ? areaItem.area : areaItem;
              const currentLevel = await getCurrentLevelForArea(user.id, area);
              const challenges = generateChallengesForArea(area, currentLevel, t);
              
              const areaChallenges = challenges.filter(c => c.area === area);
              const completedCount = areaChallenges.filter(c => completedChallenges.includes(c.id)).length;
              const progress = areaChallenges.length > 0 
                ? Math.round((completedCount / areaChallenges.length) * 100) 
                : 0;
              
              return progress;
            })
          );
          
          // Progresso geral é a média das 3 áreas
          if (areasProgress.length > 0) {
            const totalProgress = areasProgress.reduce((sum, p) => sum + p, 0);
            progressoGeral = Math.round(totalProgress / areasProgress.length);
          }
        } else {
          // Fallback: usar sistema antigo se não houver áreas
          const averagePerformance = await GameStorage.getAveragePerformance(user.id);
          const totalChallenges = completedChallenges.length;
          const totalCourses = cursosEmAndamento.length + cursosConcluidos.length;
          
          if (totalChallenges > 0 || totalCourses > 0) {
            const performanceWeight = averagePerformance * 0.6;
            const coursesWeight = totalCourses > 0 ? ((cursosConcluidos.length / totalCourses) * 100) * 0.3 : 0;
            const challengesWeight = totalChallenges > 0 ? Math.min((totalChallenges / 10) * 100, 100) * 0.1 : 0;
            progressoGeral = Math.round(performanceWeight + coursesWeight + challengesWeight);
          }
        }
        
        setStats(prev => ({
          ...prev,
          pontos: pontos,
          desafiosCompletos: completedChallenges.length,
          cursosEmAndamento: cursosEmAndamento.length,
          cursosConcluidos: cursosConcluidos.length,
          progressoGeral: Math.min(progressoGeral, 100),
        }));
        
        // Carregar recomendações de cursos usando a API
        if (preferences?.areasInteresse) {
          setLoadingRecommendations(true);
          const result = await CoursesService.getSuggestedCourses(
            user.id,
            preferences.areasInteresse,
            {
              name: user.name,
              email: user.email,
            }
          );
          
          if (result.success && result.data) {
            setCursosSugeridos(result.data);
            if (result.data.length > 0) {
              setProximoCurso(result.data[0]);
            }
            
            // Mostrar aviso se estiver usando fallback
            if (result.fallback) {
              setError({
                type: 'warning',
                message: 'Usando dados locais. Verifique a conexão com a API.',
              });
            }
          } else {
            const errorMessage = result.error?.message || 'Erro ao carregar recomendações';
            setError({
              type: 'error',
              message: errorMessage,
            });
            setCursosSugeridos([]);
          }
          setLoadingRecommendations(false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setError({
        type: 'error',
        message: 'Erro ao carregar dados. Tente novamente.',
      });
      Alert.alert(
        'Erro',
        'Não foi possível carregar os dados do dashboard. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('bomDia');
    if (hour < 18) return t('boaTarde');
    return t('boaNoite');
  };


  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <HeaderBack navigation={navigation} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel={t('conteudoPrincipal')}
      >
        <View style={styles.content}>
          {/* Header com Saudação */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name?.split(' ')[0] || t('usuario')}!</Text>
            </View>
            <View style={styles.pontosContainer}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.pontosText}>{stats.pontos}</Text>
            </View>
          </View>

          {/* Progresso Geral */}
          <BlurView intensity={80} tint="dark" style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{t('seuProgresso')}</Text>
              <Text style={styles.progressPercent}>{stats.progressoGeral}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${stats.progressoGeral}%` },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.progressSubtext}>{t('continueAssim')}</Text>
          </BlurView>

          {/* Cards de Estatísticas */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('MeusCursos')}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${t('cursosEmAndamento')}: ${stats.cursosEmAndamento}`}
              accessibilityHint={t('verMeusCursos')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.2)' }]}>
                <Ionicons name="book" size={24} color="#007AFF" />
              </View>
              <Text style={styles.statNumber}>{stats.cursosEmAndamento}</Text>
              <Text style={styles.statLabel}>{t('emAndamento')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('MeusCursos')}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${t('cursosConcluidos')}: ${stats.cursosConcluidos}`}
              accessibilityHint={t('verMeusCursos')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>{stats.cursosConcluidos}</Text>
              <Text style={styles.statLabel}>{t('concluidos')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('Desafios')}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${t('desafios')}: ${stats.desafiosCompletos}`}
              accessibilityHint={t('verDesafios')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(166, 96, 219, 0.2)' }]}>
                <Ionicons name="trophy" size={24} color="#A660DB" />
              </View>
              <Text style={styles.statNumber}>{stats.desafiosCompletos}</Text>
              <Text style={styles.statLabel}>{t('desafios')}</Text>
            </TouchableOpacity>
          </View>

          {/* Próximo Curso */}
          {proximoCurso && (
            <BlurView intensity={80} tint="dark" style={styles.nextCourseCard}>
              <View style={styles.nextCourseHeader}>
                <Ionicons name="play-circle" size={20} color="#007AFF" />
                <Text style={styles.nextCourseTitle}>{t('continueAprendendo')}</Text>
              </View>
              <TouchableOpacity
                style={styles.nextCourseContent}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('MeusCursos')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${t('continueAprendendo')}: ${proximoCurso.titulo}`}
                accessibilityHint={t('abrirCurso')}
              >
                <Text style={styles.nextCourseIcon}>{proximoCurso.icone}</Text>
                <View style={styles.nextCourseInfo}>
                  <Text style={styles.nextCourseName}>{proximoCurso.titulo}</Text>
                  <Text style={styles.nextCourseDesc}>{proximoCurso.descricao}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
              </TouchableOpacity>
            </BlurView>
          )}

          {/* Cursos Sugeridos */}
          <BlurView intensity={80} tint="dark" style={styles.suggestedCard}>
            <View style={styles.suggestedHeader}>
              <Ionicons name="sparkles" size={20} color="#FFD700" />
              <Text style={styles.suggestedTitle}>{t('cursosSugeridosParaVoce')}</Text>
            </View>
            
            {loadingRecommendations ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando recomendações...</Text>
              </View>
            ) : error && error.type === 'error' ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                <Text style={styles.errorText}>{error.message}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={loadDashboardData}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh" size={16} color="#007AFF" />
                  <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : cursosSugeridos.length > 0 ? (
              <>
                {error && error.type === 'warning' && (
                  <View style={styles.warningContainer}>
                    <Ionicons name="information-circle" size={16} color="#FFA500" />
                    <Text style={styles.warningText}>{error.message}</Text>
                  </View>
                )}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestedScroll}
                >
                  {cursosSugeridos.slice(0, 5).map((curso) => (
                    <TouchableOpacity
                      key={curso.id}
                      style={styles.suggestedItem}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestedIcon}>{curso.icone}</Text>
                      <Text style={styles.suggestedItemTitle} numberOfLines={2}>
                        {curso.titulo}
                      </Text>
                      <Text style={styles.suggestedItemLevel}>{curso.nivel}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={32} color="#B0B0B0" />
                <Text style={styles.emptyText}>Nenhum curso sugerido no momento</Text>
              </View>
            )}
          </BlurView>

          {/* Ações Rápidas */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Trilhas')}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('explorarTrilhas')}
              accessibilityHint={t('verTrilhasDeAprendizado')}
            >
              <Ionicons name="map" size={24} color="#E0EEFF" />
              <Text style={styles.quickActionText}>{t('explorarTrilhas')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Desafios')}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('verDesafios')}
              accessibilityHint={t('verDesafiosDisponiveis')}
            >
              <Ionicons name="trophy" size={24} color="#E0EEFF" />
              <Text style={styles.quickActionText}>{t('verDesafios')}</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 130,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 18,
    color: '#B0B0B0',
    fontWeight: '400',
  },
  userName: {
    fontSize: 28,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  pontosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  pontosText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  nextCourseCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextCourseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextCourseTitle: {
    fontSize: 14,
    color: '#E0EEFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  nextCourseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextCourseIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  nextCourseInfo: {
    flex: 1,
  },
  nextCourseName: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  nextCourseDesc: {
    fontSize: 12,
    color: '#B0B0B0',
    lineHeight: 16,
  },
  suggestedCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestedTitle: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestedScroll: {
    paddingRight: 8,
  },
  suggestedItem: {
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  suggestedIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  suggestedItemTitle: {
    fontSize: 12,
    color: '#E0EEFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 32,
  },
  suggestedItemLevel: {
    fontSize: 10,
    color: '#A660DB',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  quickActionText: {
    fontSize: 12,
    color: '#E0EEFF',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#B0B0B0',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  retryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  warningText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#FFA500',
    flex: 1,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});

