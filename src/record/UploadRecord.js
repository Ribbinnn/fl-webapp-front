import React, { useState, useRef } from "react";
import { Steps, Button, Row, Col } from "antd";
import "antd/dist/antd.css";
import Completed from "../component/Completed"
import UploadRecordForm from "./UploadRecordForm";
import SelectProject from "../component/SelectProject";

const { Step } = Steps;

const steps = [
  {
    title: "Select Project",
    content: "First-content",
  },
  {
    title: "Upload File",
    content: "Second-content",
  },
  {
    title: "Upload Completed",
    content: "Last-content",
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
  const [project, setProject] = useState('none');
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
            <Col span={9}>
              <SelectProject setProject={setProject} Project={project} width='200px'/>
            </Col>
            <Col span={15}>
              {current === 1 &&
                <UploadRecordForm ref={uploadRecordFormRef} project={project} />}
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
                if (current === 1) {
                  uploadRecordFormRef.current.uploadRecord();
                }
                next();
              }}>
                Next
            </Button>}
        </div>
    </div>
  );
}
