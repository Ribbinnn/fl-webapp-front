import React, { useState, useEffect } from "react";
import { Table, Tooltip, Spin, Form, DatePicker, Button, Popconfirm, Input } from "antd";
import { LoadingOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs"
import ImageModal from "../component/ImageModal";
import * as moment from "moment";

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function SelectXRayImage(props) {

    const [loaded, setLoaded] = useState(true);

    const fields = ["Patient Name", "Accession No", "Patient ID", "Modality", "Study Date Time", "Procedure Code"];
    const [columns, setColumns] = useState(null);
    const [unchangedData, setUnchangedData] = useState(null);
    const [tableData, setTableData] = useState(null);

    const [HN, setHN] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const rowSelection = {
        type: "radio",
        selectedRowKeys: props.accessionNoIndex,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            props.setAccessionNoIndex(selectedRowKeys);
            props.setAccessionNo(selectedRows[0]["Accession No"]);
        },
    };

    const prepareTable = (data) => {
        // create columns
        let field_list = (fields).map((field) => ({
            title: field,
            dataIndex: field,
            key: field,
            align: "center",
            ellipsis: {
                showTitle: false,
            },
            render: field === "Patient Name" || field === "Proc Description" || field === "Study Date Time" ? field => (
                <Tooltip placement="topLeft" title={field}>
                    {field}
                </Tooltip>
            ) : null,
        }));
        field_list.push({
            title: "Preview",
            key: "preview",
            dataIndex: "preview",
            render: (_, record) => {
                return(
                    <div className="center-div">
                        <ImageModal
                            AccessionNo={record["Accession No"]}
                            ProcDescription={record["Proc Description"]}
                            StudyDateTime={record["Study Date Time"]} />
                        {props.mode === "annotate" ?
                            <div className="center-div">
                                <EditOutlined
                                    className="clickable-icon"
                                    // style={{marginLeft: "8px"}}
                                    onClick={() => {
                                        /* annotate api */
                                    }}
                                />
                                <Popconfirm
                                    title="Delete this report?"
                                    onConfirm={() => {
                                        /* delete image api */
                                    }}
                                    okButtonProps={{ className: "primary-btn popconfirm" }}
                                    cancelButtonProps={{ style: { display: "none" } }}
                                >
                                    <DeleteOutlined
                                        className="clickable-icon"
                                        style={{ marginLeft: "8px" }}
                                    />
                                </Popconfirm>
                            </div> : null}
                    </div>
                );
            },
            align: "center",
        });
        setColumns(field_list);
        // add key to each row & change date-time
        for (const i in data) {
            data[i]["key"] = (parseInt(i)+1).toString();
            data[i]["Study Date Time"] = new Date(data[i]["Study Date Time"]).toLocaleString();
        }
        return data;
    }

    useEffect(() => {
        if (props.mode === "diagnosis") {
            if (props.pacsTableData) {
                setTableData(prepareTable(props.pacsTableData));
            }
        } else {
            setLoaded(false);
            getPatientData(1234567 /* ,props.fromDate, props.toDate */) // change api for research later
            .then((res) => {
                const data = prepareTable(res.data);
                setTableData(data);
                setUnchangedData(data);
                setLoaded(true);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, []);

    return(
        <div>
            <label style={{marginBottom: "8px"}}>{props.mode === "diagnosis" ? "Select X-Ray Image" : "Annotate Images"}</label>
            <Form layout="inline" style={{marginBottom: loaded ? "32px" : 0}}>
                {props.mode === "annotate" &&
                    <Form.Item
                        name="hn"
                        label="HN"
                        style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                    >
                        <Input
                            className="input-text"
                            onChange={(item) => setHN(item.target.value)}
                            style={{width:"200px"}} />
                    </Form.Item>}
                <Form.Item
                    name="from"
                    label="From"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >   
                    <DatePicker
                        defaultValue={props.fromDate ? moment(props.fromDate) : null}
                        onChange={(date) => {
                            props.mode === "diagnosis" ?
                                props.setFromDate(date? date.startOf('day').toDate(): null) // Moment Object
                                : setFromDate(date? date.startOf('day').toDate(): null)
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item
                    name="to"
                    label="To"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                    <DatePicker
                        defaultValue={props.toDate ? moment(props.toDate) : null}
                        onChange={(date) => {
                            props.mode === "diagnosis" ?
                                props.setToDate(date? date.endOf('day').toDate(): null) // Moment Object
                                : setToDate(date? date.endOf('day').toDate(): null)
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item style={{marginLeft:"20px"}}>
                    <Button
                        className="primary-btn smaller"
                        style={{marginTop:"32px"}}
                        onClick={() => {
                            setLoaded(false);
                            if (props.mode === "diagnosis") {
                                getPatientData(props.HN /* ,props.fromDate, props.toDate */)
                                .then((res) => {
                                    const data = prepareTable(res.data);
                                    setTableData(data);
                                    props.setPacsTableData(data);
                                    props.setAccessionNoIndex([]);
                                    props.setAccessionNo(null);
                                    setLoaded(true);
                                }).catch((err) => {
                                    console.log(err);
                                });
                            } else {
                                let filterData = unchangedData.filter((item, i) => ( // check from/to date filter later
                                    (HN === "" ? true : item["Patient ID"].includes(HN)) &&
                                    (fromDate === null ? true : new Date(item["Study Date Time"]) >= fromDate) &&
                                    (toDate === null ? true : new Date(item["Study Date Time"]) <= toDate)
                                ))
                                setTableData(filterData);
                                setLoaded(true);
                            }
                        }}>
                            {props.mode === "diagnosis" ? "Search" : "Filter"}
                    </Button>
                </Form.Item>
            </Form>
            {!loaded && (
                <div style={{ textAlign: "center", marginTop: "10%" }}>
                <Spin indicator={LoadingIcon} />
                <br />
                <br />
                <span style={{ fontSize: "medium", color: "#de5c8e" }}>
                    Loading ...
                </span>
                </div>
            )}
            {loaded && tableData && 
                <Table 
                    columns={columns} 
                    dataSource={tableData} 
                    pagination={false} 
                    rowSelection={props.mode === "diagnosis" ? rowSelection : null}
                    size="small"
                    className="seven-rows-table"
                />
            }
        </div>
    );
}

export default SelectXRayImage;