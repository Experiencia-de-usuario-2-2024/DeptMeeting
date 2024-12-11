import axios from 'axios';

const backendUrl = `http://deptmeeting.diinf.usach.cl/api/auth/signin`;

export const authenticateUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Por favor, complete todos los campos.');
  }

  try {
    const response = await axios.post(backendUrl, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error de autenticación');
    } else {
      throw new Error('Error de red');
    }
  }
};