import React, { useState, useRef } from "react";
import { Steps, Button, Row, Col } from "antd";
import "antd/dist/antd.css";
import Completed from "../component/Completed"
import UploadRecordForm from "./UploadRecordForm";
// import SelectProject from "../component/SelectProject";
import ProjectInfo from "../component/ProjectInfo";

const { Step } = Steps;

const steps = [
  {
    title: "Upload File",
    content: "first-content",
  },
  {
    title: "Upload Completed",
    content: "second-content",
  },
];

const btnList = [
  { 
    title: "Back to Home", 
    destination: "/" 
  }, 
  { 
    title: "Upload New Record", 
    destination: "/record/upload" 
  }, 
  { 
    title: "Go to My Record", 
    destination: "/record/myrecord" 
  }];

export default function UploadRecord() {

  const uploadRecordFormRef = useRef();
  
  const [current, setCurrent] = useState(0);
  // const [project, setProject] = useState('none');
  const project = JSON.parse(sessionStorage.getItem('project'));
  const next = () => {
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
      {current < steps.length - 1 &&
        <div className="steps-content-upload">
          <Row style={{marginBottom:"30px"}}>
            <Col span={7}>
              {/* <SelectProject mode={current === 1?"view":"select"} setProject={setProject} Project={project}/> */}
              <ProjectInfo project_id={project.projectId} />
            </Col>
            <Col span={17}>
              <UploadRecordForm ref={uploadRecordFormRef} project={project} />
            </Col>
          </Row>
        </div>}
      {current === steps.length -1 &&
        <Completed btnList={btnList} title="Upload Completed"/>}
      <div className={`steps-action${current===0?" steps-action-1":""}`}>
          {current>0 && current < steps.length -1 && <Button
            className="primary-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>}
          {project!== "none" && current < steps.length -1 && 
            <Button 
              className="primary-btn" 
              onClick={() => {
                uploadRecordFormRef.current.uploadRecord();
                if (uploadRecordFormRef.current.uploadedRecord !== null) {
                  next();
                }
              }}>
                Next
            </Button>}
        </div>
    </div>
  );
}
