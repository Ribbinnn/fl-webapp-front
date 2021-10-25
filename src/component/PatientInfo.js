import React from "react";

export default function PatientInfo(props) {
  return (
    <div className="info">
      {Object.keys(props.Patient).map((item, i) => (
        <div key={i}>{`${item}: ${props.Patient[item]}`}</div>
      ))}
    </div>
  );
}
