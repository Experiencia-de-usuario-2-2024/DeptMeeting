import httpClient from "../http-common";

class ProjectServices {

  async create(projectDTO: any) {
    try {
      const response = await httpClient.post("/project/create", projectDTO);
      console.log("Proyecto creado: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al crear el proyecto", error);
        throw error;
    }
  }
  async get(id: string) {
    try {
      const response = await httpClient.get(`/project/getProjectbyID/${id}`);
      console.log("Proyecto: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar el proyecto", error);
        throw error;
    }
  }

  async update(id: string, projectDTO: any) {
    try {
      const response = await httpClient.put(`/project/${id}`, projectDTO);
      console.log("Proyecto actualizado: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al actualizar el proyecto", error);
        throw error;
    }
  }

  async getByIds(ids: string[]){
    try {
      const response = await httpClient.post(`/project/get/byids`, ids);
      console.log("Proyectos: ", response.data);
      return response.data;
    } catch (error) {
        console.error("Error al cargar los proyectos", error);
        throw error;
    }
  }
}

export default new ProjectServices();