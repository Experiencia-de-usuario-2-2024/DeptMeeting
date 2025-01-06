import httpClient from "../http-common";

class MeetingMinuteServices {

  async create(meetingMinuteDTO: any) {
    try {
      const response = await httpClient.post(`/meeting-minute`, meetingMinuteDTO);
      console.log("Minuta creada: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear la minuta", error);
      throw error;
    }
  }

  async get(id: string) {
    try {
      const response = await httpClient.get(`/meeting-minute/${id}`);
      console.log("Minuta: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar la minuta", error);
        throw error;
    }
  }

  async update(id: string, meetingMinuteDTO: any) {
    try {
      const response = await httpClient.put(`/meeting-minute/${id}`, meetingMinuteDTO);
      console.log("Minuta actualizada: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al actualizar la minuta", error);
        throw error;
    }
  }

  async getByMeetingId(id: string) {
    try {
      const response = await httpClient.get(`/meeting-minute/meeting/${id}`);
      console.log("Minuta por reunion: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar la minuta", error);
        throw error;
    }
  }

  async createTopic(idMeetingMinute: string, topicDTO: any) {
    try {
      const response = await httpClient.post(`/meeting-minute/${idMeetingMinute}/topic`, topicDTO);
      console.log("Tema creado: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear el tema", error);
      throw error;
    }
  }

  async updateTopic(idTopic: string, topicDTO: any) {
    try {
      const response = await httpClient.put(`/meeting-minute/topic/${idTopic}`, topicDTO);
      console.log("Tema actualizado: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el tema", error);
      throw error;
    }
  }

  async deleteTopic(idTopic: string){
    try {
      const response = await httpClient.delete(`/meeting-minute/topic/${idTopic}`)
      console.log("Tema eliminado: ", response.data);
      return response.data;
    } catch (error){
      console.log("Error al eliminar el tema:", error);
      throw error;
    }
  }

  async getTopicsInMeetingMinuteByIds(idsTopics: string[]) {
    try {
      const response = await httpClient.post(`/meeting-minute/get/topics/byIds`, idsTopics);
        console.log("Temas: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar los temas", error);
        throw error;
    }
  }
}

export default new MeetingMinuteServices();