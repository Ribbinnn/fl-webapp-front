import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Image, Modal } from "antd";
import { login } from "./api/login";

function Login() {
  const [form] = Form.useForm();
  const [remember, setRemember] = useState(false);

  function rememberOnChange(item) {
    setRemember(item.target.checked);
  }

  return (
    <div style={{ width: "100%" }}>
      <Row align="middle" justify="center" style={{ height: "100%" }}>
        <Col span={12} align="middle">
          <Image
            preview={false}
            height={500}
            src="/logos/DeepMed Login Logo.png"
          />
        </Col>
        <Col span={12}>
          <div className="center-div">
            <Form form={form} layout="vertical" requiredMark={false}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                    {
                        required: true,
                    },
                ]}
                style={{ marginBottom: "10px" }}
              >
                <Input className="input-text" style={{ width: "300px" }} />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                    {
                        required: true,
                    },
                ]}
                style={{ marginBottom: "10px" }}
              >
                <Input
                  className="input-text"
                  type="password"
                  style={{ width: "300px" }}
                />
              </Form.Item>
              <Form.Item>
                <div style={{ display: "inline-block" }}>
                  <label
                    id="smaller-label"
                    className="center-div checkbox-container"
                  >
                    <Input type="checkbox" onChange={rememberOnChange} />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                </div>
                {/* <label 
                    id="smaller-label" 
                    className="clickable-label" 
                    style={{float: "right", color: "#de5c8e"}}>
                        Forgot password?
                </label> */}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  className="primary-btn"
                  style={{ width: "100%" }}
                  onClick={async () => {
                    /* call sign in api */
                    const data = await form.validateFields();
                    login(data.username, data.password, remember)
                      .then((respond) => {
                        window.location.reload();
                      })
                      .catch((e) => {
                        if (e.response !== undefined) {
                          Modal.error({content: e.response.data.message});
                        } else {
                          Modal.error({content: "Cannot connect to the server."});
                        }
                      });
                  }}
                >
                  Sign in
                </Button>
              </Form.Item>
              <div className="hr-divider">
                <label id="smaller-label">OR</label>
              </div>
              <div className="center-div">
                <a href="https://account.it.chula.ac.th/login?service=http://localhost:3000/auth">
                  <img
                    src="https://account.it.chula.ac.th/images/ConnectWithChulaSSO.png"
                    width="300"
                  />
                </a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
