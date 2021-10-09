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
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
   </div>
  );
};
