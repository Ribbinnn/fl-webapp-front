import React, { useState, useRef, useContext } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Steps, Button, Form, Input, Row, Col, Modal, Spin } from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";
import ProjectInfo from "../component/ProjectInfo";
import SelectMedicalRecord from "./SelectMedicalRecord";
import SelectXRayImage from "./SelectXRayImage";
import Completed from "../component/Completed";
import PreviewEdit from "./PreviewEdit";
import { findPatientOnPACS } from "../api/pacs";
import { infer } from "../api/report";
import Contexts from "../utils/Contexts";
const { Step } = Steps;

const LoadingIcon = (
  <LoadingOutlined
    style={{ fontSize: 30, color: "#de5c8e", marginRight: 5 }}
    spin
  />
);

export default function Diagnosis(props) {
  const { globalProject } = useContext(Contexts).project;
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const [loading, setLoading] = useState(false);
  const [HN, setHN] = useState("");
  const [Patient, setPatient] = useState();
  const [MedRec, setMedRec] = useState(null);
  const [MedRecIndex, setMedRecIndex] = useState([]);
  const [accessionNo, setAccessionNo] = useState(null);
  const [accessionNoIndex, setAccessionNoIndex] = useState([]);
  const [searchAccNo, setSearchAccNo] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [pacsTableData, setPacsTableData] = useState(null);
  const [current, setCurrent] = useState(0);
  const selectMedicalRecordRef = useRef();
  const stepsTitle = [
    "Select HN",
    "Select Medical Record",
    "Select X-Ray Image",
    "Preview & Edit",
    "Diagnosis Started",
  ];

  const btnList = [
    {
      title: "Back to Home",
      destination: "/",
    },
    {
      title: "Create New Diagnosis",
      destination: "/diagnosis/individual",
    },
    ,
    {
      title: "Go to View History",
      destination: "/viewhistory",
    },
  ];

  const next = () => {
    /** add condition for each step to go next step here */
    if (current === 0 && globalProject.projectReq.length === 0) {
      setCurrent(2);
      setCurrentActivity({ ...currentActivity, enablePageChange: false });
    } else if (current === 1) {
      selectMedicalRecordRef.current.setMedicalRecord();
      setCurrentActivity({ ...currentActivity, enablePageChange: false });
    } else if (current === 2 && accessionNo === null) {
      Modal.warning({ content: "Please select X-Ray Image." });
    } else {
      if (current === 3) {
        setLoading(true);
        infer(
          accessionNo,
          globalProject.projectId,
          MedRec,
          JSON.parse(sessionStorage.getItem("user")).id
        )
          .then((res) => {
            // console.log(res);
            setCurrent(current + 1);
            setLoading(false);
            setCurrentActivity({ ...currentActivity, enablePageChange: true });
          })
          .catch((err) => {
            console.log(err.response);
            Modal.error({ content: err.response.data.message });
            setLoading(false);
          });
      } else {
        if (current === 0) setCurrentActivity({ ...currentActivity, enablePageChange: false });
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current === 2 && globalProject.projectReq.length === 0) {
      setCurrent(0);
    } else {
      setCurrent(current - 1);
    }
  };

  useHotkeys(
    "enter",
    () => {
      if (document.getElementById("diagnosis-next-btn") && !document.getElementsByClassName("ant-modal").length) {
        next();
      }
    },
    {
      filter: () => true,
    },
    []
  );

  useHotkeys(
    "shift+b",
    () => {
      if (document.getElementById("diagnosis-back-btn") && !document.getElementsByClassName("ant-modal").length) {
        prev();
      }
    },
    {
      filter: () => true,
    },
    []
  );

  return (
    <div className={loading ? "content loading" : "content"}>
      <Steps progressDot current={current}>
        {stepsTitle.map((item) => (
          <Step key={item} title={item} />
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
            loading={loading}
            setLoading={setLoading}
            next={next}
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
                <ProjectInfo
                  project_id={globalProject.projectId}
                  collapse={false}
                />
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
              MedRec={MedRec}
              setMedRec={setMedRec}
              setAccessionNo={setAccessionNo}
              accessionNoIndex={accessionNoIndex}
              setAccessionNoIndex={setAccessionNoIndex}
              searchAccNo={searchAccNo}
              setSearchAccNo={setSearchAccNo}
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
            setMedRec={setMedRec}
            AccessionNo={accessionNo}
            projectReq={globalProject.projectReq}
          />
        )}
        {current === stepsTitle.length - 1 && (
          <Completed btnList={btnList} title="Diagnosis Started" />
        )}
      </div>
      {/* ----- add content above -------- */}
      <div className={`steps-action${current === 0 ? " steps-action-1" : ""}`}>
        {current > 0 && current < stepsTitle.length - 1 && (
          <Button
            className="primary-btn"
            id="diagnosis-back-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>
        )}
        {HN !== "" && current < stepsTitle.length - 1 && (
          <Button className="primary-btn" id="diagnosis-next-btn" onClick={() => next()}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

function SelectHN(props) {
  //const [patientName, setPatientName] = useState();
  const hnInputRef = useRef(null);
  useHotkeys("shift+f", () => {
    // but without timeout,
    // the hotkey will be sent to select input
    setTimeout(() => {
      hnInputRef.current.focus({cursor: 'all'});
    }, 20);
  });
  const handleSubmit = () => {
    let input_hn = document.getElementById("hn-input").value.trim();
    if (!input_hn) return;
    props.setLoading(true);
    findPatientOnPACS(input_hn)
      .then((res) => {
        // console.log(input_hn);
        if (res.data) {
          props.setHN(input_hn);
          props.setPatient({ Name: res.data["Patient Name"] });
          props.setMedRec(null);
          props.setMedRecIndex([]);
          props.setAccessionNo(null);
          props.setAccessionNoIndex([]);
          props.next();
        } else props.setPatient(false);
        props.setLoading(false);
      })
      .catch((err) => console.log(err.response));
  };
  return (
    <Form layout="vertical">
      <Form.Item label="Patient's HN">
        <Input
          ref={hnInputRef}
          className="input-text"
          id="hn-input"
          style={{ width: "300px" }}
          defaultValue={props.HN}
          onPressEnter={handleSubmit}
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

      <div>
        {props.loading ? (
          <span>
            <Spin indicator={LoadingIcon} /> <label>Searching ...</label>
          </span>
        ) : (
          <label id="search-pacs-result">
            {props.Patient !== undefined &&
              (props.Patient
                ? `Patient's Name: ${props.Patient.Name}`
                : "No sufficient data from this patient.")}
          </label>
        )}
      </div>
    </Form>
  );
}
