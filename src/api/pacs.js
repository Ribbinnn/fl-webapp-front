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