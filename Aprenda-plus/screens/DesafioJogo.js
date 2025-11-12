import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import HeaderBack from '../components/HeaderBack';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { GameStorage } from '../services/GameStorage';
import { getQuizQuestions } from '../services/ChallengesService';

export default function DesafioJogo({ route, navigation }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { desafio } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [pointsEarned, setPointsEarned] = useState(0);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (desafio.tipo === 'quiz') {
      const quizQuestions = getQuizQuestions(desafio.area, desafio.nivel);
      setQuestions(quizQuestions);
    } else {
      // Para outros tipos de desafio, usar quiz como padrão por enquanto
      const quizQuestions = getQuizQuestions(desafio.area, desafio.nivel);
      setQuestions(quizQuestions);
    }
  }, [desafio]);

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevenir múltiplos cliques

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
      // Animação de acerto
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        finishGame(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const finishGame = async (finalScore) => {
    const percentage = (finalScore / questions.length) * 100;
    let points = 0;

    // Calcular pontos baseado na performance
    if (percentage >= 80) {
      points = desafio.pontos; // 100% dos pontos
    } else if (percentage >= 60) {
      points = Math.floor(desafio.pontos * 0.7); // 70% dos pontos
    } else if (percentage >= 40) {
      points = Math.floor(desafio.pontos * 0.5); // 50% dos pontos
    } else {
      points = Math.floor(desafio.pontos * 0.3); // 30% dos pontos
    }

    setPointsEarned(points);
    setGameCompleted(true);

    // Salvar pontos e marcar desafio como concluído
    if (user?.id && points > 0) {
      await GameStorage.addPoints(user.id, points);
      await GameStorage.completeChallenge(user.id, desafio.id);

      // Verificar se ganhou troféu
      if (percentage === 100) {
        await GameStorage.addTrophy(user.id, {
          id: `trophy_${desafio.id}`,
          name: t('trofeuPerfeito'),
          description: t('trofeuPerfeitoDesc'),
          icon: '🏆',
        });
      }
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
    setPointsEarned(0);
  };

  if (questions.length === 0) {
    return (
      <BackgroundImage style={styles.container}>
        <StatusBar style="light" />
        <HeaderBack navigation={navigation} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('carregando')}</Text>
        </View>
      </BackgroundImage>
    );
  }

  if (gameCompleted) {
    const percentage = (score / questions.length) * 100;
    return (
      <BackgroundImage style={styles.container}>
        <StatusBar style="light" />
        <HeaderBack navigation={navigation} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <BlurView intensity={80} tint="dark" style={styles.resultCard}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.resultIcon}>
                  {percentage === 100 ? '🏆' : percentage >= 60 ? '🎉' : '👍'}
                </Text>
              </Animated.View>
              <Text style={styles.resultTitle}>{t('desafioConcluido')}</Text>
              <Text style={styles.resultScore}>
                {score} / {questions.length} {t('acertos')}
              </Text>
              <Text style={styles.resultPercentage}>{Math.round(percentage)}%</Text>
              
              {pointsEarned > 0 && (
                <View style={styles.pointsContainer}>
                  <Ionicons name="trophy" size={24} color="#FFD700" />
                  <Text style={styles.pointsText}>+{pointsEarned} {t('pontos')}</Text>
                </View>
              )}

              {percentage === 100 && (
                <View style={styles.trophyContainer}>
                  <Text style={styles.trophyIcon}>🏆</Text>
                  <Text style={styles.trophyText}>{t('trofeuPerfeito')}</Text>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handlePlayAgain}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionButtonText}>{t('jogarNovamente')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                    {t('voltar')}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </BackgroundImage>
    );
  }

  const question = questions[currentQuestion];

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      <HeaderBack navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{desafio.titulo}</Text>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {currentQuestion + 1} / {questions.length}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((currentQuestion + 1) / questions.length) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correct;
                const showCorrect = showResult && isCorrect;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionSelected,
                      showCorrect && styles.optionCorrect,
                      showIncorrect && styles.optionIncorrect,
                    ]}
                    onPress={() => handleAnswer(index)}
                    disabled={showResult}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    {showCorrect && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                    {showIncorrect && (
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {showResult && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  {selectedAnswer === question.correct ? t('correto') : t('incorreto')}
                </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#E0EEFF',
    fontSize: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  questionContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  questionText: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  optionCorrect: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  optionIncorrect: {
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  optionText: {
    fontSize: 16,
    color: '#E0EEFF',
    flex: 1,
  },
  feedbackContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0EEFF',
  },
  resultCard: {
    borderRadius: 20,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultScore: {
    fontSize: 20,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  resultPercentage: {
    fontSize: 48,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  pointsText: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trophyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  trophyText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#E0EEFF',
  },
});

