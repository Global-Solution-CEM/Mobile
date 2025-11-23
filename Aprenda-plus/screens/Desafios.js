import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import CircularMenu from '../components/CircularMenu';
import HeaderBack from '../components/HeaderBack';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthStorage } from '../services/AuthStorage';
import { GameStorage } from '../services/GameStorage';
import { getCurrentLevelForArea, generateChallengesForArea } from '../services/ChallengesService';
import { getAreasNames } from '../i18n/helpers';

export default function Desafios({ navigation }) {
  const { t } = useI18n();
  const AREAS_NAMES = getAreasNames(t);
  const { user } = useAuth();
  const [areas, setAreas] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    loadDesafios();
  }, []);

  // Recarregar quando voltar para a tela (para atualizar status)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDesafios();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDesafios = async () => {
    try {
      if (user?.id) {
        // Carregar preferências do usuário
        const preferences = await AuthStorage.getUserPreferences(user.id);
        if (preferences?.areasInteresse && preferences.areasInteresse.length > 0) {
          // Pegar até 3 áreas (as primeiras)
          const areasToShow = preferences.areasInteresse.slice(0, 3);
          
          // Carregar desafios concluídos
          const completed = await GameStorage.getCompletedChallenges(user.id);
          
          // Calcular progresso de cada área
          const areasWithProgress = await Promise.all(
            areasToShow.map(async (areaItem) => {
              const area = typeof areaItem === 'object' ? areaItem.area : areaItem;
              const nivel = typeof areaItem === 'object' ? areaItem.nivel : 'Iniciante';
              
              // Obter nível atual baseado no progresso
              const currentLevel = await getCurrentLevelForArea(user.id, area);
              
              // Gerar desafios para calcular progresso
              const challenges = generateChallengesForArea(area, currentLevel, t);
              
              // Contar desafios completados desta área
              const areaChallenges = challenges.filter(c => c.area === area);
              const completedCount = areaChallenges.filter(c => completed.includes(c.id)).length;
              const progress = areaChallenges.length > 0 
                ? Math.round((completedCount / areaChallenges.length) * 100) 
                : 0;
              
              return {
                area: area,
                nivel: nivel,
                currentLevel: currentLevel,
                progress: progress,
                completedCount: completedCount,
                totalCount: areaChallenges.length,
                name: AREAS_NAMES[area] || area,
                icon: area === 'ia' ? '🤖' : area === 'dados' ? '📊' : area === 'programacao' ? '💻' : '📚',
              };
            })
          );
          
          setAreas(areasWithProgress);
          
          // Calcular progresso geral (média das 3 áreas)
          const totalProgress = areasWithProgress.reduce((sum, a) => sum + a.progress, 0);
          const avgProgress = areasWithProgress.length > 0 
            ? Math.round(totalProgress / areasWithProgress.length) 
            : 0;
          setOverallProgress(avgProgress);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
    }
  };

  const handleAreaPress = (areaData) => {
    navigation.navigate('DesafiosPorArea', { area: areaData });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 50) return '#FFA500';
    return '#007AFF';
  };

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <HeaderBack navigation={navigation} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Progresso Geral */}
          <BlurView intensity={80} tint="dark" style={styles.progressCard}>
            <Text style={styles.progressTitle}>{t('seuProgresso')}</Text>
            <Text style={styles.progressPercent}>{overallProgress}%</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${overallProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              Progresso geral das suas áreas de estudo
            </Text>
          </BlurView>

          {/* Cards de Áreas */}
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>{t('desafios')}</Text>
            <Text style={styles.description}>
              Escolha uma área para ver seus desafios e revisar o conteúdo! 📚
            </Text>

            {areas.length > 0 ? (
              <View style={styles.areasContainer}>
                {areas.map((areaData) => {
                  const progressColor = getProgressColor(areaData.progress);
                  return (
                    <TouchableOpacity
                      key={areaData.area}
                      style={styles.areaCard}
                      activeOpacity={0.7}
                      onPress={() => handleAreaPress(areaData)}
                    >
                      <View style={styles.areaHeader}>
                        <Text style={styles.areaIcon}>{areaData.icon}</Text>
                        <View style={styles.areaInfo}>
                          <Text style={styles.areaName}>{areaData.name}</Text>
                          <Text style={styles.areaLevel}>
                            {t('nivel')}: {areaData.currentLevel}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Progresso da área */}
                      <View style={styles.areaProgressContainer}>
                        <View style={styles.areaProgressHeader}>
                          <Text style={styles.areaProgressLabel}>{t('progresso')}</Text>
                          <Text style={[styles.areaProgressPercent, { color: progressColor }]}>
                            {areaData.progress}%
                          </Text>
                        </View>
                        <View style={styles.areaProgressBar}>
                          <View
                            style={[
                              styles.areaProgressFill,
                              { width: `${areaData.progress}%`, backgroundColor: progressColor },
                            ]}
                          />
                        </View>
                        <Text style={styles.areaProgressText}>
                          {areaData.completedCount} de {areaData.totalCount} desafios completos
                        </Text>
                      </View>
                      
                      <View style={styles.areaFooter}>
                        <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={64} color="#B0B0B0" />
                <Text style={styles.emptyStateText}>
                  Selecione áreas de interesse no onboarding para ver desafios
                </Text>
              </View>
            )}
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="Desafios" />
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
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressTitle: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  progressPercent: {
    fontSize: 32,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  progressSubtext: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  areasContainer: {
    width: '100%',
  },
  areaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  areaIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 20,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  areaLevel: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  areaProgressContainer: {
    marginTop: 8,
  },
  areaProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  areaProgressLabel: {
    fontSize: 14,
    color: '#E0EEFF',
    fontWeight: '600',
  },
  areaProgressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  areaProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  areaProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  areaProgressText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  areaFooter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
});

