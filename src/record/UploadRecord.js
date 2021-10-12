import React, { useState, useHistory } from "react";
import { Steps, Button, Row, Col } from "antd";
import "antd/dist/antd.css";
import Completed from "../layout/Completed"

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
  const [current, setCurrent] = useState(0);
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
        <div className="steps-content">
          <Row>
            <Col span={8}>
              <label>Project:</label>
              {/* -------- add select project here -------- */}
            </Col>
            <Col span={16}>
              {current === 1 &&
                <label>Form</label>
              }
            </Col>
          </Row>
        </div>
      }
      {current === steps.length -1 &&
        <Completed btnList={btnList} title="Upload Completed"/>}
      {current < steps.length - 1 && (
        <div className="steps-action">
          <Button
            className="primary-btn"
            style={current > 0 ? null : { visibility: "hidden" }}
            onClick={() => prev()}
          >
            Back
          </Button>
          <Button className="primary-btn" onClick={() => next()}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
