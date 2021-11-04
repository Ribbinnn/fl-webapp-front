import React, { useEffect, useState } from "react";
import { Collapse } from "antd";
import Info from "../component/Info";
import DicomViewOnly from "../component/dicom-viewer/DicomViewOnly";
const { Panel } = Collapse;

export default function Report() {
  const patient = {
    Name: "Paul Smith",
    Age: 50,
    Gender: "M",
  };
  const status = "Finalized";
  const HN = "1150";
  const medrec = {
    Temperature: 37.8,
    "Blood Pressure": "120/80",
    Pulse: 98
  }
  const project = {Name: "COVID-19"}
  return <div className="content">
    <ReportHeader HN={HN} patient={patient} status={status} medrec={medrec} project={project}/>
    <div className="report-image-ctn" style={{display: "grid", gridAutoFlow: "column", gridColumnGap: "10px"}}>
    <div >
    <DicomViewOnly img_url="http://localhost:5000/api/example/0041018.dcm" img_source="wado" size={400}/>
    </div>
    <div style={{width: "400px", height: "400px", backgroundColor:"grey"}}/>
    </div>
  </div>;
}

const ReportHeader = (props) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            display: "block",
            color: "#58595B",
            fontWeight: "bold",
            fontSize: "x-large"
          }}
        >
          Report
        </label>
        <span
          class="dot"
          style={{ backgroundColor: props.status === "AI-Annotated" ? "#E9C869" : props.status === "Finalized" ? "#7BE969": "", marginLeft: "45px" }}
        />
        <label
          style={{ color: "#A3A3A3", marginLeft: "10px", fontSize: "medium" }}
        >
          {props.status}
        </label>
      </div>
      <label
        style={{
          display: "block",
          color: "#A3A3A3",
          marginBottom: "10px",
          fontSize: "medium",
          textAlign: "right"
        }}
      >
        <i>
          {" "}
          Created Date Time: 2021-12-11 08:08:08
          <br />
          Created By: Jonathan Hammer
        </i>
        {props.status === "Finalized" && (
          <i>
            <br />
            Last Modified: 2021-12-12 08:09:10
            <br />
            Finalized By: Jonathan Hammer
          </i>
        )}
      </label>
      <label
        style={{
          display: "block",
          color: "#de5c8e",
          marginBottom: "10px",
        }}
      >
        Patient's HN: {props.HN}
      </label>
      <label
        style={{
          display: "block",
          color: "#58595b",
        }}
      >
        Project: {props.project.Name}
      </label>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minWidth: "400px" }}>
          <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
            <Panel key="1" header="Patient information">
              <Info Data={props.patient} />
            </Panel>
          </Collapse>
        </div>
        <div style={{ minWidth: "400px" }}>
          <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
            <Panel key="1" header="Medical Records">
              <Info Data={props.medrec} />
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};
