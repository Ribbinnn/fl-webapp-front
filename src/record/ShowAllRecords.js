import React, { useEffect, useState, useRef } from "react";
import { getAllRecords, deleteRecordRow, updateRecordRow } from "../api/vitals";
import { Table, Button, Input, Form, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

function ShowAllRecords(props) {

    const recordId = useRef("");

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const currentData = useRef([]);
    const [mergedColumns, setMergeColumns] = useState([]);
    const [editingKey, setEditingKey] = useState("");

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
        form.setFieldsValue(record);
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey("");
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...currentData.current];
            const index = newData.findIndex((item) => key === item.key);
            const update_data = { ...newData[index], ...row };
            delete update_data["key"];
            updateRecordRow(recordId.current, [update_data])
            .then((res) => {
                console.log(res);
                setEditingKey("");
            }).catch((err) => {
                console.log(err);
            });
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const deleteRow = (key) => {
        const newData = [...currentData.current];
        const index = newData.findIndex((item) => key === item.key);
        deleteRecordRow(recordId.current, index)
        .then((res) => {
            console.log(res);
            setEditingKey("delete");
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        getAllRecords(props.record.vitals_proj_id)
        .then((res) => {
            // create columns
            let column_list = (Object.keys(res.data[0].records[0])).map((column) => ({
                title: column === "hn" ? 
                    column.toUpperCase() : 
                    column.charAt(0).toUpperCase() + column.slice(1).split("_").join(" "),
                dataIndex: column,
                key: column,
                align: "center",
                ellipsis: {
                    showTitle: false,
                },
                render: column === "measured_time" ? column => (
                    <Tooltip placement="topLeft" title={column}>
                        {column}
                    </Tooltip>
                ) : null,
                editable: column === "hn" || column === "entry_id" || column === "measured_time" ? false : true,
            }));
            column_list.push({
                title: "Action",
                key: "action",
                dataIndex: "action",
                render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
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
            // add key to each row
            for (const i in res.data[0].records) {
                res.data[0].records[i]["key"] = (parseInt(i)+1).toString();
            }
            setData(res.data[0].records);
            currentData.current = res.data[0].records;
            // set record_id
            props.setRecordId(res.data[0]._id);
            recordId.current = res.data[0]._id;
        }).catch((err) => {
            console.log(err);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingKey]);

    return(
        <div className="show-all-records-content">
            <div className="show-all-records-grid">
                <label style={{color: "#de5c8e", display: "block"}}>
                    Record Name: {props.record.rec_name}
                </label>
                <label style={{display: "block"}}>
                    Project: {props.record.proj_name}
                </label>
                <label>
                    Uploaded Time: {props.record.updated}
                </label>
            </div>
            <div style={{maxWidth: "1000px"}}>
                <Form form={form} component={false}>
                    <Table 
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        columns={mergedColumns} 
                        dataSource={data} 
                        pagination={false} 
                        size="small"
                        className="seven-rows-table"
                        style={{marginTop: "30px"}}
                    />
                </Form>
                <Button
                    className="primary-btn smaller"
                    style={{float: "right", marginTop: "30px"}}
                    onClick={props.next}
                    >
                        Delete all records
                </Button>
            </div>
        </div>
    );
}

export default ShowAllRecords;