import httpClient from "../http-common";

class UserServices {

  async get(id: string) {
    try {
      const response = await httpClient.get(`/user/perfil/${id}`);
      console.log("Usuario: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar el usuario", error);
        throw error;
    }
  }

  async getUsersByOwnerEmail(email: string){
    try {
      const response = await httpClient.get(`/user/list/email/${email}`);
      console.log("Usuarios: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar el usuario", error);
        throw error;
    }
  }

  // Jyr comentario: posiblemente se deba borrar este método
  async updateParticipants(email: string, userDTO: any) {
    try {
      const response = await httpClient.put(`/user/update/${email}/usuarioperfl`, userDTO);
      return response.data;
    } catch (error) {
        console.error("Error al actualizar el usuario", error);
        throw error;
    }
  }

  async getGuestUserData(email: string) {
    try {
        const response = await httpClient.get(`/user/perfil/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error al cargar el usuario", error);
        throw error;
    }
  }



}

export default new UserServices();