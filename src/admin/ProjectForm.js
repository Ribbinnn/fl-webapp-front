import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Button, Modal, Spin, Row, Col, Tag, Tooltip } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllUsers } from "../api/admin";
import { createProject, getAllProjects, getProjectInfoByID, updateProjectById } from "../api/project";

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);
const { Option } = Select;
const { TextArea } = Input;

function ProjectForm() {
    const { mode } = useParams();
    const [loaded, setLoaded] = useState(false);
    const palette = ["magenta","red","volcano","orange","gold","green","cyan","blue","geekblue","purple"];
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState(""); // required ?
    const tasks = ["classification_pylon_256", "classification_pylon_1024", "covid19_admission"];
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    // const [classesStatus, setClassesStatus] = useState("success");
    // const [helpMessage, setHelpMessage] = useState(null);
    // const tagInputRef = useRef(null);
    // const tagEditInputRef = useRef(null);
    const [tagInputVisible, setTagInputVisible] = useState(false);
    const [tagInputVal, setTagInputVal] = useState("");
    const [tagEditInputVal, setTagEditInputVal] = useState("");
    const [tagEditInputIndex, setTagEditInputIndex] = useState(-1);
    const handleInputConfirm = () => {
        const inputVal = tagInputVal;
        let tags = classes;
        if (inputVal && tags.indexOf(inputVal) === -1) {
            tags = [...tags, inputVal];
        }
        setClasses(tags);
        setTagInputVisible(false);
        setTagInputVal("");
    }
    const handleEditInputConfirm = () => {
        const newClasses = [...classes];
        newClasses[tagEditInputIndex] = tagEditInputVal;
        setClasses(newClasses);
        setTagEditInputIndex(-1);
        setTagEditInputVal("");
    }
    const [form] = Form.useForm();
    const [submit, setSubmit] = useState(false);
    const [inputVisible, setInputVisible] = useState(true);
    useEffect(() => {
        setLoaded(false);
        // console.log(tagInputRef, tagEditInputRef);
        form.resetFields();
        setClasses([]);
        if (mode === "editproject") {
            getAllProjects()
            .then((res) => {
                console.log(res);
                setProjects(res);
                getAllUsers()
                .then((res) => {
                    setUsers(res.filter(user => user.role === "radiologist"));
                    setInputVisible(false);
                    setLoaded(true);
                }).catch((err) => console.log(err.response));
            }).catch((err) => console.log(err.response));
        } else {
            getAllUsers()
            .then((res) => {
                setUsers(res.filter(user => user.role === "radiologist"));
                setInputVisible(true);
                setLoaded(true);
            }).catch((err) => console.log(err.response));
        }
    }, [mode]);
    return(
        <div>
            <label style={{fontWeight: "bold"}}>
                {mode === "createproject" ? "Create New Project" : "Edit Project"}
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
            {loaded && <Form form={form} layout="vertical" requiredMark={false} style={{marginTop: "30px"}}>
                <Row>
                    <Col span={13}>
                        <div>
                            <Form.Item
                                name="name"
                                key="name"
                                label="Project Name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                style={{display: "inline-block", marginRight: "30px"}}
                            >
                                {mode === "createproject" ?
                                    <Input className="input-text" disabled={submit ? true : false} /> :
                                    <Select
                                        className="search-component wider" 
                                        allowClear
                                        showSearch
                                        optionFilterProp="label"
                                        onChange={(id) => {
                                            // setLoaded(false);
                                            getProjectInfoByID(id)
                                            .then((res) => {
                                                console.log(res);
                                                const data = res.data;
                                                setProjectName(data.name);
                                                form.setFieldsValue({task: data.task, description: data.description, head: data.head});
                                                setClasses(data.predClasses);
                                                setSubmit(false);
                                                setInputVisible(true);
                                                // setLoaded(true);
                                            }).catch((err) => console.log(err.response));
                                        }}
                                    >
                                        {projects.map((project, i) => {
                                            let projectHead = "";
                                            for (const i in project.head) {
                                                if (parseInt(i)+1 === project.head.length) {
                                                    projectHead += project.head[i].username;
                                                } else {
                                                    projectHead += project.head[i].username + ", ";
                                                }
                                            }
                                            return(
                                                <Option key={i} value={project["_id"]} label={project.name}>
                                                    <div className="select-item-group">
                                                        <label>{project.name}</label>
                                                        <br />
                                                        <label style={{fontSize: "small"}}>{projectHead}</label>
                                                    </div>
                                                </Option>
                                            );
                                        })}
                                    </Select>}
                            </Form.Item>
                            {inputVisible && <Form.Item
                                name="task"
                                key="task"
                                label="Task"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                style={{display: "inline-block"}}
                            >
                                <Select className="search-component wider" allowClear disabled={submit ? true : false}>
                                    {tasks.map((task, i) => (
                                        <Option key={i} value={task}>
                                            {task}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>}
                        </div>
                        {inputVisible && <Form.Item
                            // name="predClasses"
                            // key="predClasses"
                            label="Classes"
                            // initialValue={classes}
                            // validateStatus={classesStatus}
                            // help={helpMessage}
                            // rules={[
                            //     {
                            //         validator: async (_, classes) => {
                            //             console.log(classes);
                            //             if (classes.length === 0) {
                            //                 return Promise.reject(new Error("'classes' is required"));
                            //             }
                            //         },
                            //     },
                            // ]}
                            style={{width: "516px"}}
                        >
                            <div className={submit ? "input-text tag-wrapper disabled" : "input-text tag-wrapper"}>
                                <>
                                    {classes.map((tag, index) => {
                                        if (tagEditInputIndex === index) {
                                            return (
                                                <Input
                                                    // ref={tagEditInputRef}
                                                    key={tag}
                                                    size="small"
                                                    className="tag-input"
                                                    value={tagEditInputVal}
                                                    onChange={(e) => setTagEditInputVal(e.target.value)}
                                                    onBlur={handleEditInputConfirm}
                                                    onPressEnter={handleEditInputConfirm}
                                                />
                                            );
                                        }
                                        const isLongTag = tag.length > 20;
                                        const tagElem = (
                                            <Tag
                                                className={submit ? "edit-tag disabled" : "edit-tag"}
                                                disabled={submit ? true : false}
                                                key={tag}
                                                color={palette[(tag.charCodeAt(0))%palette.length]}
                                                closable={true}
                                                onClose={(e) => {
                                                    if (!submit) {
                                                        const updatedClasses = classes.filter(tags => tags !== tag);
                                                        setClasses(updatedClasses);
                                                    } else {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <span
                                                    onDoubleClick={(e) => {
                                                        if (!submit) {
                                                            setTagEditInputIndex(index);
                                                            setTagEditInputVal(tag);
                                                            // tagEditInputRef.current.focus();
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                </span>
                                            </Tag>
                                        );
                                        return isLongTag ? (
                                            <Tooltip title={tag} key={tag}>
                                                {tagElem}
                                            </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                    })}
                                    {tagInputVisible && (
                                        <Input
                                            // ref={tagInputRef}
                                            type="text"
                                            size="small"
                                            className="tag-input"
                                            value={tagInputVal}
                                            onChange={(e) => setTagInputVal(e.target.value)}
                                            onBlur={handleInputConfirm}
                                            onPressEnter={handleInputConfirm}
                                        />
                                    )}
                                    {!tagInputVisible && (
                                        <Tag 
                                            className={submit ? "site-tag-plus disabled" : "site-tag-plus"} 
                                            disabled={submit ? true : false} 
                                            onClick={() => {
                                                if (!submit) {
                                                    setTagInputVisible(true);
                                                    // tagInputRef.current.focus();
                                                }
                                            }}
                                        >
                                            <PlusOutlined /> add class
                                        </Tag>
                                    )}
                                </>
                            </div>
                        </Form.Item>}
                        {inputVisible && <Form.Item
                            name="description"
                            key="description"
                            label="Description"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            style={{width: "516px"}}
                        >
                            <TextArea
                                className="input-text"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                disabled={submit ? true : false}
                            />
                        </Form.Item>}
                        {inputVisible && <Form.Item
                            name="head"
                            key="head"
                            label="Head (at least 1)"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                className="multiple-select"
                                mode="multiple"
                                allowClear 
                                disabled={submit ? true : false}
                            >
                                {users.map((user, i) => (
                                    <Option key={i} value={user["_id"]}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>}
                    </Col>
                    <Col span={11}>
                        {/* <Form.List
                            name="head"
                            rules={[
                                {
                                    validator: async (_, head) => {
                                    if (!head) {
                                        return Promise.reject(new Error("At least 1 'head' is required"));
                                    }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        label={index === 0 ? "Head " + (index + 1) : "Head " + (index + 1) + " (Optional)"}
                                        required={false}
                                        key={field.key}
                                        style={{display: "inline-block", margin: "0 30px 0 0"}}
                                    >
                                        <Form.Item
                                            {...field}
                                            rules={[
                                                {
                                                    required: index === 0 ? true : false,
                                                    message: "At least 1 'head' is required",
                                                },
                                            ]}
                                            style={{display: "inline-block"}}
                                        >
                                            <Select
                                                className="search-component" 
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                onChange={(value) => {
                                                    // setLoaded(false);
                                                    selectedUsers[index] = value;
                                                }}
                                            >
                                                {filterUsers.map((user, i) => (
                                                    <Option key={i} value={user["_id"]}>
                                                        {user.username}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        {fields.length > 1 && index !== 0 ? (
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                style={{display: "inline-block", margin: "12px 0 0 7px", color: "#58595b"}}
                                                onClick={() => remove(field.name)}
                                            />
                                        ) : null}
                                    </Form.Item>
                                ))}
                                <Form.Item
                                    label={fields.length === 0 ? "Head" : ""}
                                    style={{display: "inline-block", marginTop: fields.length === 0 ? 0 : "35px"}}
                                >
                                    <Button
                                        type="dashed"
                                        className="add-button"
                                        onClick={() => add()}
                                        style={{ width: "200px" }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Head
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                            )}
                        </Form.List> */}
                    </Col>
                </Row>
                {inputVisible && <Form.Item
                    style={{marginTop: "30px"}}
                >
                    {submit ?
                        <Button
                            className="primary-btn"
                            onClick={() => window.location.reload()}
                        >
                            {mode === "createproject" ? "Create new project" : "Edit other projects"}
                        </Button> :
                        <Button
                            className="primary-btn"
                            onClick={async () => {
                                try {
                                    const data = await form.validateFields();
                                    console.log(data);
                                    console.log(classes);
                                    // if (classes.length === 0) {
                                    //     setClassesStatus("error");
                                    //     setHelpMessage("'classes' is required");
                                    // }
                                    if (mode === "createproject") {
                                        createProject(data.name, data.task, data.description, classes, data.head)
                                        .then((res) => {
                                            console.log(res);
                                            Modal.success({content: "Create project successfully."});
                                            setSubmit(true);
                                        }).catch((err) => console.log(err.response));
                                    } else {
                                        console.log(projectName);
                                        updateProjectById(projectName, data.task, data.description, classes, data.head, data.name)
                                        .then((res) => {
                                            console.log(res);
                                            Modal.success({content: "Update project successfully."});
                                            setSubmit(true);
                                        }).catch((err) => console.log(err.response));
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

export default ProjectForm;