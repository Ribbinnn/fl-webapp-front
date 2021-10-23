import { instance } from '.';

export const searchVitlasProject = async (projectId) => {
    try {
        const response = (await instance.get("/vitals/projects/clinician/" + (JSON.parse(sessionStorage.getItem('user'))).id)).data;
        return response
    } catch (e) {
        throw e
    }
}