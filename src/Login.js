import React from 'react';
import './Login.css'
import { Row, Col, Form, Input, Checkbox, Button } from 'antd';

function Login() {
    return(
        <div style={{width: "100%"}}>
            <Row align="middle" justify="center" style={{height: "100%"}}>
                <Col span={12}>
                    <div className="login-div login-logo">
                        Temp Logo Image
                    </div>
                </Col>
                <Col span={12}>
                    <div className="login-div">
                        <Form layout="vertical">
                            <Form.Item label="Username">
                                <Input style={{width: "300px"}} />
                            </Form.Item>
                            <Form.Item label="Password">
                                <Input type="password" style={{width: "300px"}} />
                            </Form.Item>
                            <Form.Item>
                                <Checkbox>Remember me</Checkbox>
                                <a style={{float: "right", color: "#de5c8e"}}>Forgot password?</a>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" style={{width: "100%"}}>Sign in</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Login;