import { instance } from '.';

export const searchVitlasProject = async (projectId) => {
    try {
        const response = (await instance.get("/vitals/?user_id=" + (JSON.parse(sessionStorage.getItem('user'))).id)).data;
        return response
    } catch (e) {
        throw e
    }
}

export const uploadVitalsRecord = async (project_id, user_id, record_name, records) => {
    try {
        const response = (
            await instance.post("/vitals/records", {project_id, user_id, record_name, records})
        ).data;
        return response;
    } catch (e) {
        throw e
    }
}

export const getAllRecords = async (vitals_proj_id) => {
    try {
        const response = (
            await instance.get("/vitals/projects/" + vitals_proj_id + "/medrec")
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

export const deleteRecord = async (record_id) => {
    try {
        const response = (
            await instance.delete("/vitals/records/deletefile/" + record_id)
        ).data;
        return response;
    } catch (e) {
        throw e;
    }
}

export const deleteRecordRow = async (record_id, record_index) => {
    try {
        const response = (
            await instance.patch("/vitals/records/deleterow/", {record_id, record_index})
        ).data;
        return response;
    } catch (e) {
        throw e;
    }
}

export const updateRecordRow = async (record_id, update_data) => {
    try {
        const response = (
            await instance.patch("/vitals/records/updaterow/", {record_id, update_data})
        ).data;
        return response;
    } catch (e) {
        throw e;
    }
}

export const getAllRecordsByHN = async (HN) => {
    try {
        const res = (
            await instance.get("/vitals/records/HN/" + HN)
        ).data;
        return res;
    } catch (e) {
        throw e;
    }
}