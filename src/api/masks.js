import { instance } from '.';

export const getBBox = async (reportId) => {
    try {
        const response = (await instance.get("/masks/report/" + reportId));
        return response.data
    } catch (e) {
        throw e
    }
}

export const insertBBox = async (report_id, data) => {
    console.log(report_id, data)
    try {
        const response = (
            await instance.patch("/masks/", {report_id, data})
        ).data;
        return response;
    } catch (e) {
        throw e;
    }
}