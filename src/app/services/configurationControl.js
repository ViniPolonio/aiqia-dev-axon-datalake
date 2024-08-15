import axios from "axios";

const ConfigsTableApi = axios.create({baseURL: "http://127.0.0.1:8000/api"});



async function getLogsById(id){
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    try {
        const response = await ConfigsTableApi.get(`/sync-table-control/${id}`, {
            signal: controller.signal, 
        });
        clearTimeout(timeoutId); 
        return response.data;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Requisição cancelada devido ao timeout.");
        } else {
            console.error("Erro ao obter logs: ", error);
        }
        throw error;
    }
}

export{
    getLogsById,
}