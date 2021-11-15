import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import DicomViewOnly from "./dicom-viewer/DicomViewOnly";
import { getDicomByAccessionNo } from "../api/image";

export default function ImageModal (props){
  const [visible,setVisible] = useState(false)
  const showModal = () => {
    setVisible(true)
  };

  const handleCancel = () => {
    setVisible(false)
  };

  return (
      <div style={{display: "inline-block"}}>
        <Button type="link" onClick={showModal} icon={<EyeOutlined className="clickable-icon" />}/>
        <Modal
          centered
          className="img-modal"
          visible={visible}
          title={`${props.ProcDescription ?? "Chest PA"} ${props.StudyDateTime ?? "10:25:53 AM 08/10/2564"}`}
          onCancel={handleCancel}
          footer={null}
          width="800px"
        >
          <DicomViewOnly img_url={getDicomByAccessionNo(props.AccessionNo)} img_source="wado" size={530}/>
        </Modal>
      </div>
    )
}