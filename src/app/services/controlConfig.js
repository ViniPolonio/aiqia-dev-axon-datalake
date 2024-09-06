import axios from "axios";

const controlConfig = axios.create({ baseURL: "http://127.0.0.1:8000/api/" });

async function getControlConfig(nextCursor) {
    try {
        const response = await controlConfig.get("sync-control-config", {
            params: {
                cursor: nextCursor
            }
        });
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error geting configs: ", error);
        throw error;
    }
}

async function storeControllConfig(controllData){
    try {
        const response = await controlConfig.post(
            "sync-control-config",
            controllData
        );
        console.log(response)
        return response;
    } catch (error) {
        console.error("Erro store configs: ", error);
        throw error;
    }
}

async function getControllById(id) {
    try {
        const response = await controlConfig.get(`sync-control-config/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error geting the config: ", error);
        throw error;
    }
}

async function powerButton(active, id) {
    try {
        const response = await controlConfig.put(
            `sync-control-config-activeOrDesactive/${id}`,
            { active }
        );
        return response.data;
    } catch (error) {
        console.error("Error turning on the config: ", error);
        throw error;
    }
}

async function editControllConfig(id, controllData) {
    try {
        console.log(controllData);
        const response = await controlConfig.put(
            `sync-control-config/${id}`,
             controllData 
        );
        return response.data;

    } catch (error) {
        console.error("Error editing config: ", error);
        throw error;
    }
}

async function deleteConfig(id){
    try {
        const response = await controlConfig.delete(`sync-control-config/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting configs: ", error);
        throw error;
    }
}


export { 
    getControlConfig,
    storeControllConfig,
    powerButton,
    getControllById,
    editControllConfig,
    deleteConfig
 };
