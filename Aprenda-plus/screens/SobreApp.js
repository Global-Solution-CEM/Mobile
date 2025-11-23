import { StyleSheet, Text, View, ScrollView, Linking, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';
import HeaderBack from '../components/HeaderBack';
import CircularMenu from '../components/CircularMenu';
import { useI18n } from '../i18n/I18nContext';
import { COMMIT_HASH, APP_VERSION, BUILD_DATE } from '../utils/buildInfo';

const LOGO = require('../assets/Aprenda.png');

const DEVELOPERS = [
  {
    name: 'Cícero Gabriel Oliveira Serafim',
    rm: 'RM556996',
    github: 'https://github.com/ciceroserafim',
  },
  {
    name: 'Eduardo Miguel Forato Monteiro',
    rm: 'RM555871',
    github: 'https://github.com/EduardoMiguelFM',
  },
  {
    name: "Murillo Ari Sant'Anna",
    rm: 'RM557183',
    github: 'https://github.com/Murillo77',
  },
];

export default function SobreApp({ navigation }) {
  const { t } = useI18n();

  const handleGithubPress = (url) => {
    Linking.openURL(url).catch((err) => console.error('Erro ao abrir URL:', err));
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
            <View style={styles.header}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Ionicons name="information-circle" size={48} color="#007AFF" style={styles.icon} />
              <Text style={styles.title}>Sobre o App</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Desenvolvedores</Text>
              {DEVELOPERS.map((dev, index) => (
                <View key={index} style={styles.developerCard}>
                  <View style={styles.developerInfo}>
                    <Ionicons name="person-circle" size={32} color="#007AFF" style={styles.developerIcon} />
                    <View style={styles.developerDetails}>
                      <Text style={styles.developerName}>{dev.name}</Text>
                      <Text style={styles.developerRM}>{dev.rm}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.githubButton}
                    onPress={() => handleGithubPress(dev.github)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-github" size={20} color="#FFFFFF" />
                    <Text style={styles.githubButtonText}>GitHub</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações da Versão</Text>
              <View style={styles.versionCard}>
                <View style={styles.versionRow}>
                  <Ionicons name="code-working" size={20} color="#007AFF" style={styles.versionIcon} />
                  <Text style={styles.versionLabel}>Commit Hash:</Text>
                </View>
                <Text style={styles.versionValue} selectable>
                  {COMMIT_HASH}
                </Text>
                <View style={[styles.versionRow, { marginTop: 12 }]}>
                  <Ionicons name="pricetag" size={20} color="#007AFF" style={styles.versionIcon} />
                  <Text style={styles.versionLabel}>Versão:</Text>
                  <Text style={styles.versionLabelValue}>{APP_VERSION}</Text>
                </View>
                <View style={[styles.versionRow, { marginTop: 8 }]}>
                  <Ionicons name="calendar" size={20} color="#007AFF" style={styles.versionIcon} />
                  <Text style={styles.versionLabel}>Build:</Text>
                  <Text style={styles.versionLabelValue}>{BUILD_DATE}</Text>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Aprenda+</Text>
              <Text style={styles.footerSubtext}>Plataforma de aprendizado gamificado</Text>
            </View>
          </BlurView>
        </View>
      </ScrollView>
      
      <CircularMenu navigation={navigation} currentRoute="SobreApp" />
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    color: '#E0EEFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  developerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  developerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  developerIcon: {
    marginRight: 12,
  },
  developerDetails: {
    flex: 1,
  },
  developerName: {
    fontSize: 16,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  developerRM: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  githubButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  versionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  versionIcon: {
    marginRight: 8,
  },
  versionLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 12,
    color: '#E0EEFF',
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  versionLabelValue: {
    fontSize: 14,
    color: '#E0EEFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 20,
    color: '#E0EEFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#B0B0B0',
  },
});

