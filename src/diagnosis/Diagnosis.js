import React, { useState, useEffect } from "react";
import { Steps, Button, Form, Input, Select, Collapse, Tag } from "antd";
import "antd/dist/antd.css";
const { Step } = Steps;
const { Panel } = Collapse;
const { Option } = Select;

const steps = [
  {
    title: "Select HN & Project",
    content: "First-content",
  },
  {
    title: "Select Medical Record",
    content: "Second-content",
  },
  {
    title: "Select X-Ray Image",
    content: "Third-content",
  },
  {
    title: "Preview & Edit",
    content: "Fourth-content",
  },
  {
    title: "Diagnosis Started",
    content: "Last-content",
  },
];

export default function Diagnosis() {
  const [HN,setHN] = useState("");
  const [Project, setProject] = useState("none");
  const [current, setCurrent] = useState(0);
  const next = () => {
    /** add condition for each step to go next step here */
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="content">
      <Steps progressDot current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {/* ----- add content below -------- */ }
      {current===0 && <SelectHN HN={HN} setHN={setHN} Project={Project} setProject={setProject}/>}
      {/* ----- add content above -------- */ }
      <div className="steps-action">
          <Button
            className="primary-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>
          {HN!=="" && Project!== "none" && <Button className="primary-btn" onClick={() => next()}>
            Next
          </Button>}
        </div>
    </div>
  );
}

function SelectHN(props) {
  const handleSubmit = () => {
    /*check HN in PACS*/
    props.setHN("1111" /** set valid HN in PACS */)
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minWidth: "100%",
      }}
    >
      <div style={{ padding: 30 }}>
        <Form layout="vertical">
          <Form.Item label="Patient's HN" style={{ marginBottom: "10px" }}>
            <Input className="input-text" style={{ width: "300px" }} defaultValue={props.HN}/>
            <Button
              className="primary-btn smaller"
              style={{ marginLeft: "10px" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ paddingTop: 66, paddingLeft: 60 }}>
        {props.HN && <SelectProject setProject={props.setProject} Project={props.Project}/>}
      </div>
    </div>
  );
}

function SelectProject(props) {
  const [selectedItem, setSelectedItem] = useState(-1);
  useEffect(() => {
    setSelectedItem(itemList.findIndex(obj => obj.ProjectName===props.Project.ProjectName))
  })
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
    setSelectedItem(value);
    props.setProject(itemList[value])
  }
  return (
    <div style={{ minWidth: 450 }}>
      <Select onChange={handleChange} dropdownStyle={{ borderRadius: 8 }}>
        {itemList.map((item, i) => (
          <Option key={i} value={i}>
            {item.ProjectName}
          </Option>
        ))}
      </Select>
      {(selectedItem!==-1) && <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
        <Panel key="1" header="Project information">
          <div className="project-info">
            <div>
              Task : <Tag className="brown">{itemList[selectedItem].Task}</Tag>
            </div>
            <div>
              Classes : <Tag className="yellow">normal</Tag>
              <Tag className="pink">COVID-19</Tag>
            </div>
            <div>Description: {itemList[selectedItem].Description}</div>
            <div>
              Requirement :
              {(itemList[selectedItem].Requirement).map((item)=>(<ol>{item}</ol>))}
            </div>
          </div>
        </Panel>
      </Collapse> }
    </div>
  );
}
