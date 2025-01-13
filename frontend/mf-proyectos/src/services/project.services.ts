import httpClient from "../http-common";

class ProjectServices {

    async createPeriod(periodDTO: any) {
        try {
            const response = await httpClient.post("/project/period", periodDTO);
            console.log("Periodo creado: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al crear el periodo", error);
            throw error;
        }
    }

    async getPeriods() {
        try {
            const response = await httpClient.get(`/project/period`);
            console.log("Periodos: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al cargar los periodos", error);
            throw error;
        }
    }

    async getPeriod(id: string){
        try {
            const response = await httpClient.get(`/project/period/${id}`);
            console.log("Periodo: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al cargar el periodo", error);
            throw error;
        }
    }

    async addMeetingToPeriod(periodId: string, meetingId: string){
        try {
            console.log("Añadiendo reunión al periodo: ", periodId, meetingId);
            const response = await httpClient.put(`/project/period/${periodId}/meeting/${meetingId}`);
            console.log("Reunión añadida al periodo: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al añadir la reunión al periodo", error);
            throw error;
        }
    }
}

export default new ProjectServices();