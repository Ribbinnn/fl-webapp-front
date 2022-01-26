import { instance } from '.';

export const getPatientData = async (HN, accession_no, start_date, end_date) => {
    try {
        const params = {HN: HN};
        if (accession_no !== "") {
            params["accession_no"] = accession_no;
        } if (start_date !== "") {
            params["start_date"] = start_date;
        } if (end_date !== "") {
            params["end_date"] = end_date;
        }
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
