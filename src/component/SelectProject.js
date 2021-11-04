import React, { useEffect, useState } from "react";
import { Select, Collapse } from "antd";
import {selectProject} from '../api/project'
import ProjectInfo from "./ProjectInfo";
const { Panel } = Collapse;
const { Option } = Select;

export default function SelectProject(props) {
  const [itemList, setItemList] = useState([]);
  const mode = props.mode

  useEffect(() => {
      if (mode === "select"){selectProject().then((response) => {
        console.log(response);
        let res_list = (response.data.projects).map((project)=>{
          return({
            ProjectID: project._id,
            ProjectName: project.name,
            Description: project.description,
            Requirement: project.requirements,
            Classes: project.predClasses,
            Owner: project.users,
            Task: project.task
          })
        })
        setItemList(res_list);
      })
      .catch((err) => {
        console.error(err);
      });}
  }, []);

  function handleChange(value) {
    props.setProject(itemList[value]);
  }
  return (
    <div style={mode === "view" ? {width: "250px"}:{width: "530px"}}>
      {mode === "select" && <div><p className="project-lable" style={{ marginBottom: "8px" }}>
        {" "}
        Project{" "}
      </p>
      <Select
        onChange={handleChange}
        dropdownStyle={{ borderRadius: 8 }}
        defaultValue={props.Project.ProjectName || ""}
        style = {{marginBottom: "20px"}}
      >
        {itemList.map((item, i) => (
          <Option key={i} value={i}>
            {item.ProjectName}
          </Option>
        ))}
      </Select></div>}
      {mode === "view" && <label style={{ display: "block" }}>
                  Project: {props.Project.ProjectName}
                </label>}
      {props.Project !== "none" && (
        <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
          <Panel key="1" header="Project information">
            <ProjectInfo Project = {props.Project} /* width={mode==="view"?"200px":"530px"} *//>
          </Panel>
        </Collapse>
      )}
    </div>
  );
}

