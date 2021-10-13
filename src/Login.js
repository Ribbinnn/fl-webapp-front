import React, {useState} from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { login } from './api/login';

function Login() {

    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function usernameOnChange(item) {
        setUsername(item.target.value)
    }

    function passwordOnChange(item) {
        setPassword(item.target.value)
    }

    return(
        <div style={{width: "100%"}}>
            <Row align="middle" justify="center" style={{height: "100%"}}>
                <Col span={12}>
                    <div className="center-div" style={{margin: "auto", width: "300px", height: "300px", backgroundColor: "rgb(229,229,229)"}}>
                        <label>Temp Logo Image</label>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="center-div">
                        <Form layout="vertical">
                            <Form.Item 
                                onChange={usernameOnChange} 
                                label="Username" 
                                style={{marginBottom: "10px"}}
                            >
                                <Input className="input-text" style={{width: "300px"}} />
                            </Form.Item>
                            <Form.Item 
                                onChange={passwordOnChange}
                                label="Password" 
                                style={{marginBottom: "10px"}}
                            >
                                <Input className="input-text" type="password" style={{width: "300px"}} />
                            </Form.Item>
                            <Form.Item>
                                <div style={{display: "inline-block"}}>
                                    <label id="smaller-label" className="center-div checkbox-container">
                                        <Input type="checkbox" />
                                        <span className="checkmark"></span>
                                        Remember me
                                    </label>
                                </div>
                                <a id="smaller-label" style={{float: "right", color: "#de5c8e"}}>Forgot password?</a>
                            </Form.Item>
                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    className="primary-btn" 
                                    style={{width: "100%"}}
                                    onClick={async () => {
                                        /* call sign in api */
                                        login(username, password).then((respond)=>{
                                            history.push("/");
                                        }).catch((e)=>{
                                            console.log(e)
                                        })
                                        
                                    }}>
                                        Sign in
                                </Button>
                            </Form.Item>
                            <div className="hr-divider">
                                <label id="smaller-label">OR</label>
                            </div>
                            <div className="center-div" style={{margin: "auto", width: "300px", height: "80px", backgroundColor: "rgb(229,229,229)"}}>
                                <label>Connect with ChulaSSO</label>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Login;