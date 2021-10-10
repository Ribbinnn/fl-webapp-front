import React, { useState } from 'react';
import { Steps, Button } from 'antd';
import "antd/dist/antd.css";
const { Step } = Steps;

const steps = [
  {
    title: 'Select HN & Project',
    content: 'First-content'
  },
  {
    title: 'Select Medical Record',
    content: 'Second-content'
  },
  {
    title: 'Select X-Ray Image',
    content: 'Third-content'
  },
  {
    title: 'Preview & Edit',
    content: 'Fourth-content'
  },
  {
    title: 'Diagnosis Started',
    content: 'Last-content'
  }
];

export default function Diagnosis () {
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
