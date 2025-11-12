import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import CircularMenu from '../components/CircularMenu';
import HeaderBack from '../components/HeaderBack';
import { useI18n } from '../i18n/I18nContext';

export default function MeusCursos({ navigation }) {
  const { t } = useI18n();
  const [cursosEmAndamento, setCursosEmAndamento] = useState([]);
  const [cursosConcluidos, setCursosConcluidos] = useState([]);

  useEffect(() => {
    // Simular carregamento de cursos
    loadMeusCursos();
  }, []);

  const loadMeusCursos = () => {
    // Dados simulados - em produção viria de uma API
    setCursosEmAndamento([
      {
        id: '1',
        titulo: 'Introdução à Inteligência Artificial',
        progresso: 45,
        icone: '🤖',
      },
      {
        id: '2',
        titulo: 'Análise de Dados com Python',
        progresso: 30,
        icone: '📊',
      },
    ]);
    setCursosConcluidos([
      {
        id: '3',
        titulo: 'Fundamentos de Programação',
        icone: '💻',
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
            <Text style={styles.title}>{t('meusCursos')}</Text>

            {/* Cursos em Andamento */}
            {cursosEmAndamento.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('cursosEmAndamento')}</Text>
                {cursosEmAndamento.map((curso) => (
                  <TouchableOpacity
                    key={curso.id}
                    style={styles.cursoCard}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cursoIcon}>{curso.icone}</Text>
                    <View style={styles.cursoInfo}>
                      <Text style={styles.cursoTitulo}>{curso.titulo}</Text>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${curso.progresso}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>{curso.progresso}%</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Cursos Concluídos */}
            {cursosConcluidos.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('cursosConcluidos')}</Text>
                {cursosConcluidos.map((curso) => (
                  <TouchableOpacity
                    key={curso.id}
                    style={styles.cursoCard}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cursoIcon}>{curso.icone}</Text>
                    <View style={styles.cursoInfo}>
                      <Text style={styles.cursoTitulo}>{curso.titulo}</Text>
                      <View style={styles.concluidoBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.concluidoText}>{t('concluido')}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Estado vazio */}
            {cursosEmAndamento.length === 0 && cursosConcluidos.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={64} color="#B0B0B0" />
                <Text style={styles.emptyStateText}>{t('nenhumCursoInscrito')}</Text>
                <Text style={styles.emptyStateSubtext}>{t('comeceAExplorar')}</Text>
              </View>
            )}
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="MeusCursos" />
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
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  cursoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '500',
    minWidth: 40,
  },
  concluidoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  concluidoText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
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
  emptyStateSubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 8,
    textAlign: 'center',
  },
});

