// Utilitários de validação para formulários

/**
 * Valida formato de email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida senha (mínimo 6 caracteres)
 * @param {string} password 
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

/**
 * Valida nome (mínimo 2 caracteres, apenas letras e espaços)
 * @param {string} name 
 * @returns {boolean}
 */
export const isValidName = (name) => {
  if (!name) return false;
  const trimmedName = name.trim();
  if (trimmedName.length < 2) return false;
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  return nameRegex.test(trimmedName);
};

/**
 * Valida se as senhas coincidem
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {boolean}
 */
export const passwordsMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) return false;
  return password === confirmPassword;
};

/**
 * Obtém mensagem de erro de validação
 * @param {string} field 
 * @param {string} value 
 * @param {object} options 
 * @returns {string|null}
 */
export const getValidationError = (field, value, options = {}) => {
  // Se value for undefined ou null, tratar como string vazia
  const fieldValue = value || '';
  
  switch (field) {
    case 'email':
      if (!fieldValue) return 'Email é obrigatório';
      if (!isValidEmail(fieldValue)) return 'Email inválido';
      return null;
    
    case 'password':
      if (!fieldValue) return 'Senha é obrigatória';
      if (!isValidPassword(fieldValue)) return 'Senha deve ter pelo menos 6 caracteres';
      return null;
    
    case 'confirmPassword':
      if (!fieldValue) return 'Confirmação de senha é obrigatória';
      if (!passwordsMatch(options.password || '', fieldValue)) return 'As senhas não coincidem';
      return null;
    
    case 'name':
      if (!fieldValue) return 'Nome é obrigatório';
      if (!isValidName(fieldValue)) return 'Nome deve ter pelo menos 2 caracteres e conter apenas letras';
      return null;
    
    default:
      return null;
  }
};

/**
 * Valida todos os campos de um formulário
 * @param {object} fields 
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateForm = (fields) => {
  const errors = {};
  let isValid = true;

  Object.keys(fields).forEach((field) => {
    const error = getValidationError(field, fields[field], fields);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export default {
  isValidEmail,
  isValidPassword,
  isValidName,
  passwordsMatch,
  getValidationError,
  validateForm,
};

