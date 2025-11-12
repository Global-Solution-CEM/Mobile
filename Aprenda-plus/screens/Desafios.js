import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import CircularMenu from '../components/CircularMenu';
import HeaderBack from '../components/HeaderBack';
import { useI18n } from '../i18n/I18nContext';

export default function Desafios({ navigation }) {
  const { t } = useI18n();
  const [desafios, setDesafios] = useState([]);

  useEffect(() => {
    loadDesafios();
  }, []);

  const loadDesafios = () => {
    // Dados simulados - em produção viria de uma API
    setDesafios([
      {
        id: '1',
        titulo: 'Desafio: Criar seu primeiro modelo de ML',
        descricao: 'Implemente um modelo de machine learning do zero e publique os resultados',
        dificuldade: 'Intermediário',
        pontos: 500,
        prazo: '7 dias',
        status: 'disponivel',
        icone: '🎯',
      },
      {
        id: '2',
        titulo: 'Desafio: Dashboard de Análise de Dados',
        descricao: 'Crie um dashboard interativo com visualizações de dados reais',
        dificuldade: 'Avançado',
        pontos: 1000,
        prazo: '14 dias',
        status: 'emAndamento',
        icone: '📊',
      },
      {
        id: '3',
        titulo: 'Desafio: App Mobile Completo',
        descricao: 'Desenvolva um aplicativo mobile funcional com todas as features',
        dificuldade: 'Avançado',
        pontos: 1500,
        prazo: '30 dias',
        status: 'disponivel',
        icone: '📱',
      },
      {
        id: '4',
        titulo: 'Desafio: API RESTful',
        descricao: 'Construa uma API REST completa com autenticação e documentação',
        dificuldade: 'Intermediário',
        pontos: 800,
        status: 'concluido',
        icone: '🔌',
      },
    ]);
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
            <Text style={styles.title}>{t('desafios')}</Text>
            <Text style={styles.description}>{t('desafiosDescricao')}</Text>

            {desafios.length > 0 ? (
              <View style={styles.desafiosContainer}>
                {desafios.map((desafio) => {
                  const statusColor = getStatusColor(desafio.status);
                  return (
                    <TouchableOpacity
                      key={desafio.id}
                      style={styles.desafioCard}
                      activeOpacity={0.7}
                    >
                      <View style={styles.desafioHeader}>
                        <Text style={styles.desafioIcon}>{desafio.icone}</Text>
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
                        {desafio.prazo && (
                          <View style={styles.desafioBadge}>
                            <Ionicons name="time-outline" size={14} color="#B0B0B0" />
                            <Text style={styles.desafioBadgeText}>{desafio.prazo}</Text>
                          </View>
                        )}
                      </View>
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
  desafiosContainer: {
    width: '100%',
  },
  desafioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  desafioHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  desafioIcon: {
    fontSize: 32,
    marginRight: 12,
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

