import axios from "axios";

const ConfigsTableApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        'Cache-Control': 'no-cache',
    }
});


async function storeConfigTime(configData) {
    try {
        const response = await ConfigsTableApi.post("/sync-table-time",configData);
        return response.data;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

async function getConfigTimeById(id) {
    try {
        const response = await ConfigsTableApi.get(`/sync-table-time/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

async function editTime(id, timeData){
    try {
        const response = await ConfigsTableApi.put(`/sync-table-time/${id}`, timeData);
        return response.data;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

async function deleteTime(id){
    try {
        const response = await ConfigsTableApi.delete(`/sync-table-time/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}


export{
    storeConfigTime,
    getConfigTimeById,
    editTime,
    deleteTime,
};