import axios from "axios";

const ConfigsTableApi = axios.create({baseURL: "http://127.0.0.1:8000/api/sync-table-config"});

async function getAllConfigsTable() {
    try {
        const response = await ConfigsTableApi.get("");
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function storeConfigTable(configData) {
    try {
        const response = await ConfigsTableApi.post("",configData);
        return response.data;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

export{
    getAllConfigsTable,
    storeConfigTable,
};