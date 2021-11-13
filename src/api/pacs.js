import { instance } from '.';

export const getPatientData = async (HN) => {
    try {
        const res = (
            await instance.get("/pacs/HN/" + HN)
        ).data;
        return res;
    } catch (e) {
        throw e;
    }
}

export const findPatientOnPACS = async (hn) => {
    try {
        const response = (await instance.get(`/pacs/HN/${hn}/info`));
        return response.data
    } catch (e) {
        throw e
    }
}
