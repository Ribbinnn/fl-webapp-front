import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useContext } from "react";
import { Input, Form, Table, Popconfirm, Tooltip, Button, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAllRecordsByHN, updateRecordRow, deleteRecordRow } from "../api/vitals"
import Contexts from '../utils/Contexts';

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

const SelectMedicalRecord = forwardRef((props, ref) => {
    const { globalProject, setGlobalProject } = useContext(Contexts.project);
    const [loaded, setLoaded] = useState(false);
    const [hasRecord, setHasRecord] = useState(true);
    const [requirementForm] = Form.useForm();
    const [requirementInput, setRequirementInput] = useState(null);

    useImperativeHandle(ref, () => ({
        setMedicalRecord: async () => {
            try {
                if (!hasRecord) {
                    const data = await requirementForm.validateFields();
                    data["hn"] = parseInt(props.HN); // add HN
                    for (const i in data) {
                        if (!isNaN(data[i])) {
                            data[i] = parseInt(data[i]);
                        }
                    }
                    data["measured_time"] = new Date(data["measured_time"]);
                    props.setMedRec(data);
                }
                if (hasRecord && props.MedRec === null) {
                    Modal.warning({content: "Please select Medical Record."});
                } else {
                    await props.setCurrent(props.current + 1);
                }
            } catch (errInfo) {
                console.log('Validate Failed:', errInfo);
            }
        },
    }));

    const [tableForm] = Form.useForm();
    const [data, setData] = useState([]);
    const currentData = useRef([]);
    const columns = ["measured_time", "updated_time"];
    const [mergedColumns, setMergeColumns] = useState([]);
    const [editingKey, setEditingKey] = useState("");

    const rowSelection = {
        type: "radio",
        selectedRowKeys: props.MedRecIndex,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            const selected_data = {...selectedRows[0]};
            const remove_field = ["key", "clinician_first_name", "project_id", "project_name", 
                "record_id", "updatedAt", "updated_time"];
            for (const i in remove_field) {
                delete selected_data[remove_field[i]];
            }
            props.setMedRecIndex(selectedRowKeys);
            props.setMedRec(selected_data);
        },
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        record,
        index,
        children,
        ...restProps
    }) => {
        return (
          <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Input className="input-text smaller" />
                </Form.Item>
            ) : (
                children
            )}
          </td>
        );
    };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        tableForm.setFieldsValue(record);
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey("");
    };
    const save = async (key) => {
        try {
            setLoaded(false);
            const row = await tableForm.validateFields();
            const newData = [...currentData.current];
            const index = newData.findIndex((item) => key === item.key);
            const update_data = { ...newData[index], ...row };
            const record_id = update_data.record_id;
            const remove_field = ["key", "clinician_first_name", "project_id", "record_id", "updatedAt"];
            for (const i in remove_field) {
                delete update_data[remove_field[i]];
            }
            for (const i in update_data) {
                if (!isNaN(update_data[i])) {
                    update_data[i] = parseInt(update_data[i]);
                }
            }
            update_data["measured_time"] = new Date(update_data["measured_time"]);
            update_data["updated_time"] = new Date(update_data["updated_time"]);
            updateRecordRow(globalProject.projectId, record_id, [update_data])
            .then((res) => {
                // console.log(res);
                setEditingKey("");
            }).catch((err) => {
                console.log(err.response);
                Modal.error({content: err.response.data.error});
            });
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const deleteRow = (key) => {
        setLoaded(false);
        const newData = [...currentData.current];
        const index = newData.findIndex((item) => key === item.key);
        deleteRecordRow(newData[index].record_id, newData[index].entry_id)
        .then((res) => {
            // console.log(res);
            setEditingKey("delete");
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        getAllRecordsByHN(props.HN, globalProject.projectName)
        .then((res) => {
            if (res.data.length !== 0) {
                setHasRecord(true);
                // add additional required field of each project
                for (const i in globalProject.projectReq) {
                    columns.push(globalProject.projectReq[i]["name"]);
                }
                columns.push("clinician");
                // create columns
                let column_list = (columns).map((column) => ({
                    title: column.charAt(0).toUpperCase() + column.slice(1).split("_").join(" "),
                    dataIndex: column === "clinician" ? "clinician_first_name" : column,
                    key: column === "clinician" ? "clinician_first_name" : column,
                    align: "center",
                    ellipsis: {
                        showTitle: false,
                    },
                    render: column === "measured_time" || column === "updated_time" ? column => (
                        <Tooltip placement="topLeft" title={column}>
                            {column}
                        </Tooltip>
                    ) : null,
                    editable: column === "measured_time" || column === "updated_time" || column === "clinician" ? false : true,
                }));
                column_list.push({
                    title: "Action",
                    key: "action",
                    dataIndex: "action",
                    render: (_, record) => {
                        const editable = isEditing(record);
                        return(
                            record.clinician_first_name.toLowerCase() === (JSON.parse(sessionStorage.getItem('user'))).username ?
                            (editable ? (
                                <div className="center-div">
                                    <Popconfirm 
                                        title="Save this row?" 
                                        onConfirm={() => save(record.key)}
                                        okButtonProps={{className: "primary-btn popconfirm"}}
                                        cancelButtonProps={{style: {display: "none"}}}>
                                            <SaveOutlined 
                                                className="clickable-icon" />
                                    </Popconfirm>
                                    <CloseOutlined 
                                        className="clickable-icon" 
                                        style={{marginLeft: "8px"}} 
                                        onClick={() => cancel()} />
                                </div>
                            ) : (
                                <div className="center-div">
                                    <EditOutlined 
                                        className="clickable-icon" 
                                        onClick={() => edit(record)} />
                                    <Popconfirm 
                                        title="Delete this row?" 
                                        onConfirm={() => deleteRow(record.key)}
                                        okButtonProps={{className: "primary-btn popconfirm"}}
                                        cancelButtonProps={{style: {display: "none"}}}>
                                            <DeleteOutlined 
                                                className="clickable-icon" 
                                                style={{marginLeft: "8px"}} />
                                    </Popconfirm>
                                </div>
                            )) :
                            null
                        );
                    },
                    align: "center",
                });
                // create merged columns from columns for editable table
                const merged_column_list = column_list.map((col) => {
                    if (!col.editable) {
                        return col;
                    }
                    return {
                        ...col,
                        onCell: (record) => ({
                            record,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            editing: isEditing(record),
                        }),
                    };
                });
                setMergeColumns(merged_column_list);
                // add key to each row & change date-time
                for (const i in res.data) {
                    res.data[i]["key"] = (parseInt(i)+1).toString();
                    res.data[i]["measured_time"] = new Date(res.data[i]["measured_time"]).toLocaleString();
                    res.data[i]["updated_time"] = new Date(res.data[i]["updated_time"]).toLocaleString();
                }
                setData(res.data);
                currentData.current = res.data;
                setLoaded(true);
            } else {
                setHasRecord(false);
                const fields = ["entry_id", "measured_time"];
                const fieldsLabel = {entry_id: "Entry id", measured_time: "Measured time (yyyy-MM-ddTHH:mm:ssZ)"}; 
                // add additional required field of each project
                for (const i in globalProject.projectReq) {
                    const field = globalProject.projectReq[i]["name"];
                    fields.push(field);
                    fieldsLabel[field] = field.charAt(0).toUpperCase() + field.slice(1).split("_").join(" ");
                }
                let requirement_input = (fields).map((field) => 
                    <Form.Item
                        name={field}
                        key={field}
                        label={fieldsLabel[field]}
                        initialValue={props.MedRec === null ? null : props.MedRec[field]}
                        style={{marginBottom: "5px"}}
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Input
                                className="input-text"
                                style={{width: "300px"}} />
                    </Form.Item>
                );
                setRequirementInput(requirement_input);
                setLoaded(true);
            }
        }).catch((err) => {
            console.log(err);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingKey]);
    
    const [clinician, setClinician] = useState("");
    const onChangeClinician = (item) => {
        setClinician(item.target.value);
    };
    const onClickFilter = () => {
        let filter_data = currentData.current.filter((item, i) => (
            clinician === "" ? true : item.clinician_first_name.toLowerCase().includes(clinician.toLowerCase())
        ));
        setData(filter_data);
    };

    return(
        <div>
            <label style={{marginBottom: "10px"}}>Medical Records</label>
            <Form layout="vertical" style={{margin: "8px 0 5px 0"}}>
                <label style={{display: "block", marginBottom: "8px"}}>Clinician</label>
                <Form.Item style={{display: "inline-block"}}>
                    <Input className="input-text" style={{width: "200px"}} onChange={onChangeClinician} />
                </Form.Item>
                <Form.Item style={{display: "inline-block", marginLeft: "18px"}}>
                    <Button className="primary-btn smaller" onClick={onClickFilter}>
                        Filter
                    </Button>
                </Form.Item>
            </Form>
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
            {loaded && hasRecord &&
                <Form form={tableForm} component={false}>
                    <Table 
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        columns={mergedColumns} 
                        dataSource={data} 
                        pagination={false} 
                        rowSelection={rowSelection}
                        size="small"
                        className="seven-rows-table"
                    />
                </Form>}
            {loaded && !hasRecord &&
                <div style={{marginLeft: "40px"}}>
                    <label style={{marginBottom: "12px"}}>No record found. Please fill in the boxes below.</label>
                    <Form 
                        form={requirementForm} 
                        layout="vertical" 
                        requiredMark={false}
                        className="smaller-form-label"
                        // style={{maxHeight: "310px", overflow: "scroll", marginTop: "10px"}}
                    >
                            {requirementInput}
                    </Form>
                </div>}
        </div>
    );
});

export default SelectMedicalRecord;