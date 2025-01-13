import httpClient from "../http-common";

class MeetingServices {


    async create(meetingDTO: any) {
        try {
            const response = await httpClient.post("/meeting", meetingDTO);
            console.log("Reunion creada:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al crear la reunión", error);
            throw error;
        }
    }

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

    async getByIds(ids: string[]){
        try {
            const response = await httpClient.post(`/meeting/get/byids`, ids);
            console.log("Reuniones:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al cargar las reuniones", error);
            throw error;
        }
    }

}

export default new MeetingServices();