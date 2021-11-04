import React from "react";

export default function Info(props) {
  return (
    <div className="info">
      {Object.keys(props.Data).map((item, i) => (
        <div key={i}>{`${item}: ${props.Data[item]}`}</div>
      ))}
    </div>
  );
}
