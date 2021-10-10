import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
import "antd/dist/antd.css";
import "./LayOut.css";
const { Step } = Steps;

const steps = [
  {
    title: 'Select Project',
    content: 'First-content'
  },
  {
    title: 'Upload File',
    content: 'Second-content'
  },
  {
    title: 'Upload Completed',
    content: 'Last-content'
  }
];

export default function UploadRecord () {
    const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
   <div className="content" >
       <Steps progressDot current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title}/>
        ))}
      </Steps>
      {/* 
      ----- add content here --------
      */}
      <div className="steps-action">
        {current > 0 && (
          <Button className="primary-btn" style={{ margin: '0 8px' }} onClick={() => prev()}>
            Back
          </Button>
        )}
        {current < steps.length  && (
          <Button className="primary-btn" onClick={() => next()}>
            Next
          </Button>
        )}
      </div>
   </div>
  );
};
