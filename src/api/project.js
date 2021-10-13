import { instance } from '.';

export const selectProject = async () => {
    try {
      console.log(localStorage.getItem('token'))
        const respond = (await instance.get("/projects/user/" + (JSON.parse(localStorage.getItem('user'))).id)).data;
        return respond
      } catch (e) {
        throw e
      }
}