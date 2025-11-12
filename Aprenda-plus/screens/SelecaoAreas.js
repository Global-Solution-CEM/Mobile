import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import BackgroundImage from '../components/BackgroundImage';
import { useAuth } from '../contexts/AuthContext';

const AREAS_INTERESSE = [
  { id: 'ia', name: 'Inteligência Artificial', icon: '🤖' },
  { id: 'dados', name: 'Ciência de Dados', icon: '📊' },
  { id: 'sustentabilidade', name: 'Sustentabilidade', icon: '🌱' },
  { id: 'programacao', name: 'Programação', icon: '💻' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'marketing', name: 'Marketing Digital', icon: '📱' },
  { id: 'gestao', name: 'Gestão', icon: '📈' },
  { id: 'vendas', name: 'Vendas', icon: '💼' },
  { id: 'rh', name: 'Recursos Humanos', icon: '👥' },
  { id: 'financas', name: 'Finanças', icon: '💰' },
  { id: 'saude', name: 'Saúde', icon: '🏥' },
  { id: 'educacao', name: 'Educação', icon: '📚' },
];

export default function SelecaoAreas({ navigation }) {
  const [areasSelecionadas, setAreasSelecionadas] = useState([]);
  const { saveUserPreferences } = useAuth();

  const toggleArea = (areaId) => {
    setAreasSelecionadas((prev) => {
      if (prev.includes(areaId)) {
        return prev.filter((id) => id !== areaId);
      } else {
        // Limitar a 3 áreas
        if (prev.length >= 3) {
          Alert.alert('Atenção', 'Você pode selecionar no máximo 3 áreas de interesse');
          return prev;
        }
        return [...prev, areaId];
      }
    });
  };

  const handleContinuar = async () => {
    if (areasSelecionadas.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma área de interesse');
      return;
    }

    if (areasSelecionadas.length > 3) {
      Alert.alert('Atenção', 'Selecione no máximo 3 áreas de interesse');
      return;
    }

    // Navegar para tela de seleção de níveis
    navigation.navigate('SelecaoNiveis', { areasSelecionadas });
  };

  return (
    <BackgroundImage style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BlurView intensity={80} tint="dark" style={styles.card}>
            <Text style={styles.title}>Selecione suas áreas de interesse</Text>
            
            <Text style={styles.description}>
              Escolha até 3 áreas que mais te interessam. Isso nos ajudará a sugerir cursos personalizados para você!
            </Text>

            <View style={styles.areasContainer}>
              {AREAS_INTERESSE.map((area) => {
                const isSelected = areasSelecionadas.includes(area.id);
                return (
                  <TouchableOpacity
                    key={area.id}
                    style={[
                      styles.areaButton,
                      isSelected && styles.areaButtonSelected,
                    ]}
                    onPress={() => toggleArea(area.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.areaIcon}>{area.icon}</Text>
                    <Text
                      style={[
                        styles.areaText,
                        isSelected && styles.areaTextSelected,
                      ]}
                    >
                      {area.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                areasSelecionadas.length === 0 && styles.continueButtonDisabled,
              ]}
              onPress={handleContinuar}
              disabled={areasSelecionadas.length === 0}
            >
              <Text style={styles.continueButtonText}>
                Continuar ({areasSelecionadas.length} selecionada{areasSelecionadas.length !== 1 ? 's' : ''})
              </Text>
            </TouchableOpacity>
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
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#E0EEFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    opacity: 0.9,
  },
  areasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  areaButton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  areaButtonSelected: {
    backgroundColor: 'rgba(166, 96, 219, 0.3)',
    borderColor: '#A660DB',
    borderWidth: 2,
  },
  areaIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  areaText: {
    fontSize: 12,
    color: '#E0EEFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  areaTextSelected: {
    color: '#E0EEFF',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

