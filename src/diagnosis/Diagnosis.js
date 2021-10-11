import React, { useState } from "react";
import { Steps, Button, Form, Input, Select } from "antd";
import "antd/dist/antd.css";
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
      {/* 
      ----- add content here --------
      */}
      <SelectHN />
      <div className="steps-action">
        {current > 0 && (
          <Button
            className="primary-btn"
            style={{ margin: "0 8px" }}
            onClick={() => prev()}
          >
            Back
          </Button>
        )}
        {current < steps.length && (
          <Button className="primary-btn" onClick={() => next()}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

function SelectHN() {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div className="center-div" style={{ padding: 30 }}>
        <Form layout="vertical">
          <Form.Item label="Patient's HN" style={{ marginBottom: "10px" }}>
            <Input className="input-text" style={{ width: "300px" }} />
            <Button
              className="primary-btn smaller"
              style={{ marginLeft: "10px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
