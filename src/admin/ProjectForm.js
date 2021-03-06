import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, Select, Button, Modal, Spin, Tag, Tooltip, Popconfirm } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllUsers } from "../api/admin";
import { createProject, getAllProjects, getProjectInfoByID, updateProjectById, getAllTasks } from "../api/project";

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
    const [projectName, setProjectName] = useState("");
    const [tasks, setTasks] = useState("");
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classesError, setClassesError] = useState(false);
    const [tagInputVisible, setTagInputVisible] = useState(false);
    const [tagInputVal, setTagInputVal] = useState("");
    const [tagEditInputVal, setTagEditInputVal] = useState("");
    const [tagEditInputIndex, setTagEditInputIndex] = useState(-1);
    const handleInputConfirm = () => {
        const inputVal = tagInputVal;
        let tags = classes;
        if (inputVal && tags.indexOf(inputVal) === -1) {
            if (inputVal.includes(",")) {
                const newClasses = inputVal.split(",").filter(tag => !tags.includes(tag));
                if (newClasses.includes(", ")) {
                    newClasses = newClasses.split(", ").filter(tag => !tags.includes(tag));
                }
                tags = [...tags, ...newClasses];
            } else {
                tags = [...tags, inputVal];
            }
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
        getAllTasks()
          .then((res) => setTasks(res.data))
          .catch((err) => console.log(err.response));
        setLoaded(false);
        setSubmit(false);
        form.resetFields();
        setClasses([]);
        if (mode === "editproject") {
            getAllProjects()
            .then((res) => {
                // console.log(res);
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
                            <Input className="input-text admin" disabled={submit ? true : false} /> :
                            <Select
                                className="search-component wider" 
                                showSearch
                                optionFilterProp="label"
                                onChange={(id) => {
                                    // setLoaded(false);
                                    getProjectInfoByID(id)
                                    .then((res) => {
                                        const data = res.data;
                                        let head = res.data.head.map((head) => head._id);
                                        setProjectName(data.name);
                                        form.setFieldsValue({task: data.task, description: data.description, head: head});
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
                        <Select className="search-component wider" disabled={submit ? true : false}>
                            {tasks.map((task, i) => (
                                <Option key={i} value={task}>
                                    {task}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>}
                </div>
                {inputVisible && <Form.Item
                    label={<label>Classes <label style={{fontSize: "medium"}}>(split with , if input more than 1 class at the same time)</label></label>}
                    validateStatus={classesError ? "error" : "success"}
                    help={classesError ? "'classes' is required" : null}
                    style={{width: "516px"}}
                >
                    <div 
                        className={submit ? "input-text tag-wrapper disabled" : "input-text tag-wrapper"} 
                        style={{borderColor: classesError ? "red" : submit ? "#d9d9d9" : "#58595b"}}
                    >
                        <>
                            {classes.map((tag, index) => {
                                if (tagEditInputIndex === index) {
                                    return (
                                        <Input
                                            autoFocus
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
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                        </span>
                                    </Tag>
                                );
                                return isLongTag && !submit ? (
                                    <Tooltip title={tag} key={tag}>
                                        {tagElem}
                                    </Tooltip>
                                    ) : (
                                        tagElem
                                    );
                            })}
                            {tagInputVisible && (
                                <Input
                                    autoFocus
                                    type="text"
                                    size="small"
                                    className="tag-input"
                                    value={tagInputVal}
                                    onChange={(e) => {
                                        setClassesError(false);
                                        setTagInputVal(e.target.value);
                                    }}
                                    onBlur={handleInputConfirm}
                                    onPressEnter={handleInputConfirm}
                                />
                            )}
                            {!tagInputVisible && (
                                <Tag 
                                    className={submit ? "site-tag-plus disabled no-select" : "site-tag-plus no-select"} 
                                    disabled={submit ? true : false} 
                                    onClick={() => {
                                        if (!submit) {
                                            setTagInputVisible(true);
                                        }
                                    }}
                                >
                                    <PlusOutlined /> add class
                                </Tag>
                            )}
                            {classes.length > 1 && (submit ?
                                <label
                                    className="no-select"
                                    style={{fontSize: "small", color: "#bfbfbf", cursor: "not-allowed"}}
                                >
                                    remove all classes
                                </label> :
                                <Popconfirm
                                    title="Remove all classes?"
                                    onConfirm={() => setClasses([])}
                                    okButtonProps={{ className: "primary-btn popconfirm" }}
                                    cancelButtonProps={{ style: { display: "none" } }}
                                >
                                    <label
                                        className="clickable-label no-select"
                                        style={{fontSize: "small", color: "red"}}
                                    >
                                        remove all classes
                                    </label>
                                </Popconfirm>)}
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
                    label={<label>Head <label style={{fontSize: "medium"}}>(at least 1)</label></label>}
                    rules={[
                        {
                            required: true,
                            message: "at least 1 'head' is required"
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
                {inputVisible && <Form.Item
                    style={{marginTop: "54px"}}
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
                                    if (mode === "createproject") {
                                        createProject(data.name, data.task, data.description, classes, data.head)
                                        .then((res) => {
                                            // console.log(res);
                                            Modal.success({content: "Create project successfully."});
                                            setSubmit(true);
                                        }).catch((err) => console.log(err.response));
                                    } else {
                                        updateProjectById(projectName, data.task, data.description, classes, data.head, data.name)
                                        .then((res) => {
                                            // console.log(res);
                                            Modal.success({content: "Update project successfully."});
                                            setSubmit(true);
                                        }).catch((err) => console.log(err.response));
                                    }
                                } catch (errInfo) {
                                    if (classes.length === 0) {
                                        setClassesError(true);
                                    }
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