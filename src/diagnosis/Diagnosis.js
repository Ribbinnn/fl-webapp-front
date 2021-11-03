import React, { useState } from "react";
import { Steps, Button, Form, Input, Row, Col, Collapse } from "antd";
import "antd/dist/antd.css";
import SelectProject from "../component/SelectProject";
import ProjectInfo from "../component/ProjectInfo";
import Completed from "../component/Completed";
import PreviewEdit from "./PreviewEdit";
const { Step } = Steps;
const { Panel } = Collapse;

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

const btnList = [
  {
    title: "Back to Home",
    destination: "/",
  },
  {
    title: "Create New Diagnosis",
    destination: "/diagnosis",
  },
  ,
  {
    title: "Go to View History",
    destination: "/viewhistory",
  },
];

export default function Diagnosis() {
  const [HN, setHN] = useState("");
  const [Project, setProject] = useState("none");
  const [Patient, setPatient] = useState({ Name: "John Doe", Age: 42, Gender: "M" });
  const [MedRec, setMedRec] = useState({"Pulse rate": 77, "Temperature": 37, "Blood pressure": "120/80"});
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
      {/* ----- add content below -------- */}
      <div className="steps-content-diagnosis">
        {current === 0 && (
          <SelectHN
            HN={HN}
            setHN={setHN}
            Project={Project}
            setProject={setProject}
          />
        )}
        {current === 1 && (
          <Row>
            <Col span={9}>
              <div>
                <label
                  style={{
                    display: "block",
                    color: "#de5c8e",
                    marginBottom: "10px",
                  }}
                >
                  Patient's HN: {HN}
                </label>
                <SelectProject Project={Project} mode = "view"/>
              </div>
            </Col>
            <Col span={15}>
              <div>
                <label style={{ display: "block" }}>Medical Records</label>
              </div>
            </Col>
          </Row>
        )}
        {current === 2 && (
          <div>
            <label
              style={{
                display: "block",
                color: "#de5c8e",
                marginBottom: "10px",
              }}
            >
              Patient's HN: {HN}
            </label>
            <label style={{ display: "block" }}>Select X-Ray Image</label>
          </div>
        )}
        {current === 3 && (
          <PreviewEdit HN={HN} Patient={Patient} MedRec={MedRec}/>
        )}
        {current === steps.length - 1 && (
          <Completed btnList={btnList} title="Diagnosis Started" />
        )}
      </div>
      {/* ----- add content above -------- */}
      <div className={`steps-action${current === 0 ? " steps-action-1" : ""}`}>
        {current > 0 && current < steps.length - 1 && (
          <Button
            className="primary-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>
        )}
        {HN !== "" && Project !== "none" && current < steps.length - 1 && (
          <Button className="primary-btn" onClick={() => next()}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

function SelectHN(props) {
  const handleSubmit = () => {
    /*check HN in PACS*/
    props.setHN(document.getElementById("hn-input").value /** set valid HN in PACS */);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Form layout="vertical">
        <Form.Item label="Patient's HN">
          <Input
            className="input-text"
            id="hn-input"
            style={{ width: "300px" }}
            defaultValue={props.HN}
            onChange={()=>{if (props.HN.length > 0){props.setHN("")}}}
          />
          <Button
            className="primary-btn smaller"
            style={{ marginLeft: "10px" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <div style={{ paddingLeft: 60 }}>
        {props.HN && (
          <SelectProject
            setProject={props.setProject}
            Project={props.Project}
            mode = "select"
            width="530px" 
          />
        )}
      </div>
    </div>
  );
}
