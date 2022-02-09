import axios from 'axios';
import { serverURL } from './config';

export var instance = axios.create({
    baseURL: serverURL,
    headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
})

export const updateToken = () => {
    instance = axios.create({
        baseURL: serverURL,
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })
}