import React, { useState, useRef } from "react";
import { Steps, Button, Form, Input, Row, Col, Collapse } from "antd";
import "antd/dist/antd.css";
import SelectProject from "../component/SelectProject";
import SelectMedicalRecord from "./SelectMedicalRecord";
import Completed from "../component/Completed";
import PreviewEdit from "./PreviewEdit";
import { findPatientOnPACS } from "../api/pacs";
const { Step } = Steps;

const steps = [
  {
    title: "Select HN",
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
  const [Patient, setPatient] = useState({
    Name: "John Doe",
    Age: 42,
    Gender: "M",
  });
  const [MedRec, setMedRec] = useState({
    "Pulse rate": 77,
    Temperature: 37,
    "Blood pressure": "120/80",
  });
  const [accessionNo, setAccessionNo] = useState("74");
  const [current, setCurrent] = useState(0);
  const selectMedicalRecordRef = useRef();
  const next = () => {
    /** add condition for each step to go next step here */
    if (current === 1) {
      selectMedicalRecordRef.current.setMedicalRecord();
    } else {
      setCurrent(current + 1);
    }
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
            <Col span={7}>
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
                <SelectProject Project={Project} mode="view" />
              </div>
            </Col>
            <Col span={17}>
              <SelectMedicalRecord
                ref={selectMedicalRecordRef}
                HN={HN}
                project={Project}
                current={current}
                setCurrent={setCurrent}
                setMedRec={setMedRec}
              />
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
          <PreviewEdit
            HN={HN}
            Patient={Patient}
            MedRec={MedRec}
            AccessionNo={accessionNo}
          />
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
        {HN !== "" && current < steps.length - 1 && (
          <Button className="primary-btn" onClick={() => next()}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

function SelectHN(props) {
  const [patientName, setPatientName] = useState();
  const handleSubmit = () => {
    let input_hn = document.getElementById("hn-input").value;
    findPatientOnPACS(input_hn).then((res) => {
      console.log(input_hn);
      if (res.data) {
        props.setHN(input_hn);
        setPatientName(res.data["Patient Name"]);
      } else setPatientName(false);
    });
  };
  return (
    <Form layout="vertical">
      <Form.Item label="Patient's HN">
        <Input
          className="input-text"
          id="hn-input"
          style={{ width: "300px" }}
          defaultValue={props.HN}
          onChange={() => {
            if (props.HN.length > 0 || patientName === false) {
              props.setHN("");
              setPatientName(undefined);
            }
          }}
        />
        <Button
          className="primary-btn smaller"
          style={{ marginLeft: "10px" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form.Item>
      {patientName !== undefined && (
        <label id="search-pacs-result">
          {patientName ? `Patient's Name: ${patientName}` : "No sufficient data from PACS for this patient."}
        </label>
      )}
    </Form>
  );
}
