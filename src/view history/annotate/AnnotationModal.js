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
        <Button type="link" onClick={showModal} icon={<HighlightOutlined className="clickable-icon"/>}>
            Annotate Image
        </Button>
        <Modal
          centered
          destroyOnClose
          maskClosable={false}
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          width="1200px"
          accession_no={props.accession_no}
        >
          <AnnotationPanel handleCancel={handleCancel} labelList={props.labelList}/>
        </Modal>
      </div>
    )
}