import { instance } from '.';

export const findPatientOnPACS = async (hn) => {
    try {
        const response = (await instance.get(`/pacs/HN/${hn}/info`));
        return response.data
    } catch (e) {
        throw e
    }
}