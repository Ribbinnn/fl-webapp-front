import { serverURL, PYserverURL } from './config';

export const getGradCam = (rid, finding) => {
    return `${serverURL}/image/?result_id=${rid}&finding=${finding}`
}

export const getDicomByAccessionNo = (ano) =>{
    // return `${serverURL}/image/?accession_no=${ano}`
    // console.log(`${PYserverURL}/pacs/acc_no/${ano}`)
    return `${PYserverURL}/local/acc_no/${ano}`
} //http://localhost:7000/api/pacs/acc_no/20211018CR0846