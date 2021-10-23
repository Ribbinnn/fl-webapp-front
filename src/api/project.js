import { instance } from '.';

export const selectProject = async () => {
  try {
    const response = (await instance.get("/projects/user/" + (JSON.parse(sessionStorage.getItem('user'))).id)).data;
    return response
  } catch (e) {
    // console.log(e.response)
    throw e
  }
}