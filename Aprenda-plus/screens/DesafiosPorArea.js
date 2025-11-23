import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import HeaderBack from '../components/HeaderBack';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { GameStorage } from '../services/GameStorage';
import { generateChallengesForArea, getCurrentLevelForArea } from '../services/ChallengesService';
import { getAreasNames } from '../i18n/helpers';

export default function DesafiosPorArea({ route, navigation }) {
  const { t } = useI18n();
  const AREAS_NAMES = getAreasNames(t);
  const { user } = useAuth();
  const areaData = route.params?.area || route.params; // { area: 'ia', nivel: 'Iniciante' }
  const [desafios, setDesafios] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(areaData.nivel || 'Iniciante');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadDesafios();
  }, []);

  // Recarregar quando voltar para a tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDesafios();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDesafios = async () => {
    try {
      if (user?.id) {
        const areaId = areaData.area || areaData;
        
        // Obter nível atual baseado no progresso
        const level = await getCurrentLevelForArea(user.id, areaId);
        setCurrentLevel(level);

        // Gerar desafios para esta área (10 desafios)
        const challenges = generateChallengesForArea(areaId, level, t);
        
        // Carregar desafios concluídos
        const completed = await GameStorage.getCompletedChallenges(user.id);
        
        // Calcular progresso
        const areaChallenges = challenges.filter(c => c.area === areaId);
        const completedCount = areaChallenges.filter(c => completed.includes(c.id)).length;
        const progressPercent = areaChallenges.length > 0 
          ? Math.round((completedCount / areaChallenges.length) * 100) 
          : 0;
        setProgress(progressPercent);

        // Marcar status dos desafios
        const challengesWithStatus = challenges.map((challenge) => {
          const isCompleted = completed.includes(challenge.id);
          return {
            ...challenge,
            status: isCompleted ? 'concluido' : 'disponivel',
          };
        });

        setDesafios(challengesWithStatus);
      }
    } catch (error) {
      console.error('Erro ao carregar desafios da área:', error);
    }
  };

  const handleChallengePress = (desafio) => {
    if (desafio.status === 'concluido') {
      return;
    }
    navigation.navigate('DesafioJogo', { desafio });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido':
        return '#4CAF50';
      case 'emAndamento':
        return '#FFA500';
      default:
        return '#007AFF';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'concluido':
        return t('concluido');
      case 'emAndamento':
        return t('emAndamento');
      default:
        return t('disponivel');
    }
  };

  const areaId = areaData.area || areaData;
  const areaName = AREAS_NAMES[areaId] || areaId;
  const areaIcon = areaId === 'ia' ? '🤖' : areaId === 'dados' ? '📊' : areaId === 'programacao' ? '💻' : '📚';

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <HeaderBack navigation={navigation} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.headerCard}>
            <View style={styles.headerContent}>
              <Text style={styles.areaIcon}>{areaIcon}</Text>
              <View style={styles.headerInfo}>
                <Text style={styles.areaTitle}>{areaName}</Text>
                <Text style={styles.levelText}>
                  {t('nivel')}: {currentLevel}
                </Text>
              </View>
            </View>
            
            {/* Progresso da área */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{t('progresso')}</Text>
                <Text style={styles.progressPercent}>{progress}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>
            </View>
          </BlurView>

          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>{t('desafios')}</Text>
            <Text style={styles.description}>
              Complete os desafios para avançar de nível! 🚀
            </Text>

            {desafios.length > 0 ? (
              <View style={styles.desafiosContainer}>
                {desafios.map((desafio, index) => {
                  const statusColor = getStatusColor(desafio.status);
                  const isLocked = index > 0 && desafios[index - 1].status !== 'concluido';
                  
                  return (
                    <TouchableOpacity
                      key={desafio.id}
                      style={[
                        styles.desafioCard,
                        isLocked && styles.desafioCardLocked,
                      ]}
                      activeOpacity={0.7}
                      onPress={() => !isLocked && handleChallengePress(desafio)}
                      disabled={desafio.status === 'concluido' || isLocked}
                    >
                      <View style={styles.desafioHeader}>
                        <View style={styles.desafioNumber}>
                          {desafio.status === 'concluido' ? (
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                          ) : isLocked ? (
                            <Ionicons name="lock-closed" size={24} color="#B0B0B0" />
                          ) : (
                            <Text style={styles.desafioNumberText}>{index + 1}</Text>
                          )}
                        </View>
                        <View style={styles.desafioInfo}>
                          <Text style={styles.desafioTitulo}>{desafio.titulo}</Text>
                          <Text style={styles.desafioDescricao}>{desafio.descricao}</Text>
                        </View>
                      </View>
                      <View style={styles.desafioMeta}>
                        <View style={styles.desafioBadge}>
                          <Ionicons name="trophy" size={14} color="#FFD700" />
                          <Text style={styles.desafioBadgeText}>{desafio.pontos} {t('pontos')}</Text>
                        </View>
                        <View style={styles.desafioBadge}>
                          <Ionicons name="flag" size={14} color="#B0B0B0" />
                          <Text style={styles.desafioBadgeText}>{desafio.dificuldade}</Text>
                        </View>
                      </View>
                      {!isLocked && (
                        <View style={styles.desafioFooter}>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: `${statusColor}20`, borderColor: statusColor },
                            ]}
                          >
                            <View
                              style={[styles.statusDot, { backgroundColor: statusColor }]}
                            />
                            <Text style={[styles.statusText, { color: statusColor }]}>
                              {getStatusText(desafio.status)}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                        </View>
                      )}
                      {isLocked && (
                        <View style={styles.lockedMessage}>
                          <Text style={styles.lockedText}>
                            Complete o desafio anterior para desbloquear
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={64} color="#B0B0B0" />
                <Text style={styles.emptyStateText}>{t('nenhumDesafioDisponivel')}</Text>
              </View>
            )}
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
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  areaIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  areaTitle: {
    fontSize: 24,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#E0EEFF',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
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
  card: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  desafiosContainer: {
    width: '100%',
  },
  desafioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  desafioCardLocked: {
    opacity: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  desafioHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  desafioNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  desafioNumberText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  desafioInfo: {
    flex: 1,
  },
  desafioTitulo: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  desafioDescricao: {
    fontSize: 13,
    color: '#B0B0B0',
    lineHeight: 18,
  },
  desafioMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  desafioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  desafioBadgeText: {
    fontSize: 11,
    color: '#E0EEFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  desafioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lockedMessage: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  lockedText: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    fontStyle: 'italic',
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

