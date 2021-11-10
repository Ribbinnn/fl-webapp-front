import { instance } from '.';

export const viewHistory = async (project_id) => {
    try {
        const response = (await instance.get("/infer/list/project/"+project_id)).data;
        return response
    } catch (e) {
        // console.log(e.response)
        throw e
    }
}