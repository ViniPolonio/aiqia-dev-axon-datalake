import axios from "axios";

const ConfigsTableApi = axios.create({ baseURL: "http://192.168.1.153:8008/api" });

async function getLogsById(id) {
    try {
        const response = await ConfigsTableApi.get(`/sync-control-logs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function nextPage(link) {
    try {
        const response = await axios.get(link);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
    
}

export {
    getLogsById,
    nextPage,
}