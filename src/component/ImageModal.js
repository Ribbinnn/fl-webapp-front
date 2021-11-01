import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import DicomViewOnly from "./dicom-viewer/DicomViewOnly";

export default function ImageModal (props){
  const [visible,setVisible] = useState(false)
  const showModal = () => {
    setVisible(true)
  };

  const handleCancel = () => {
    setVisible(false)
  };

  return (
      <div>
        <Button type="link" onClick={showModal} icon={<EyeOutlined />}/>
        <Modal
          centered
          className="img-modal"
          visible={visible}
          title={`${props.ProcDescription ?? "Chest PA"} ${props.StudyDateTime ?? "10:25:53 AM 08/10/2564"}`}
          onCancel={handleCancel}
          footer={null}
          width="800px"
        >
          <DicomViewOnly img_url="http://localhost:5000/api/example/0041018.dcm" img_source="wado" height="530px" width="530px"/>
        </Modal>
      </div>
    )
}