import { instance } from '.';

export const searchVitlasProject = async (projectId) => {
    try {
        const response = (await instance.get("/vitals/projects/clinician/" + (JSON.parse(sessionStorage.getItem('user'))).id)).data;
        return response
    } catch (e) {
        throw e
    }
}

export const uploadVitalsRecord = async (project_name, user_id, record_name, records) => {
    try {
        const response = (
            await instance.post("/vitals/records", {project_name, user_id, record_name, records})
        ).data;
        return response;
    } catch (e) {
        throw e
    }
}

export const downloadTemplate = async (project_name) => {
    try {
        const response = (
            await instance.get("/vitals/template/" + project_name, { responseType: 'blob' })
        ).data;
        return response;
    } catch (e) {
        throw e
    }
}