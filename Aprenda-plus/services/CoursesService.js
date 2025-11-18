// Serviço de Cursos
// Integrado com API de recomendações com IA (FastAPI/Python)

import { getCursosSugeridos, getCursosPorArea, CURSOS } from './CursosService';
import { read, create, request } from './api/apiClient';
import { API_ENDPOINTS } from './api/endpoints';
import { handleApiError, handleApiSuccess } from './api/errorHandler';
import { AuthStorage } from './AuthStorage';

// Flag para alternar entre dados mockados e API
// Ativado para recomendações (API IOT), desativado para outros endpoints
const USE_API_RECOMMENDATIONS = true;
const USE_API = false;

/**
 * Normaliza o nível de conhecimento para o formato esperado pela API
 * @param {string} nivel 
 * @returns {string}
 */
const normalizeNivel = (nivel) => {
  if (!nivel) return 'iniciante';
  
  const nivelLower = nivel.toLowerCase();
  if (nivelLower.includes('iniciante') || nivelLower.includes('beginner')) {
    return 'iniciante';
  }
  if (nivelLower.includes('intermediario') || nivelLower.includes('intermediate')) {
    return 'intermediario';
  }
  if (nivelLower.includes('avancado') || nivelLower.includes('advanced')) {
    return 'avancado';
  }
  return 'iniciante'; // Padrão
};

/**
 * Mapeia áreas do app para áreas compatíveis com a API atualizada
 * A API suporta: ia, ciencia_dados, sustentabilidade, programacao, design, 
 * marketing_digital, gestao, vendas, rh, financas, saude, educacao
 * @param {string} area - Área do app
 * @returns {string} - Área compatível com a API
 */
