import { instance } from '.';

export const getReport = async (reportId) => {
    try {
        const response = (await instance.get("/report/" + reportId));
        return response.data
    } catch (e) {
        throw e
    }
}

export const updateReport = async (report_id, note, user_id, label, rating) => {
    try {
        const res = (await instance.patch("/report/", {report_id, note, user_id, label, rating}))
        return res.data;
    } catch (e) {
        throw e
    }
}

export const infer = async (accession_no, project_id, record, user_id) => {
    try {
        const res = (await instance.post("/infer", {accession_no, project_id, record, user_id}))
        return res.data;
    } catch (e) {
        throw e
    }
}