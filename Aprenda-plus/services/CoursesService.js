// Serviço de Cursos
// Preparado para integração futura com API Java
// Atualmente usa dados mockados, mas pode ser facilmente migrado para API

import { getCursosSugeridos, getCursosPorArea, CURSOS } from './CursosService';
import { read, create } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';
import { handleApiError, handleApiSuccess } from './api/errorHandler';

// Flag para alternar entre dados mockados e API
// TODO: Alterar para true quando a API Java estiver pronta
const USE_API = false;

export const CoursesService = {
  /**
   * Obter todos os cursos
   * @returns {Promise<{success: boolean, data?: array, error?: object}>}
   */
  async getAllCourses() {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.COURSES.BASE);
        return result.success 
          ? handleApiSuccess(result.data)
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com dados mockados
      return {
        success: true,
        data: CURSOS,
      };
    }
  },

  /**
   * Obter curso por ID
   * @param {string} courseId 
   * @returns {Promise<{success: boolean, data?: object, error?: object}>}
   */
  async getCourseById(courseId) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.COURSES.BY_ID(courseId));
        return result.success 
          ? handleApiSuccess(result.data)
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com dados mockados
      return {
        success: false,
        error: { message: 'Curso não encontrado' },
      };
    }
  },

  /**
   * Obter cursos por área
   * @param {string} area 
   * @returns {Promise<{success: boolean, data?: array, error?: object}>}
   */
  async getCoursesByArea(area) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.COURSES.BY_AREA(area));
        return result.success 
          ? handleApiSuccess(result.data)
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com dados mockados
      const courses = getCursosPorArea(area);
      return {
        success: true,
        data: courses,
      };
    }
  },

  /**
   * Obter cursos sugeridos para o usuário
   * @param {string} userId 
   * @param {array} areasInteresse 
   * @returns {Promise<{success: boolean, data?: array, error?: object}>}
   */
  async getSuggestedCourses(userId, areasInteresse) {
    if (USE_API) {
      try {
        const result = await read(API_ENDPOINTS.COURSES.SUGGESTED(userId));
        return result.success 
          ? handleApiSuccess(result.data)
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual com dados mockados
      const courses = getCursosSugeridos(areasInteresse);
      return {
        success: true,
        data: courses,
      };
    }
  },

  /**
   * Inscrever usuário em um curso
   * @param {string} courseId 
   * @param {string} userId 
   * @returns {Promise<{success: boolean, message: string, data?: object}>}
   */
  async enrollInCourse(courseId, userId) {
    if (USE_API) {
      try {
        const result = await create(API_ENDPOINTS.COURSES.ENROLL(courseId), {
          userId,
        });
        return result.success 
          ? handleApiSuccess(result.data, 'Inscrição realizada com sucesso!')
          : handleApiError(result.error);
      } catch (error) {
        return handleApiError(error);
      }
    } else {
      // Implementação atual - apenas retorna sucesso
      return {
        success: true,
        message: 'Inscrição realizada com sucesso!',
      };
    }
  },
};

export default CoursesService;

