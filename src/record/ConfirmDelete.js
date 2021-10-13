import React, { useState } from "react";
import { Form, Input, Button } from "antd";

export default function ConfirmDelete(props) {
  const [cfmMessage, setCfmMessage] = useState("");
  const handleOnChangeCfmMessage = (e) => {
    setCfmMessage(e.target.value);
  };
  const deleteAPI = () => {
    console.log(cfmMessage);
    // cfmMessage === props.cfmMessage ? props.deleteAPI() : modal delete failed
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item onChange={handleOnChangeCfmMessage}>
          <p
            style={{ fontSize: "large", marginBottom: "8px", color: "#58595b" }}
          >
            confirmation <i>delete covid.csv</i> to confirm
          </p>
          <div>
            <Input
              className="input-text"
              style={{ width: "550px", marginBottom: 0 }}
            />
            <Button
              className="primary-btn smaller"
              style={{ backgroundColor: "#C4C4C4", marginLeft: 8 }}
              onClick={props.handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="primary-btn smaller"
              onClick={deleteAPI}
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
