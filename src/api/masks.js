import { instance } from '.';

export const getBBox = async (local,req) => {

    // local api -> /api/masks/local/?accession_no=0041099&HN=4149&project_id=61eb03676846d3890367bb46
    try {
        const url = local ? `/masks/local/?accession_no=${req}` : `/masks/report/${req}`
        const response = (await instance.get(url));
        return response.data
    } catch (e) {
        throw e
    }
}

export const insertBBox = async (mask_id, report_id, data) => {
    // console.log(mask_id, report_id, data)
    try {
        const response = report_id ? (
            await instance.patch("/masks/", {report_id, data})
        ).data : (
            await instance.patch("/masks/local/", {mask_id, data})
        ).data;
        return response;
    } catch (e) {
        throw e;
    }
}