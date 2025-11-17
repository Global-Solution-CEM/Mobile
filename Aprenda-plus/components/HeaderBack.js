import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../i18n/I18nContext';

export default function HeaderBack({ navigation, title }) {
  const { t } = useI18n();
  const displayTitle = title || t('voltar');
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={t('voltar')}
        accessibilityHint={t('voltarParaTelaAnterior')}
      >
        <Ionicons name="arrow-back" size={24} color="#E0EEFF" />
        <Text style={styles.backText}>{displayTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 110,
    zIndex: 1000,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#E0EEFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

