import React from "react";
import { Form, Input } from "antd";
import Info from "../component/Info";
import DicomViewOnly from "../component/dicom-viewer/DicomViewOnly";

export default function PreviewEdit(props){
    return(
        <div style={{display:"flex", flexDirection:"row"}}>
          <div style={{minWidth:"500px"}}>
            <label
              style={{
                display: "block",
                color: "#de5c8e",
                marginBottom: "10px",
              }}
            >
              Patient's HN: {props.HN}
            </label>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Patient Information
            </label>
            <Info Data={props.Patient} />
            <label style={{ display: "block", margin: "30px 0px 10px 0px" }}>
              Medical Records
            </label>
            <Form layout="vertical">
            {Object.keys(props.MedRec).map((item, i) => (
              <Form.Item key={i} style={{marginLeft: "30px", marginBottom:"10px"}}>
                <label id="smaller-label" style={{width: "180px"}}>
                {`${item}:`}
                  </label>
              <Input
                className="input-prev-edit-text"
                style={{ width: "200px" }}
                defaultValue= {props.MedRec[item]}
              />
            </Form.Item>
            ))}
              
            </Form>
          </div>
          <DicomViewOnly img_url="http://localhost:5000/api/example/0041018.dcm" img_source="wado" size={500}/>
          </div>
    )
}