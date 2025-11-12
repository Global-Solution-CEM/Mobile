import { StyleSheet, ImageBackground } from 'react-native';
import { useMemo } from 'react';

const backgroundImage = require('../assets/bg-inicial.png');

export default function BackgroundImage({ children, style }) {
  // Memoiza a imagem para evitar recarregamento
  const imageSource = useMemo(() => backgroundImage, []);

  return (
    <ImageBackground 
      source={imageSource} 
      style={[styles.container, style]}
      resizeMode="cover"
      imageStyle={styles.image}
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  image: {
    opacity: 1,
  },
});

