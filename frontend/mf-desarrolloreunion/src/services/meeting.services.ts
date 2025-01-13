import httpClient from "../http-common";

class MeetingServices {

  async get(id: string) {
    try {
      const response = await httpClient.get(`/meeting/${id}`);
      console.log("Reunion:", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar la reunión", error);
        throw error;
    }
  }

  async update(id: string, meetingDTO: any) {
    try {
      const response = await httpClient.put(`/meeting/${id}`, meetingDTO);
      console.log("Reunion actualizada:", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al actualizar la reunión", error);
        throw error;
    }
  }

  async createGCalendarEvent(googleCalendarDTO: any) {
    try {
      const response = await httpClient.post(`/meeting/event`, googleCalendarDTO);
      console.log("Evento en Google Calendar:", response.data);
      return response.data;
    } catch (error) {
        console.error("Error el evento en Google Calendar", error);
        throw error;
    }
  }
}

export default new MeetingServices();