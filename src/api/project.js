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

export const getProjectInfoByID = async (pid) => {
  try {
    const response = (await instance.get("/projects/" + pid)).data;
    console.log(response)
    return response
  } catch (e) {
    // console.log(e.response)
    throw e
  }
}