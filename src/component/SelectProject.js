import React, { useEffect, useState, useContext } from "react";
import { Select } from "antd";
import { selectProject } from '../api/project'
import Contexts from '../utils/Contexts'
const { Option } = Select;

export default function SelectProject(props) {
  const [itemList, setItemList] = useState([]);
  const { globalProject, setGlobalProject } = useContext(Contexts.project);

  useEffect(() => {
      selectProject().then((response) => {
        console.log(response);
        let res_list = (response.data.projects).map((project)=>{
          return({
            ProjectID: project._id,
            ProjectName: project.name,
            // Description: project.description,
            Requirement: project.requirements,
            // Classes: project.predClasses,
            // Owner: project.users,
            // Task: project.task 
          })
        })
        setItemList(res_list);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  function handleChange(value) {
    /**
     * 
     * 
     * handle change when select project
     * 
     * 
     * 
     */
    const project = itemList.filter(item => item.ProjectID===value)
    setGlobalProject({"projectId": project[0].ProjectID, "projectName": project[0].ProjectName, "projectReq": project[0].Requirement})
    sessionStorage.setItem("project", JSON.stringify({"projectId": project[0].ProjectID, "projectName": project[0].ProjectName, "projectReq": project[0].Requirement}));
  }
  return (
      <Select
        onChange={handleChange}
        dropdownStyle={{ borderRadius: 8 }}
        // defaultValue={props.Project.ProjectName?? "No Selected Project"}
        style = {{marginBottom: "20px"}}
        className = {props.Class}
        value={globalProject.projectName?? "No Selected Project"}
      >
        {itemList.map((item, i) => (
          <Option key={i} value={item.ProjectID}>
            {item.ProjectName}
          </Option>
        ))}
      </Select>
  );
}

