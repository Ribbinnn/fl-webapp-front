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
    return response
  } catch (e) {
    // console.log(e.response)
    throw e
  }
}

export const createProject = async (name, task, description, predClasses, head) => {
  try {
    const res = (
      await instance.post("/projects", {name, task, description, predClasses, head})
    ).data;
    return res;
  } catch (e) {
    throw e
  }
}

export const getAllProjects = async () => {
  try {
    const res = (
      await instance.get("/projects")
    ).data.data;
    return res;
  } catch (e) {
    throw e
  }
}

export const updateProjectById = async (name, task, description, predClasses, head, id) => {
  try {
    const res = (
      await instance.patch("/projects", {name, task, description, predClasses, head, id})
    ).data;
    return res;
  } catch (e) {
    throw e
  }
}

export const deleteProjectById = async (id) => {
  try {
    const res = (
      await instance.delete("/projects/delete/"+id)
    ).data;
    return res;
  } catch (e) {
    throw e
  }
}