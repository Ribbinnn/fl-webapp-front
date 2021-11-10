import { serverURL } from './config';

export const getGradCam = (rid, finding) => {
    return `${serverURL}/image/?result_id=${rid}&finding=${finding}`
}
