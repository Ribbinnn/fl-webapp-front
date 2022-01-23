import React, { useState, useRef, useContext } from "react";
import { Steps, Button, Form, Input, Row, Col, Modal } from "antd";
import "antd/dist/antd.css";
import ProjectInfo from "../component/ProjectInfo";
import SelectMedicalRecord from "./SelectMedicalRecord";
import SelectXRayImage from "./SelectXRayImage";
import Completed from "../component/Completed";
import PreviewEdit from "./PreviewEdit";
import { findPatientOnPACS } from "../api/pacs";
import { infer } from "../api/report";
import Contexts from '../utils/Contexts';
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
  const { globalProject, setGlobalProject } = useContext(Contexts.project);
  const [loading, setLoading] = useState(false);
  const [HN, setHN] = useState("");
  const [Patient, setPatient] = useState();
  // const [MedRec, setMedRec] = useState({
  //   "Pulse rate": 77,
  //   Temperature: 37,
  //   "Blood pressure": "120/80",
  // });
  const [MedRec, setMedRec] = useState(null);
  const [MedRecIndex, setMedRecIndex] = useState([]);
  // const [accessionNo, setAccessionNo] = useState("74");
  const [accessionNo, setAccessionNo] = useState(null);
  const [accessionNoIndex, setAccessionNoIndex] = useState([]);
  // const [searchAccNo, setSearchAccNo] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [pacsTableData, setPacsTableData] = useState(null);
  const [current, setCurrent] = useState(0);
  const selectMedicalRecordRef = useRef();

  const next = () => {
    /** add condition for each step to go next step here */
    if (current === 0 && globalProject.projectReq.length === 0) {
      setCurrent(2);
    } else if (current === 1) {
      selectMedicalRecordRef.current.setMedicalRecord();
    } else if (current === 2 && accessionNo === null) {
        Modal.warning({content: "Please select X-Ray Image."});
    } else {
      if (current === 3) {
        setLoading(true);
        infer(accessionNo, globalProject.projectId, MedRec, (JSON.parse(sessionStorage.getItem('user'))).id)
        .then((res) => {
          console.log(res);
          setCurrent(current + 1);
          setLoading(false);
        }).catch((err) => console.log(err.response));
      } else {
        setCurrent(current + 1);
      }  
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className={loading ? "content loading" : "content"}>
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
            Patient={Patient}
            setPatient={setPatient}
            setMedRec={setMedRec}
            setMedRecIndex={setMedRecIndex}
            setAccessionNo={setAccessionNo}
            setAccessionNoIndex={setAccessionNoIndex}
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
                <ProjectInfo project_id={globalProject.projectId} collapse={false} />
              </div>
            </Col>
            <Col span={17}>
              <SelectMedicalRecord
                ref={selectMedicalRecordRef}
                HN={HN}
                current={current}
                setCurrent={setCurrent}
                MedRec={MedRec}
                setMedRec={setMedRec}
                MedRecIndex={MedRecIndex}
                setMedRecIndex={setMedRecIndex}
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
            <SelectXRayImage 
              HN={HN}
              setAccessionNo={setAccessionNo}
              accessionNoIndex={accessionNoIndex}
              setAccessionNoIndex={setAccessionNoIndex}
              // searchAccNo={searchAccNo}
              // setSearchAccNo={setSearchAccNo}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              pacsTableData={pacsTableData}
              setPacsTableData={setPacsTableData}
            />
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
  //const [patientName, setPatientName] = useState();
  const handleSubmit = () => {
    let input_hn = document.getElementById("hn-input").value;
    findPatientOnPACS(input_hn).then((res) => {
      console.log(input_hn);
      if (res.data) {
        props.setHN(input_hn);
        props.setPatient({Name: res.data["Patient Name"]});
        props.setMedRec(null);
        props.setMedRecIndex([]);
        props.setAccessionNo(null);
        props.setAccessionNoIndex([]);
      } else props.setPatient(false);
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
            if (props.HN.length > 0 || props.Patient === false) {
              props.setHN("");
              props.setPatient(undefined);
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
      {props.Patient !== undefined && (
        <label id="search-pacs-result">
          {props.Patient ? `Patient's Name: ${props.Patient.Name}` : "No sufficient data from PACS for this patient."}
        </label>
      )}
    </Form>
  );
}
