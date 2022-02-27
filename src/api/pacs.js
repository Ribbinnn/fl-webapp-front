import { instance } from '.';

export const getPatientData = async (HN, accession_no, start_date, end_date) => {
    try {
        const params = { HN, accession_no, start_date, end_date }
        console.log(params)
        const res = (
            await instance.get("/pacs/", { params: params })
        ).data;
        return res;
    } catch (e) {
        throw e;
    }
}

export const findPatientOnPACS = async (HN) => {
    try {
        const response = (await instance.get("/pacs/info/?HN="+HN));
        return response.data
    } catch (e) {
        throw e
    }
}

export const saveToPACS = async (report_id) => {
    try {
        const response = (await instance.post("/pacs/save/"+report_id));
        return response.data
    } catch (e) {
        throw e
    }
}
