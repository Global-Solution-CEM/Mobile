import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import CircularMenu from '../components/CircularMenu';
import HeaderBack from '../components/HeaderBack';
import { useI18n } from '../i18n/I18nContext';

export default function Trilhas({ navigation }) {
  const { t } = useI18n();
  const [trilhas, setTrilhas] = useState([]);

  useEffect(() => {
    loadTrilhas();
  }, []);

  const loadTrilhas = () => {
    // Dados simulados - em produção viria de uma API
    setTrilhas([
      {
        id: '1',
        titulo: 'Trilha de Data Science',
        descricao: 'Aprenda desde o básico até técnicas avançadas de análise de dados',
        cursos: 8,
        progresso: 3,
        icone: '📊',
        cor: '#007AFF',
      },
      {
        id: '2',
        titulo: 'Trilha de Inteligência Artificial',
        descricao: 'Domine os conceitos e aplicações práticas de IA e Machine Learning',
        cursos: 12,
        progresso: 0,
        icone: '🤖',
        cor: '#A660DB',
      },
      {
        id: '3',
        titulo: 'Trilha de Desenvolvimento Web',
        descricao: 'Construa aplicações web modernas do zero ao deploy',
        cursos: 10,
        progresso: 5,
        icone: '💻',
        cor: '#4CAF50',
      },
    ]);
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
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>{t('trilhas')}</Text>
            <Text style={styles.description}>{t('trilhasDescricao')}</Text>

            {trilhas.length > 0 ? (
              <View style={styles.trilhasContainer}>
                {trilhas.map((trilha) => (
                  <TouchableOpacity
                    key={trilha.id}
                    style={styles.trilhaCard}
                    activeOpacity={0.7}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${trilha.titulo}, ${trilha.cursos} ${t('cursos')}, ${trilha.progresso > 0 ? `${trilha.progresso} ${t('concluidos')}` : t('naoIniciado')}`}
                    accessibilityHint={t('abrirTrilha')}
                  >
                    <View style={[styles.trilhaHeader, { borderLeftColor: trilha.cor }]}>
                      <Text style={styles.trilhaIcon}>{trilha.icone}</Text>
                      <View style={styles.trilhaInfo}>
                        <Text style={styles.trilhaTitulo}>{trilha.titulo}</Text>
                        <Text style={styles.trilhaDescricao}>{trilha.descricao}</Text>
                      </View>
                    </View>
                    <View style={styles.trilhaFooter}>
                      <View style={styles.trilhaStats}>
                        <Ionicons name="book-outline" size={16} color="#B0B0B0" />
                        <Text style={styles.trilhaStatsText}>
                          {trilha.cursos} {t('cursos')}
                        </Text>
                        {trilha.progresso > 0 && (
                          <>
                            <Text style={styles.trilhaStatsText}>•</Text>
                            <Text style={styles.trilhaStatsText}>
                              {trilha.progresso} {t('concluidos')}
                            </Text>
                          </>
                        )}
                      </View>
                      {trilha.progresso > 0 && (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <View
                              style={[
                                styles.progressFill,
                                {
                                  width: `${(trilha.progresso / trilha.cursos) * 100}%`,
                                  backgroundColor: trilha.cor,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#B0B0B0"
                      style={styles.chevron}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="map-outline" size={64} color="#B0B0B0" />
                <Text style={styles.emptyStateText}>{t('nenhumaTrilhaDisponivel')}</Text>
              </View>
            )}
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="Trilhas" />
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
  trilhasContainer: {
    width: '100%',
  },
  trilhaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  trilhaHeader: {
    flexDirection: 'row',
    borderLeftWidth: 4,
    paddingLeft: 12,
    marginBottom: 12,
  },
  trilhaIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  trilhaInfo: {
    flex: 1,
  },
  trilhaTitulo: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  trilhaDescricao: {
    fontSize: 13,
    color: '#B0B0B0',
    lineHeight: 18,
  },
  trilhaFooter: {
    marginTop: 8,
  },
  trilhaStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trilhaStatsText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginLeft: 4,
    marginRight: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
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

