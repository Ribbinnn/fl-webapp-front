import axios from 'axios';
import {serverURL} from './config';

export const login = async (username, password) => {
    try {
      const respond = (await axios.post(serverURL + '/auth/login', {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
        username: username,
        password: password,
      })).data;
      localStorage.setItem("token", respond.data.token);
      localStorage.setItem("user", JSON.stringify({id: respond.data.user_id, username: respond.data.username}))
      localStorage.setItem("auth", true)
      return respond
    } catch (e) {
      throw e
    }

}