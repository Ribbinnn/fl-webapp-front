import React, { useState } from "react";
import { Steps, Button, Form, Input } from "antd";
import "antd/dist/antd.css";
import SelectProject from "./SelectProject";
const { Step } = Steps;

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
      <div className={`steps-action${current===0?" steps-action-1":""}`}>
          {current>0 && <Button
            className="primary-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>}
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
      }}
    >
      <div style={{ padding: 30 }}>
        <Form layout="vertical">
          <Form.Item label="Patient's HN">
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
      <div style={{ paddingTop: 30, paddingLeft: 60 }}>
        {props.HN && <SelectProject setProject={props.setProject} Project={props.Project}/>}
      </div>
    </div>
  );
}