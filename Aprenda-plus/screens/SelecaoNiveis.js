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

const NIVEIS = [
  { id: 'Iniciante', name: 'Iniciante', descricao: 'Estou começando', icon: '🌱' },
  { id: 'Intermediário', name: 'Intermediário', descricao: 'Tenho alguma experiência', icon: '📚' },
  { id: 'Avançado', name: 'Avançado', descricao: 'Tenho bastante experiência', icon: '🚀' },
];

export default function SelecaoNiveis({ route, navigation }) {
  const { areasSelecionadas } = route.params || { areasSelecionadas: [] };
  const [niveisPorArea, setNiveisPorArea] = useState({});
  const { saveUserPreferences } = useAuth();

  const getAreaInfo = (areaId) => {
    return AREAS_INTERESSE.find((area) => area.id === areaId);
  };

  const selecionarNivel = (areaId, nivel) => {
    setNiveisPorArea((prev) => ({
      ...prev,
      [areaId]: nivel,
    }));
  };

  const handleFinalizar = async () => {
    // Verificar se todas as áreas têm nível selecionado
    const todasAreasComNivel = areasSelecionadas.every(
      (areaId) => niveisPorArea[areaId]
    );

    if (!todasAreasComNivel) {
      Alert.alert('Atenção', 'Selecione o nível de conhecimento para todas as áreas');
      return;
    }

    // Criar array de áreas com níveis
    const areasComNiveis = areasSelecionadas.map((areaId) => ({
      area: areaId,
      nivel: niveisPorArea[areaId],
    }));

    const result = await saveUserPreferences(areasComNiveis);
    
    if (result.success) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Erro', 'Não foi possível salvar suas preferências. Tente novamente.');
    }
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
            <Text style={styles.title}>Qual seu nível de conhecimento?</Text>
            
            <Text style={styles.description}>
              Para cada área selecionada, informe seu nível atual de conhecimento. Isso nos ajudará a sugerir cursos adequados para você!
            </Text>

            {areasSelecionadas.map((areaId) => {
              const areaInfo = getAreaInfo(areaId);
              const nivelSelecionado = niveisPorArea[areaId];

              return (
                <View key={areaId} style={styles.areaSection}>
                  <View style={styles.areaHeader}>
                    <Text style={styles.areaIcon}>{areaInfo?.icon}</Text>
                    <Text style={styles.areaName}>{areaInfo?.name}</Text>
                  </View>

                  <View style={styles.niveisContainer}>
                    {NIVEIS.map((nivel) => {
                      const isSelected = nivelSelecionado === nivel.id;
                      return (
                        <TouchableOpacity
                          key={nivel.id}
                          style={[
                            styles.nivelButton,
                            isSelected && styles.nivelButtonSelected,
                          ]}
                          onPress={() => selecionarNivel(areaId, nivel.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.nivelIcon}>{nivel.icon}</Text>
                          <Text
                            style={[
                              styles.nivelName,
                              isSelected && styles.nivelNameSelected,
                            ]}
                          >
                            {nivel.name}
                          </Text>
                          <Text
                            style={[
                              styles.nivelDescricao,
                              isSelected && styles.nivelDescricaoSelected,
                            ]}
                          >
                            {nivel.descricao}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={[
                styles.finalizarButton,
                areasSelecionadas.length !== Object.keys(niveisPorArea).length &&
                  styles.finalizarButtonDisabled,
              ]}
              onPress={handleFinalizar}
              disabled={
                areasSelecionadas.length !== Object.keys(niveisPorArea).length
              }
            >
              <Text style={styles.finalizarButtonText}>Finalizar</Text>
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
    justifyContent: 'flex-start',
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
  areaSection: {
    width: '100%',
    marginBottom: 32,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  areaIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  areaName: {
    fontSize: 18,
    color: '#A660DB',
    fontWeight: '600',
  },
  niveisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nivelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nivelButtonSelected: {
    backgroundColor: 'rgba(166, 96, 219, 0.3)',
    borderColor: '#A660DB',
    borderWidth: 2,
  },
  nivelIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  nivelName: {
    fontSize: 12,
    color: '#E0EEFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  nivelNameSelected: {
    color: '#E0EEFF',
  },
  nivelDescricao: {
    fontSize: 10,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  nivelDescricaoSelected: {
    color: '#E0EEFF',
  },
  finalizarButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  finalizarButtonDisabled: {
    opacity: 0.5,
  },
  finalizarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

