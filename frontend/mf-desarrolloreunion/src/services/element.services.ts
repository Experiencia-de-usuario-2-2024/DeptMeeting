import httpClient from "../http-common";

class ElementServices {

    //modificar backend para que este sea el nuevo endpoint
    async getCommitmentsByEmailUser(email: string) {
        try {
            const response = await httpClient.get(`/element/commitments/${email}`);
            console.log("Compromisos: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al cargar los compromisos", error);
            throw error;
        }
    }

    async create(elementDTO: any) {
        try {
            const response = await httpClient.post(`/element`, elementDTO);
            console.log("Elemento creado: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al crear el elemento", error);
            throw error;
        }
    }

    async getElementsInTopicsByIds(idsElements: string[]) {
        try {
            const response = await httpClient.post(`/element/get/byIds`, idsElements);
            console.log("Elementos dialógicos: ", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al cargar los elementos dialogicos", error);
            throw error;
        }
    }

}

export default new ElementServices();