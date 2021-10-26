import React from "react";
import { Form, Input } from "antd";
import PatientInfo from "../component/PatientInfo";

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
            <PatientInfo Patient={props.Patient} />
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
          <div style={{width: "500px", height: "500px", backgroundColor:"gray"}}>
            CXR image
          </div>
          </div>
    )
}