import { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_RADIUS = 120;
const ITEM_SIZE = 60;
const BUTTON_POSITION = { top: 50, right: 30 };

const MENU_ITEMS = [
  { id: 'home', label: 'Início', icon: 'home', route: 'Home' },
  { id: 'cursos', label: 'Meus Cursos', icon: 'book', route: 'MeusCursos' },
  { id: 'trilhas', label: 'Trilhas', icon: 'map', route: 'Trilhas' },
  { id: 'desafios', label: 'Desafios', icon: 'trophy', route: 'Desafios' },
  { id: 'perfil', label: 'Perfil', icon: 'person', route: 'Perfil' },
];

export default function CircularMenu({ navigation, currentRoute = 'Home' }) {
  const [rotation, setRotation] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const lastAngle = useRef(0);
  const isRotating = useRef(false);

  // Encontrar índice da rota atual
  const getCurrentIndex = () => {
    const idx = MENU_ITEMS.findIndex(item => item.route === currentRoute);
    return idx >= 0 ? idx : 0;
  };

  // Calcular posição do centro do botão
  const getCenterPosition = () => {
    return {
      x: SCREEN_WIDTH - BUTTON_POSITION.right - ITEM_SIZE / 2,
      y: BUTTON_POSITION.top + ITEM_SIZE / 2,
    };
  };

  // Calcular ângulo a partir de coordenadas
  const getAngle = (x, y) => {
    const center = getCenterPosition();
    const dx = x - center.x;
    const dy = y - center.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  // Handlers de toque para rotação - SIMPLES E DIRETO
  const handleTouchStart = (evt) => {
    if (!isOpen) return;
    const { pageX, pageY } = evt.nativeEvent;
    lastAngle.current = getAngle(pageX, pageY);
    isRotating.current = true;
  };

  const handleTouchMove = (evt) => {
    if (!isOpen || !isRotating.current) return;
    
    const { pageX, pageY } = evt.nativeEvent;
    const currentAngle = getAngle(pageX, pageY);
    
    let deltaAngle = currentAngle - lastAngle.current;
    
    // Normalizar o ângulo para evitar saltos
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;
    
    const newRotation = rotation + deltaAngle;
    setRotation(newRotation);
    lastAngle.current = currentAngle;
    
    // Atualizar animação diretamente
    rotationAnim.setValue(newRotation);
  };

  const handleTouchEnd = () => {
    if (!isOpen || !isRotating.current) return;
    isRotating.current = false;
    
    // Snap para o item mais próximo
    const itemsCount = MENU_ITEMS.length;
    const anglePerItem = 360 / itemsCount;
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const nearestIndex = Math.round(normalizedRotation / anglePerItem) % itemsCount;
    const targetRotation = nearestIndex * anglePerItem;
    
    setRotation(targetRotation);
    Animated.spring(rotationAnim, {
      toValue: targetRotation,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      // Resetar rotação para o item atual
      const currentIdx = getCurrentIndex();
      const anglePerItem = 360 / MENU_ITEMS.length;
      const targetRotation = currentIdx * anglePerItem;
      setRotation(targetRotation);
      rotationAnim.setValue(targetRotation);
      
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleItemPress = (item) => {
    // Parar rotação se estiver acontecendo
    isRotating.current = false;
    
    if (item.route && item.route !== currentRoute) {
      navigation.navigate(item.route);
    }
    toggleMenu();
  };

  // Interpolação para rotação
  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [-720, -360, 0, 360, 720],
    outputRange: ['-720deg', '-360deg', '0deg', '360deg', '720deg'],
    extrapolate: 'clamp',
  });

  return (
    <>
      {/* Overlay escuro quando menu está aberto */}
      {isOpen && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: scaleAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={toggleMenu}
          />
        </Animated.View>
      )}

      <View style={styles.container}>
        {/* Itens do menu em círculo */}
        {isOpen && (
          <Animated.View
            style={[
              styles.circleContainer,
              {
                transform: [
                  { rotate: rotateInterpolate },
                  { scale: scaleAnim },
                ],
                opacity: scaleAnim,
              },
            ]}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {MENU_ITEMS.map((item, index) => {
              const angle = (index * 360) / MENU_ITEMS.length;
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * CIRCLE_RADIUS;
              const y = Math.sin(radian) * CIRCLE_RADIUS;
              
              const isActive = currentRoute === item.route;
              
              // Rotação inversa para manter os ícones sempre na posição correta
              const itemRotation = rotationAnim.interpolate({
                inputRange: [-720, -360, 0, 360, 720],
                outputRange: ['720deg', '360deg', '0deg', '-360deg', '-720deg'],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={item.id}
                  style={[
                    styles.menuItem,
                    {
                      transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: itemRotation },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.menuItemButton,
                      isActive && styles.menuItemButtonActive,
                    ]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={isActive ? '#007AFF' : '#E0EEFF'}
                    />
                  </TouchableOpacity>
                  <Animated.View 
                    style={[
                      styles.menuItemLabel,
                      { opacity: scaleAnim },
                    ]}
                  >
                    <Text style={styles.menuItemLabelText}>{item.label}</Text>
                  </Animated.View>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}

        {/* Botão principal central */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <BlurView intensity={80} tint="dark" style={styles.mainButtonBlur}>
            <Ionicons
              name={isOpen ? 'close' : 'menu'}
              size={28}
              color="#E0EEFF"
            />
          </BlurView>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    top: BUTTON_POSITION.top,
    right: BUTTON_POSITION.right,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    width: CIRCLE_RADIUS * 2 + ITEM_SIZE,
    height: CIRCLE_RADIUS * 2 + ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1001,
  },
  mainButtonBlur: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 122, 255, 0.9)', // Azul #007AFF
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemButton: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItemButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)', // Azul #007AFF
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  menuItemLabel: {
    position: 'absolute',
    top: -35,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  menuItemLabelText: {
    color: '#E0EEFF',
    fontSize: 11,
    fontWeight: '500',
  },
});
