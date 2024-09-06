import axios from "axios";

const ControlTimeConfig = axios.create({ baseURL: "http://127.0.0.1:8000/api/" });

async function storeControlTime(timeConfig) {
    try {
        console.log(timeConfig)
        const response = await ControlTimeConfig.post(
            "/sync-control-time",
            timeConfig
        );
        console.log(response);
        return response;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

async function getControlTimeById(id) {
    try {
        const response = await ControlTimeConfig.get(`/sync-control-time/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function editControlTime(id, timeData) {
    try {
        console.log(id, timeData);
        
        const response = await ControlTimeConfig.put(
            `/sync-control-time/${id}`,
            timeData
        );
        return response.data;
    } catch (error) {
        console.error("Error editing configs: ", error);
        throw error;
    }
}

async function deleteTime(id){
    try {
        const response = await ControlTimeConfig.delete(`/sync-control-time/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting configs: ", error);
        throw error;
    }
}

export { storeControlTime, getControlTimeById, editControlTime, deleteTime };