import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Image } from "antd";
import { login } from "./api/login";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  function usernameOnChange(item) {
    setUsername(item.target.value);
  }

  function passwordOnChange(item) {
    setPassword(item.target.value);
  }

  function rememberOnChange(item) {
    setRemember(item.target.checked);
  }

  return (
    <div style={{ width: "100%" }}>
      <Row align="middle" justify="center" style={{ height: "100%" }}>
        <Col span={12} align="middle">
          <Image
            preview={false}
            height={400}
            src="/logos/DeepMed Login Logo.png"
          />
        </Col>
        <Col span={12}>
          <div className="center-div">
            <Form layout="vertical">
              <Form.Item
                onChange={usernameOnChange}
                label="Username"
                style={{ marginBottom: "10px" }}
              >
                <Input className="input-text" style={{ width: "300px" }} />
              </Form.Item>
              <Form.Item
                onChange={passwordOnChange}
                label="Password"
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
                    login(username, password, remember)
                      .then((respond) => {
                        window.location.reload();
                      })
                      .catch((e) => {
                        console.log(e);
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
