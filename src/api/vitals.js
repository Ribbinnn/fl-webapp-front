import { instance } from '.';

export const searchVitlasProject = async (projectId) => {
    try {
        const respond = (await instance.get("/vitals/projects/clinician/" + (JSON.parse(localStorage.getItem('user'))).id)).data;
        return respond
    } catch (e) {
        throw e
    }
}