import axios from "axios";

const ConfigsTableApi = axios.create({baseURL: "http://127.0.0.1:8000/api"});

async function getAllConfigsTable() {
    try {
        const response = await ConfigsTableApi.get("/sync-table-config");
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function storeConfigTable(configData) {
    try {
        const response = await ConfigsTableApi.post("/sync-table-config",configData);
        return response.data;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

async function powerButton(active,id) {
    try {
        
        const response = await ConfigsTableApi.put(`/sync-table-config-activeOrDesactive/${id}`, { active });
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function getConfigTableById(id) {
    try {
        const response = await ConfigsTableApi.get(`/sync-table-config/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function editTable(id, Table) {
    try {
        const response = await ConfigsTableApi.put(`/sync-table-config/${id}`, Table);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function deleteTable(id){
    try {
        const response = await ConfigsTableApi.delete(`/sync-table-config/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}




export{
    getAllConfigsTable,
    storeConfigTable,
    getConfigTableById,
    powerButton,
    editTable,
    deleteTable,
};