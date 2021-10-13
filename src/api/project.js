import axios from 'axios';
import {serverURL} from './config';

export const selectProject = async () => {
    try {
        const respond = (await axios.get(serverURL + "/projects/user/" + (JSON.parse(localStorage.getItem('user'))).id, {
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})).data;
        return respond
      } catch (e) {
        throw e
      }
}