import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import HeaderBack from '../components/HeaderBack';
import CircularMenu from '../components/CircularMenu';

const IDIOMAS = [
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
];

export default function Configuracoes({ navigation }) {
  const [modoEscuro, setModoEscuro] = useState(true);
  const [notificacoes, setNotificacoes] = useState(true);
  const [idiomaSelecionado, setIdiomaSelecionado] = useState('pt');

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
            <Text style={styles.title}>Configurações</Text>

            {/* Modo Escuro/Claro */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon" size={24} color="#007AFF" style={styles.settingIcon} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Modo Escuro</Text>
                  <Text style={styles.settingDescription}>
                    Ative para usar o tema escuro
                  </Text>
                </View>
              </View>
              <Switch
                value={modoEscuro}
                onValueChange={setModoEscuro}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor={modoEscuro ? '#FFFFFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            {/* Idioma */}
            <View style={styles.settingSection}>
              <View style={styles.settingHeader}>
                <Ionicons name="language" size={24} color="#007AFF" style={styles.settingIcon} />
                <Text style={styles.sectionTitle}>Idioma</Text>
              </View>
              <Text style={styles.settingDescription}>
                Selecione o idioma do aplicativo
              </Text>
              <View style={styles.idiomaOptions}>
                {IDIOMAS.map((idioma) => (
                  <TouchableOpacity
                    key={idioma.id}
                    style={[
                      styles.idiomaOption,
                      idiomaSelecionado === idioma.id && styles.idiomaOptionSelected,
                    ]}
                    onPress={() => setIdiomaSelecionado(idioma.id)}
                  >
                    <Text style={styles.idiomaFlag}>{idioma.flag}</Text>
                    <Text
                      style={[
                        styles.idiomaLabel,
                        idiomaSelecionado === idioma.id && styles.idiomaLabelSelected,
                      ]}
                    >
                      {idioma.label}
                    </Text>
                    {idiomaSelecionado === idioma.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notificações */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color="#007AFF" style={styles.settingIcon} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Notificações</Text>
                  <Text style={styles.settingDescription}>
                    Receba notificações sobre novos cursos e atualizações
                  </Text>
                </View>
              </View>
              <Switch
                value={notificacoes}
                onValueChange={setNotificacoes}
                trackColor={{ false: '#767577', true: '#007AFF' }}
                thumbColor={notificacoes ? '#FFFFFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="Configuracoes" />
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#B0B0B0',
    lineHeight: 18,
  },
  settingSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
  },
  idiomaOptions: {
    marginTop: 16,
  },
  idiomaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  idiomaOptionSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderColor: '#007AFF',
  },
  idiomaFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  idiomaLabel: {
    flex: 1,
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '500',
  },
  idiomaLabelSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

