// Configuração da API
// Integrado com API de recomendações com IA (FastAPI/Python - IOT)
// DETECÇÃO AUTOMÁTICA DE IP - Funciona direto sem configuração!

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Função para detectar IP automaticamente do Expo
const getExpoHostIP = () => {
  try {
    // Expo fornece o host automaticamente quando você usa expo start
    // Constants.expoConfig.hostUri contém algo como "192.168.1.100:8081"
    if (Constants.expoConfig?.hostUri) {
      const hostUri = Constants.expoConfig.hostUri;
      // Extrair apenas o IP (remover porta do Expo)
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
    
    // Tentar pegar do debuggerHost
    if (Constants.expoConfig?.debuggerHost) {
      const debuggerHost = Constants.expoConfig.debuggerHost;
      const ip = debuggerHost.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
    
    // Tentar pegar do manifest
    if (Constants.manifest?.hostUri) {
      const hostUri = Constants.manifest.hostUri;
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  } catch (error) {
    // Ignorar erros silenciosamente
  }
  return null;
};

const getBaseURL = () => {
  if (!__DEV__) {
    return 'https://api.aprendaplus.com'; // Produção
  }
  
  // Tentar detectar IP automaticamente do Expo (para dispositivo físico)
  const detectedIP = getExpoHostIP();
  
  // Desenvolvimento local - detecta plataforma automaticamente
  if (Platform.OS === 'android') {
    if (detectedIP) {
      // Dispositivo físico Android - usar IP detectado automaticamente
      console.log(`📱 IP detectado automaticamente: ${detectedIP}`);
      return `http://${detectedIP}:8000`;
    }
    // Android Emulator - usa 10.0.2.2
    return 'http://10.0.2.2:8000';
  } else if (Platform.OS === 'ios') {
    if (detectedIP) {
      // Dispositivo físico iOS - usar IP detectado automaticamente
      console.log(`📱 IP detectado automaticamente: ${detectedIP}`);
      return `http://${detectedIP}:8000`;
    }
    // iOS Simulator - usa localhost
    return 'http://localhost:8000';
  } else {
    // Web ou outras plataformas - usa localhost
    return 'http://localhost:8000';
  }
};

const API_CONFIG = {
  // URL base da API de recomendações com IA (FastAPI/Python)
  BASE_URL: getBaseURL(),
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 30000, // 30 segundos
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;

