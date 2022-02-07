import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
import AnnotationPanel from "./AnnotationPanel";

export default function AnnotationModal (props){
  const [visible,setVisible] = useState(false)
  const showModal = () => {
    setVisible(true)
  };

  const handleCancel = () => {
    setVisible(false)
  };

  return (
      <div style={{display: "inline-block"}}>
        <Button type="link" onClick={showModal} icon={<HighlightOutlined className="clickable-icon"/>} style={props.displayText && {
                color: "#de5c8e",
                fontSize: "medium",
                fontWeight: "bold",
                stroke: "#de5c8e",
                strokeWidth: 30
              }}>
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
          className="annotation-modal"
        >
          <AnnotationPanel handleCancel={handleCancel} labelList={props.labelList} accession_no={props.accession_no} gradCamList={props.gradCamList} updateTimestamp={props.updateTimestamp}/>
        </Modal>
      </div>
    )
}