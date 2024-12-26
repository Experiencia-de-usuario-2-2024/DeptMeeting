export const validateEmail = (email: string): boolean => {
  const usachEmailRegex = /^[a-zA-Z0-9._-]+@usach\.cl$/;
  return usachEmailRegex.test(email);
};

export const validateRut = (rut: string): boolean => {
  const rutRegex = /^\d{7,8}-[\dkK]$/;
  return rutRegex.test(rut);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
} => {
  if (!password) {
    return {
      isValid: false,
      strength: 'weak',
      message: 'La contraseña es requerida',
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  const conditions = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isLongEnough,
  ];

  const metConditions = conditions.filter(Boolean).length;

  if (metConditions <= 2) {
    return {
      isValid: false,
      strength: 'weak',
      message: 'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales.',
    };
  }

  if (metConditions <= 3) {
    return {
      isValid: true,
      strength: 'medium',
      message: 'La contraseña es moderada. Añade más variedad para mayor seguridad.',
    };
  }

  return {
    isValid: true,
    strength: 'strong',
    message: 'La contraseña es fuerte.',
  };
};
