import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Button, Modal, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { createUser, updateUser, getAllUsers, getUserById } from "../api/admin";

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);
const { Option } = Select;

function UserForm() {
    const { mode } = useParams();
    const [loaded, setLoaded] = useState(false);
    const roles = ["clinician", "radiologist", "admin"];
    const [users, setUsers] = useState([]);
    const [isChulaSSO, setIsChulaSSO] = useState(null);
    const [form] = Form.useForm();
    const [submit, setSubmit] = useState(false);
    const [inputVisible, setInputVisible] = useState(true);
    useEffect(() => {
        setLoaded(false);
        setSubmit(false);
        form.resetFields();
        if (mode === "edituser") {
            getAllUsers()
            .then((res) => {
                setUsers(res);
                setInputVisible(false);
                setLoaded(true);
            }).catch((err) => console.log(err.response));
        } else {
            setInputVisible(true);
            setLoaded(true);
        }
    }, [mode]);
    return(
        <div>
            <label style={{fontWeight: "bold"}}>
                {mode === "createuser" ? "Create New User" : "Edit User"}
            </label>
            {!loaded && (
                <div style={{ textAlign: "center", marginTop: "20%" }}>
                <Spin indicator={LoadingIcon} />
                <br />
                <br />
                <span style={{ fontSize: "medium", color: "#de5c8e" }}>
                    Loading ...
                </span>
                </div>
            )}
            {loaded && 
                <Form form={form} layout="vertical" requiredMark={false} style={{marginTop: "30px"}}>
                    <div>
                        <Form.Item
                            name="username"
                            key="username"
                            label="Username"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            style={{display: "inline-block", marginRight: "30px"}}
                        >
                            {mode === "createuser" ? 
                                <Input className="input-text admin" disabled={submit ? true : false} /> :
                                <Select
                                    className="search-component wider" 
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={(id) => {
                                        // setLoaded(false);
                                        getUserById(id)
                                        .then((res) => {
                                            setIsChulaSSO(res["isChulaSSO"]);
                                            form.setFieldsValue({...res, username: id, password: "", confirm: ""});
                                            setSubmit(false);
                                            setInputVisible(true);
                                            // setLoaded(true);
                                        }).catch((err) => console.log(err.response));
                                    }}
                                >
                                    {users.map((user, i) => (
                                        <Option key={i} value={user["_id"]}>
                                            {user.username}
                                        </Option>
                                    ))}
                                </Select>}
                        </Form.Item>
                        {inputVisible && <Form.Item
                            name="email"
                            key="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    type: "email"
                                },
                            ]}
                            style={{display: "inline-block"}}
                        >
                            <Input className="input-text admin" disabled={submit || isChulaSSO ? true : false} />
                        </Form.Item>}
                    </div>
                    {inputVisible && <div>
                        <Form.Item
                            name="password"
                            key="password"
                            label="Password"
                            rules={[
                                {
                                    required: mode === "createuser" ? true : false,
                                },
                                {
                                    min: 8,
                                    max: 32,
                                    message: "'password' length must be 8-32."
                                }
                            ]}
                            style={{display: "inline-block", marginRight: "30px"}}
                        >
                            <Input className="input-text admin" type="password" disabled={submit || isChulaSSO ? true : false} />
                        </Form.Item>
                        <Form.Item
                            name="confirm"
                            key="confirm"
                            label="Confirm Password"
                            rules={[
                                {
                                    required: mode === "createuser" ? true : false,
                                },
                            ]}
                            style={{display: "inline-block"}}
                        >
                            <Input className="input-text admin" type="password" disabled={submit || isChulaSSO ? true : false} />
                        </Form.Item>
                    </div>}
                    {inputVisible && <div>
                        <Form.Item
                            name="first_name"
                            key="first_name"
                            label="First Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            style={{display: "inline-block", marginRight: "30px"}}
                        >
                            <Input className="input-text admin" disabled={submit || isChulaSSO ? true : false} />
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            key="last_name"
                            label="Last Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            style={{display: "inline-block"}}
                        >
                            <Input className="input-text admin" disabled={submit || isChulaSSO ? true : false} />
                        </Form.Item>
                    </div>}
                    {inputVisible && <Form.Item
                        name="role"
                        key="role"
                        label="Role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{display: "inline-block"}}
                    >
                        <Select className="search-component wider" disabled={submit ? true : false}>
                            {roles.map((role, i) => (
                                <Option key={i} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>}
                    {inputVisible && <Form.Item
                        style={{marginTop: "30px"}}
                    >
                        {submit ? 
                            <Button
                                className="primary-btn"
                                onClick={() => window.location.reload()}
                            >
                                {mode === "createuser" ? "Create new user" : "Edit other users"}
                            </Button> :
                            <Button
                                className="primary-btn"
                                onClick={async () => {
                                    try {
                                        let checkPassword = true;
                                        const data = await form.validateFields();
                                        if (data.password === undefined || data.password === "") {
                                            data["password"] = "";
                                        } else if (data.password !== data.confirm) {
                                            Modal.warning({content: "Confirm Password does not match."});
                                            checkPassword = false;
                                        }
                                        if (checkPassword) {
                                            if (mode === "createuser") {
                                                createUser(data.username, data.password, data.first_name, data.last_name, data.role, data.email)
                                                .then((res) => {
                                                    // console.log(res);
                                                    Modal.success({content: "Create user successfully."});
                                                    setSubmit(true);
                                                }).catch((err) => console.log(err.response));
                                            } else {
                                                updateUser(data.first_name, data.last_name, data.role, data.email, data.username, data.password, isChulaSSO)
                                                .then((res) => {
                                                    // console.log(res);
                                                    Modal.success({content: "Update user successfully."});
                                                    setSubmit(true);
                                                }).catch((err) => console.log(err.response));
                                            }
                                        }
                                    } catch (errInfo) {
                                        console.log('Validate Failed:', errInfo);
                                    }
                                }}
                            >
                                Submit
                            </Button>}
                    </Form.Item>}
                </Form>}
        </div>
    );
}

export default UserForm;