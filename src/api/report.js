import { instance } from '.';

export const getReport = async (reportId) => {
    try {
        const response = (await instance.get("/report/" + reportId));
        return response.data
    } catch (e) {
        throw e
    }
}

export const updateReport = async (report_id, note, user_id, label) => {
    try {
        const res = (await instance.patch("/report/", {report_id, note, user_id, label}))
        return res.data;
    } catch (e) {
        throw e
    }
}