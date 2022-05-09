import React from "react";
import { Form, Input, Modal } from "antd";
import Info from "../component/Info";
import DicomViewOnly from "../component/dicom-viewer/DicomViewOnly";
import { getDicomByAccessionNo } from "../api/image";

export default function PreviewEdit(props) {
  const onChangeMedRec = (field) => (event) => {
    let value = event.target.value;
    // console.log(field, value);
    // console.log(props.MedRec);
    // console.log(props.projectReq);
    if (field === "gender") {
      value = value.toUpperCase();
    }
    if (field === "gender" && value !== "F" && value !== "M" && value) {
      return Modal.warning({ content: "Gender must be specified by F or M." });
    } else if (field === "age") {
      // if (!value)
      //   return Modal.warning({ content: "Age must not be empty." });
      value = parseInt(value) || value;
      if (value && !parseInt(value))
        return Modal.warning({ content: "Age must be a number." });
      // } else if (props.projectReq.find((item) => item.name === field) && !value) {
      //   return Modal.warning({
      //     content: `${
      //       field.charAt(0).toUpperCase() + field.slice(1).split("_").join(" ")
      //     } must not be empty.`,
      //   });
    } else if (
      props.projectReq.find((item) => item.name === field)?.type === "number"
    ) {
      value = parseInt(value) || value;
      if (value && !parseInt(value))
        return Modal.warning({
          content: `${
            field.charAt(0).toUpperCase() + field.slice(1).split("_").join(" ")
          } must be a number.`,
        });
    } else if (
      props.projectReq.find((item) => item.name === field)?.type === "boolean"
    ) {
      value = value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : value;
      // console.log(value)
    }
    // console.log(field, typeof value);
    props.setMedRec({
      ...props.MedRec,
      [field]: value,
    });
    // console.log({ ...props.MedRec, field: value });
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ minWidth: "500px" }}>
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
          Patient Information {'&'} Medical Records
        </label>
        <Info Data={props.Patient} style={{ marginLeft: "30px", marginBottom: "30px" }} />
        {/* <label style={{ display: "block", margin: "30px 0px 10px 0px" }}>
          Medical Records
        </label> */}
        <Form layout="vertical">
          {Object.keys(props.MedRec).map((item, i) =>
            item === "entry_id" ||
            item === "hn" ||
            item === "measured_time" ? null : (
              <Form.Item
                key={i}
                style={{ marginLeft: "30px", marginBottom: "10px" }}
              >
                <label id="smaller-label" style={{ width: "180px" }}>
                  {`${
                    item.charAt(0).toUpperCase() +
                    item.slice(1).split("_").join(" ")
                  }:`}
                </label>
                <Input
                  className="input-prev-edit-text"
                  style={{ width: "200px" }}
                  value={/* props.projectReq.find((proj) => proj.name === item)?.type === "boolean" ? props.MedRec[item]?.toString() :  */props.MedRec[item]}
                  onChange={onChangeMedRec(item)}
                />
              </Form.Item>
            )
          )}
        </Form>
      </div>
      <DicomViewOnly
        img_url={getDicomByAccessionNo(props.AccessionNo)}
        img_source="wado"
        size={500}
      />
    </div>
  );
}