const mapearAreaParaAPI = (area) => {
  const mapeamento = {
    // Áreas que existem diretamente na API
    'ia': 'ia',
    'programacao': 'programacao',
    'sustentabilidade': 'sustentabilidade',
    'design': 'design',
    'gestao': 'gestao',
    'vendas': 'vendas',
    'rh': 'rh',
    'financas': 'financas',
    'saude': 'saude',
    'educacao': 'educacao',
    
    // Mapeamentos de nomes alternativos
    'dados': 'ciencia_dados', // Ciência de dados existe na API
    'marketing': 'marketing_digital', // Marketing digital existe na API
    'iot': 'sustentabilidade', // IoT pode mapear para sustentabilidade (tecnologias verdes)
    'seguranca': 'programacao', // Segurança pode mapear para programação (cybersecurity)
  };
  
  // Retornar mapeamento ou a própria área se já estiver no formato correto
  return mapeamento[area] || area || 'programacao'; // Padrão: programação
};

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
   * Obter cursos sugeridos para o usuário usando IA Generativa
   * @param {string} userId 
   * @param {array} areasInteresse - Array de objetos {area: string, nivel: string} ou array simples de strings
   * @param {object} userInfo - Informações adicionais do usuário (opcional)
   * @returns {Promise<{success: boolean, data?: array, error?: object}>}
   */
  async getSuggestedCourses(userId, areasInteresse, userInfo = {}) {
    if (USE_API_RECOMMENDATIONS) {
      try {
        // Obter informações do usuário
        const user = await AuthStorage.getUser();
        
        // Normalizar áreas de interesse para o formato esperado pela API
        // A API aceita: ia, ciencia_dados, sustentabilidade, programacao, design, 
        // marketing_digital, gestao, vendas, rh, financas, saude, educacao
        let areasInteresseNormalizadas = [];
        if (Array.isArray(areasInteresse) && areasInteresse.length > 0) {
          console.log('🔍 Áreas de interesse recebidas (antes do processamento):', areasInteresse);
          
          if (typeof areasInteresse[0] === 'object' && areasInteresse[0].area) {
            // Formato novo: [{area: 'ia', nivel: 'Iniciante'}, ...]
            // Mapear áreas do app para áreas compatíveis com a API
            areasInteresseNormalizadas = areasInteresse.map(item => {
              const areaMapeada = mapearAreaParaAPI(item.area);
              const nivelNormalizado = normalizeNivel(item.nivel || 'iniciante');
              console.log(`  📍 Mapeando: ${item.area} (${item.nivel}) → ${areaMapeada} (${nivelNormalizado})`);
              return {
                area: areaMapeada,
                nivel: nivelNormalizado
              };
            });
          } else {
            // Formato antigo: ['ia', 'dados', ...] - converter para formato novo
            areasInteresseNormalizadas = areasInteresse.map(area => {
              const areaMapeada = mapearAreaParaAPI(area);
              console.log(`  📍 Mapeando: ${area} → ${areaMapeada} (iniciante)`);
              return {
                area: areaMapeada,
                nivel: 'iniciante' // Nível padrão
              };
            });
          }
          
          // Remover duplicatas (caso múltiplas áreas mapeiem para a mesma área da API)
          const areasUnicas = new Map();
          areasInteresseNormalizadas.forEach(item => {
            const key = `${item.area}_${item.nivel}`;
            if (!areasUnicas.has(key)) {
              areasUnicas.set(key, item);
            }
          });
          areasInteresseNormalizadas = Array.from(areasUnicas.values());
          
          console.log('✅ Áreas normalizadas para envio à API:', areasInteresseNormalizadas);
          
          // Validação: garantir que pelo menos uma área foi mapeada corretamente
          if (areasInteresseNormalizadas.length === 0) {
            console.error('❌ ERRO: Nenhuma área válida após normalização!');
            console.error('❌ Áreas originais:', areasInteresse);
            throw new Error('Nenhuma área de interesse válida encontrada');
          }
        } else {
          console.warn('⚠️ Nenhuma área de interesse fornecida!');
          throw new Error('É necessário fornecer pelo menos uma área de interesse');
        }

        // Obter cursos completos e em andamento (se disponíveis)
        // Por enquanto, usar arrays vazios - pode ser expandido no futuro
        const cursosCompletos = userInfo.cursosCompletos || [];
        const cursosEmAndamento = userInfo.cursosEmAndamento || [];
        const progressoCursos = userInfo.progressoCursos || {};

        // Construir payload para a API (seguindo especificação da API)
        // IMPORTANTE: user_id no body deve ser igual ao user_id da URL
        const payload = {
          user_profile: {
            user_id: userId, // Deve ser igual ao userId da URL
            name: user?.name || userInfo.name || null,
            email: user?.email || userInfo.email || null,
            areas_interesse: areasInteresseNormalizadas, // Array de {area, nivel}
            cursos_completos: cursosCompletos || [],
            cursos_em_andamento: cursosEmAndamento || [],
            progresso_cursos: progressoCursos || {},
          },
          limit: 10 // opcional, padrão é 10, máximo é 20
        };

        // Log para debug
        const endpoint = API_ENDPOINTS.COURSES.SUGGESTED(userId);
        console.log('🔍 Solicitando recomendações:', {
          endpoint,
          userId,
          areasCount: areasInteresseNormalizadas.length,
          areasInteresse: areasInteresseNormalizadas,
          payload: JSON.stringify(payload, null, 2),
        });

        // Fazer requisição POST para a API de recomendações
        // IMPORTANTE: Este endpoint REQUER POST, não GET
        console.log('📤 Enviando requisição POST para:', endpoint);
        const result = await request(
          'POST', // Método POST obrigatório
          endpoint,
          payload
        );

        if (result.success && result.data) {
          const recommendationsCount = result.data.recommendations?.length || 0;
          console.log('✅ Recomendações recebidas:', recommendationsCount);
          
          // Se não recebeu recomendações, logar detalhes para debug
          if (recommendationsCount === 0) {
            console.warn('⚠️ API retornou 0 recomendações!');
            console.warn('⚠️ Áreas enviadas:', areasInteresseNormalizadas);
            console.warn('⚠️ Resposta completa da API:', JSON.stringify(result.data, null, 2));
            console.warn('💡 A API pode não ter encontrado cursos correspondentes às áreas/níveis enviados');
            console.warn('💡 Áreas disponíveis na API: ia, ciencia_dados, sustentabilidade, programacao, design, marketing_digital, gestao, vendas, rh, financas, saude, educacao');
            console.warn('💡 Níveis disponíveis: iniciante, intermediario, avancado');
            console.warn('💡 Usando fallback para dados mockados...');
            
            // Fallback: usar dados mockados se API não retornou nada
            const fallbackCourses = getCursosSugeridos(areasInteresse);
            if (fallbackCourses.length > 0) {
              console.log('✅ Fallback: usando', fallbackCourses.length, 'cursos mockados');
              return {
                success: true,
                data: fallbackCourses,
                fallback: true,
                message: 'API retornou 0 recomendações, usando dados mockados',
              };
            }
          }
          
          // Converter resposta da API para o formato esperado pelo app
          const recommendations = result.data.recommendations || [];
          const courses = recommendations.map(rec => ({
            id: rec.course?.id || rec.course_id,
            titulo: rec.course?.titulo || rec.course?.title || '',
            descricao: rec.course?.descricao || rec.course?.description || '',
            area: rec.course?.area || '',
            nivel: rec.course?.nivel || rec.course?.level || '',
            duracao: rec.course?.duracao || rec.course?.duration || '',
            icone: rec.course?.icone || rec.course?.icon || '📚',
            // Informações adicionais da recomendação
            score: rec.score,
            reason: rec.reason,
            compatibility: rec.compatibility,
            suggested_learning_path: rec.suggested_learning_path,
          }));

          return {
            success: true,
            data: courses,
            metadata: {
              profile_analysis: result.data.profile_analysis,
              generated_at: result.data.generated_at,
              model_used: result.data.model_used,
            }
          };
        } else {
          console.error('❌ Erro na resposta da API:', result.error);
          return handleApiError(result.error);
        }
      } catch (error) {
        console.error('❌ Erro ao obter recomendações da API:', error);
        console.error('Detalhes do erro:', {
          type: error.type,
          message: error.message,
          url: error.url,
          details: error.details,
        });
        
        // Fallback para dados mockados em caso de erro
        console.warn('⚠️ Usando dados mockados como fallback devido ao erro de conexão');
        console.warn('💡 Dica: Verifique se a API está rodando em http://localhost:8000');
        console.warn('💡 Para Android Emulator, configure: http://10.0.2.2:8000');
        
        const courses = getCursosSugeridos(areasInteresse);
        return {
          success: true,
          data: courses,
          fallback: true,
          error: error.message || 'Erro de conexão com a API',
        };
      }
    } else {
      // Implementação com dados mockados
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

