import { instance, updateToken } from '.';

export const login = async (username, password) => {
    try {
      const respond = (await instance.post('/auth/login', {
        username: username,
        password: password,
      })).data;
      localStorage.setItem("token", respond.data.token);
      localStorage.setItem("user", JSON.stringify({id: respond.data.user_id, username: respond.data.username}))
      console.log(localStorage.getItem("user"))
      updateToken()
      return respond
    } catch (e) {
      throw e
    }

}