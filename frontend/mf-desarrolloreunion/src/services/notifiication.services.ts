import httpClient from "../http-common";

class NotificationServices {

    // cambiar endpoint para que se encargue el ms correcto
    async notifyChangeStatus(notificationDTO: any) {
        try {
            const response = await httpClient.post(`/notification/change/status/meeting`, notificationDTO);
            console.log("Notificación de cambio de estado: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al notificar cambio de estado", error);
            throw error;
        }
    }
}

export default new NotificationServices();