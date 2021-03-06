import React, { useState } from "react";
import { Modal, Button, Image } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import DicomViewOnly from "./dicom-viewer/DicomViewOnly";
import { getDicomByAccessionNo } from "../api/image";
import { getGradCam } from "../api/image";

export default function ImageModal(props) {
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div style={{ display: "inline-block" }}>
      <Button
        type="link"
        onClick={showModal}
        icon={<EyeOutlined className="clickable-icon" />}
      />
      <Modal
        centered
        destroyOnClose
        className="img-modal"
        visible={visible}
        // title={`${props.ProcDescription} ${props.StudyDateTime}`}
        title={props.StudyDateTime}
        onCancel={handleCancel}
        footer={null}
        width="800px"
      >
        {props.ReportID ? (
          <Image
            preview={false}
            height={530}
            src={getGradCam(props.ReportID, "original")}
          />
        ) : (
          <DicomViewOnly
            img_url={getDicomByAccessionNo(props.AccessionNo)}
            img_source="wado"
            size={530}
          />
        )}
      </Modal>
    </div>
  );
}
