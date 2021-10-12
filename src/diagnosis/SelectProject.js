import React from "react";
import { Select, Collapse, Tag } from "antd";
import "antd/dist/antd.css";
const { Panel } = Collapse;
const { Option } = Select;

export default function SelectProject(props) {
  const setDefaultValue = () => {
    for (let i=0; i < itemList.length; i++){
      if (itemList[i].ProjectName === props.Project.ProjectName) return i;
    }
    return ""
  }
  const itemList = /* []call api get all project* */[
    {
      ProjectName: "COVID-19",
      Task: "2D Classfication",
      Classes: ["normal", "COVID-19"],
      Description: "COVID-19 Evaluation from CXR and vital signs",
      Requirement: ["Pulse rate", "Blood Pressure", "Temperature"],
    },
    {
      ProjectName: "Pylon",
      Task: "2D Classfication",
      Classes: ["normal", "Tubercolosis"],
      Description: "P'Plot Model",
      Requirement: [],
    },
  ]; 
  function handleChange(value) {
    props.setProject(itemList[value])
    console.log(`select value = ${value}`)
  }
  return (
    <div style={{ minWidth: props.minWidth?? 450 }}>
      <p className="project-lable" style={{ marginBottom: "8px" }}> Project </p>
      <Select onChange={handleChange} dropdownStyle={{ borderRadius: 8 }} defaultValue={setDefaultValue}>
        {itemList.map((item, i) => (
          <Option key={i} value={i}>
            {item.ProjectName}
          </Option>
        ))}
      </Select>
      {(props.Project !== "none") && <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
        <Panel key="1" header="Project information">
          <div className="project-info">
            <div>
              Task : <Tag className="brown">{props.Project.Task}</Tag>
            </div>
            <div>
              Classes : {(props.Project.Classes).map((item, i)=>(<Tag key={i} className="pink">{item}</Tag>))}
            </div>
            <div>Description: {props.Project.Description}</div>
            <div>
              Requirement :
              {(props.Project.Requirement).map((item, i)=>(<ol key={i}>{item}</ol>))}
            </div>
          </div>
        </Panel>
      </Collapse> }
    </div>
  );
}
