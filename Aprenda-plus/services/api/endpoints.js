// Endpoints da API RESTful
// TODO: Atualizar com os endpoints reais da API Java quando estiver disponível

export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Usuários
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: (id) => `/users/${id}`,
    DELETE_USER: (id) => `/users/${id}`,
    PREFERENCES: (id) => `/users/${id}/preferences`,
  },
  
  // Cursos
  COURSES: {
    BASE: '/courses',
    BY_ID: (id) => `/courses/${id}`,
    BY_AREA: (area) => `/courses?area=${area}`,
    SUGGESTED: (userId) => `/courses/suggested/${userId}`,
    ENROLL: (courseId) => `/courses/${courseId}/enroll`,
    PROGRESS: (courseId, userId) => `/courses/${courseId}/progress/${userId}`,
  },
  
  // Trilhas
  TRACKS: {
    BASE: '/tracks',
    BY_ID: (id) => `/tracks/${id}`,
    BY_USER: (userId) => `/tracks/user/${userId}`,
  },
  
  // Desafios
  CHALLENGES: {
    BASE: '/challenges',
    BY_ID: (id) => `/challenges/${id}`,
    BY_USER: (userId) => `/challenges/user/${userId}`,
    COMPLETE: (challengeId) => `/challenges/${challengeId}/complete`,
  },
  
  // Game/Progresso
  GAME: {
    POINTS: (userId) => `/game/points/${userId}`,
    ADD_POINTS: (userId) => `/game/points/${userId}`,
    TROPHIES: (userId) => `/game/trophies/${userId}`,
    COMPLETED_CHALLENGES: (userId) => `/game/completed-challenges/${userId}`,
  },
};

export default API_ENDPOINTS;

