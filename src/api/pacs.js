import { instance } from '.';
import { serverURL, PYserverURL } from './config';
import axios from 'axios';

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

export const getPatientDataLocal = async (HN) => {
    try {
        const res = (
            // await instance.get("/pacs/", { params: { HN: "4149", dir: "local" } })
            // await instance.get("/pacs/?HN=4149&dir=local")
            await axios.get(`${PYserverURL}/local/HN/4149`) // edit later
        ).data;
        return res;
    } catch (e) {
        throw e;
    }
    return `${PYserverURL}/local/HN/4149`
}

export const findPatientOnPACS = async (hn) => {
    try {
        const response = (await instance.get(`/pacs/HN/${hn}/info`));
        return response.data
    } catch (e) {
        throw e
    }
}

export const findPatientOnLocal = async (hn) => {
    try {
        const response = (await instance.get(`/pacs/info/?HN=${hn}&dir=local`));
        return response.data
    } catch (e) {
        throw e
    }
}
