import { instance } from '.';
import { serverURL, PYserverURL } from './config';
import axios from 'axios';

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

export const getPatientDataLocal = async (HN, accession_no, start_date, end_date) => {
    try {
        const params = {HN: HN, dir: "local"};
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
        const response = (await instance.get("/pacs/info/", { params: { HN: HN } }));
        return response.data
    } catch (e) {
        throw e
    }
}

export const findPatientOnLocal = async (HN) => {
    try {
        const response = (await instance.get("/pacs/info/", { params: { HN: HN, dir: "local" } }));
        return response.data
    } catch (e) {
        throw e
    }
}