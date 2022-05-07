import React, { useState } from "react";
import { Modal, Button } from "antd";
import { HighlightOutlined } from "@ant-design/icons";
import AnnotationPanel from "./AnnotationPanel";

export default function AnnotationModal(props) {
  const [visible, setVisible] = useState(false);
  const [btnMode, setBtnMode] = useState("close");
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    if (btnMode === "save-cancel") {
      return Modal.confirm({
        title: "Are you sure you want to quit without saving?",
        content:
          "All changes made will be lost. Press Yes to continue or No to stay on the current page.",
        onOk: () => {
          setBtnMode("close");
          setVisible(false);
        },
        cancelText: "No",
        okText: "Yes"
      });
    }
    setVisible(false);
  };

  return (
    <div style={{ display: "inline-block" }}>
      <Button
        type="link"
        onClick={showModal}
        icon={<HighlightOutlined className="clickable-icon" />}
        style={{
          color: "#de5c8e",
          fontSize: "medium",
          fontWeight: "bold",
          stroke: "#de5c8e",
          strokeWidth: 30,
        }}
      >
        {props.displayText}
      </Button>
      <Modal
        centered
        destroyOnClose
        maskClosable={false}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width="1350px"
        keyboard={false}
      >
        <AnnotationPanel
          handleCancel={handleCancel}
          labelList={props.labelList}
          accession_no={props.accession_no}
          gradCamList={props.gradCamList}
          mode={props.mode}
          updateTimestamp={props.updateTimestamp}
          btnMode={btnMode}
          setBtnMode={setBtnMode}
        />
      </Modal>
    </div>
  );
}
