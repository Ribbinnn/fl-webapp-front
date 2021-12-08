import React, { useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";

const { Option } = Select;

function UserForm(props) {
    const roles = ["clinician", "radiologist", "admin"];
    const [form] = Form.useForm();
    const [visible,setVisible] = useState(false)
    const showModal = () => {
        setVisible(true)
    };
    const handleCancel = () => {
        setVisible(false)
    };
    return(
        <div>
            <label style={{fontWeight: "bold"}}>
                {props.mode === "createuser" ? "Create New User" : "Edit User"}
            </label>
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
                        <Input
                            className="input-text"
                            defaultValue="" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        key="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{display: "inline-block"}}
                    >
                        <Input
                            className="input-text"
                            defaultValue="" />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item
                        name="password"
                        key="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{display: "inline-block", marginRight: "30px"}}
                    >
                        <Input
                            className="input-text"
                            type="password"
                            defaultValue="" />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        key="confirm"
                        label="Confirm Password"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{display: "inline-block"}}
                    >
                        <Input
                            className="input-text"
                            type="password"
                            defaultValue="" />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item
                        name="firstname"
                        key="firstname"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{display: "inline-block", marginRight: "30px"}}
                    >
                        <Input
                            className="input-text"
                            defaultValue="" />
                    </Form.Item>
                    <Form.Item
                        name="lastname"
                        key="lastname"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        style={{display: "inline-block"}}
                    >
                        <Input
                            className="input-text"
                            defaultValue="" />
                    </Form.Item>
                </div>
                <Form.Item
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
                    <Select
                        className="search-component"
                        defaultValue=""
                    >
                        {roles.map((role, i) => (
                            <Option key={i} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="submit"
                    key="submit"
                    style={{marginTop: "30px"}}
                >
                    <Button
                        className="primary-btn"
                        onClick={async () => {
                            try {
                                const data = await form.validateFields();
                                if (data.password !== data.confirm) {
                                    showModal();
                                } else {
                                    console.log(data);
                                }
                            } catch (errInfo) {
                                console.log('Validate Failed:', errInfo);
                            }
                        }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                visible={visible}
                title={null}
                onCancel={handleCancel}
                footer={null}>
                    Confirm Password does not match.
            </Modal>
        </div>
    );
}

export default UserForm;