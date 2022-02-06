import { instance, updateToken } from '.';

export const login = async (username, password, remember) => {
    try {
      const response = (await instance.post('/auth/login', {
        username,
        password,
        remember
      })).data;

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify({id: response.data.user_id, username: response.data.username, role: response.data.role}));
      sessionStorage.setItem("auth", true);
      
      if (remember) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({id: response.data.user_id, username: response.data.username, role: response.data.role}));
        localStorage.setItem("auth", true);
      }
      updateToken()
      return response
    } catch (e) {
      // throw e.response.data
      throw e;
    }
}