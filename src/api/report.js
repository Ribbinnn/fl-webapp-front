import { instance } from '.';

export const getReport = async (reportId) => {
    try {
        const response = (await instance.get("/report/" + reportId));
        return response.data
    } catch (e) {
        throw e
    }
}