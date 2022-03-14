import React, { useState, useRef, useContext } from "react";
import { Steps, Button, Row, Col } from "antd";
import "antd/dist/antd.css";
import Completed from "../component/Completed";
import UploadRecordForm from "./UploadRecordForm";
import ProjectInfo from "../component/ProjectInfo";
import Contexts from "../utils/Contexts";

const { Step } = Steps;

export default function UploadRecord() {
  const uploadRecordFormRef = useRef();
  const stepsTitle = ["Upload File", "Upload Completed"];

  const btnList = [
    {
      title: "Back to Home",
      destination: "/",
    },
    {
      title: "Upload New Record",
      destination: "/record/upload",
    },
    {
      title: "Go to My Record",
      destination: "/record/myrecord",
    },
  ];

  const [current, setCurrent] = useState(0);
  const { globalProject, setGlobalProject } = useContext(Contexts).project;
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="content">
      <Steps progressDot current={current}>
        {stepsTitle.map((item) => (
          <Step key={item} title={item} />
        ))}
      </Steps>
      {current < stepsTitle.length - 1 && (
        <div className="steps-content-upload">
          <Row>
            <Col span={7}>
              <ProjectInfo
                project_id={globalProject.projectId}
                collapse={false}
              />
            </Col>
            <Col span={17}>
              <UploadRecordForm
                ref={uploadRecordFormRef}
                project={globalProject}
              />
            </Col>
          </Row>
        </div>
      )}
      {current === stepsTitle.length - 1 && (
        <Completed btnList={btnList} title="Upload Completed" />
      )}
      <div className={`steps-action${current === 0 ? " steps-action-1" : ""}`}>
        {/* {current>0 && current < steps.length -1 && <Button
            className="primary-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>} */}
        {globalProject !== "none" && current < stepsTitle.length - 1 && (
          <Button
            className="primary-btn"
            onClick={() => {
              uploadRecordFormRef.current.uploadRecord();
              if (uploadRecordFormRef.current.uploadedRecord !== null) {
                if (!currentActivity.enablePageChange){
                  setCurrentActivity({ ...currentActivity, enablePageChange: true });
                }
                next();
              }
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
