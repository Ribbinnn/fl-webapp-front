import React, { useState } from "react";
import { Modal, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

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
          visible={visible}
          title={`${props.ProcDescription} ${props.StudyDateTime}`}
          onCancel={handleCancel}
          footer={null}
        >
        </Modal>
      </div>
    )
}