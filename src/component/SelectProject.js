import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { selectProject } from '../api/project'
const { Option } = Select;

export default function SelectProject(props) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
      selectProject().then((response) => {
        console.log(response);
        let res_list = (response.data.projects).map((project)=>{
          return({
            ProjectID: project._id,
            ProjectName: project.name,
            /* Description: project.description,
            Requirement: project.requirements,
            Classes: project.predClasses,
            Owner: project.users,
            Task: project.task */
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
    console.log("Project ID: ",value)
  }
  return (
      <Select
        onChange={handleChange}
        dropdownStyle={{ borderRadius: 8 }}
        defaultValue={props.Project.ProjectName || ""}
        style = {{marginBottom: "20px"}}
      >
        {itemList.map((item, i) => (
          <Option key={i} value={item.ProjectID}>
            {item.ProjectName}
          </Option>
        ))}
      </Select>
  );
}

