import React, { useEffect, useState } from "react";
import { Select, Collapse, Tag } from "antd";
import {selectProject} from '../api/project'
const { Panel } = Collapse;
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
      });
  }, []);
  const setDefaultValue = () => {
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].ProjectName === props.Project.ProjectName) return i;
    }
    return "";
  };

  function handleChange(value) {
    props.setProject(itemList[value]);
    console.log(`select value = ${value}`);
  }
  return (
    <div style={{ minWidth: props.minWidth ?? 450 }}>
      <p className="project-lable" style={{ marginBottom: "8px" }}>
        {" "}
        Project{" "}
      </p>
      <Select
        onChange={handleChange}
        dropdownStyle={{ borderRadius: 8 }}
        defaultValue={setDefaultValue}
      >
        {itemList.map((item, i) => (
          <Option key={i} value={i}>
            {item.ProjectName}
          </Option>
        ))}
      </Select>
      {props.Project !== "none" && (
        <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
          <Panel key="1" header="Project information">
            <div className="project-info">
              <div>
                Task : <Tag className="brown">{props.Project.Task}</Tag>
              </div>
              <div>
                Classes :{" "}
                {props.Project.Classes.map((item, i) => (
                  <Tag key={i} className="pink">
                    {item}
                  </Tag>
                ))}
              </div>
              <div>Description: {props.Project.Description}</div>
              <div>
                Requirement :
                {props.Project.Requirement.map((item, i) => (
                  <ol key={i}>{item.name}</ol>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      )}
    </div>
  );
}
