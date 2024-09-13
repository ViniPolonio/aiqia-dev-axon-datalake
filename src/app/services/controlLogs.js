import axios from "axios";

const ConfigsTableApi = axios.create({ baseURL: "http://127.0.0.1:8000/api" });

async function getLogsById(id) {
    try {
        const response = await ConfigsTableApi.get(`/sync-control-logs/${id}`);
        console.log(response)
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