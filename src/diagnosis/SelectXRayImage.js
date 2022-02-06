import React, { useState, useEffect, useContext } from "react";
import { Table, Tooltip, Spin, Form, DatePicker, Button, Popconfirm, Input, Dropdown, Menu, Modal } from "antd";
import { LoadingOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { getPatientDataLocal } from "../api/pacs"
import { exportBBoxCsv, exportBBoxPng } from "../api/masks";
import ImageModal from "../component/ImageModal";
import AnnotationModal from "../view history/annotate/AnnotationModal";
import * as moment from "moment";
import Contexts from '../utils/Contexts';

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function SelectXRayImage(props) {

    const { globalProject, setGlobalProject } = useContext(Contexts.project);
    const [loaded, setLoaded] = useState(true);

    const fields = ["Patient Name", "Accession No", "Patient ID", "Modality", "Study Date Time", "Procedure Code"];
    const [columns, setColumns] = useState(null);
    const [tableData, setTableData] = useState(null);

    const [HN, setHN] = useState("");
    const [accessionNo, setAccessionNo] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const rowSelection = {
        type: "radio",
        selectedRowKeys: props.accessionNoIndex,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            props.setAccessionNoIndex(selectedRowKeys);
            props.setAccessionNo(selectedRows[0]["Accession No"]);
            props.setMedRec({
                ...props.MedRec,
                age: selectedRows[0]["Age"],
                gender: selectedRows[0]["Patient Sex"],
                hn: globalProject.projectReq.length === 0 ? selectedRows[0]["Patient ID"] : props.MedRec.hn,
                entry_id: globalProject.projectReq.length === 0 ? 1 : props.MedRec.entry_id,
                measured_time: globalProject.projectReq.length === 0 ? selectedRows[0]["Study Date Time"] : props.MedRec.measured_time
            })
        },
    };

    const downloadBBox = (file, type, all) => {
        const url = window.URL.createObjectURL(file)
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', type === "png" ? `bbox.png` : (all ? `bbox_all.xlsx` : `bbox.xlsx`));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        props.setLoading(false);
    }

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
                            // ProcDescription={record["Proc Description"]}
                            StudyDateTime={record["Study Date Time"]} />
                        {props.mode === "annotate" ?
                            <div className="center-div">
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item key="0">
                                            <Tooltip placement="top" title="Export bounding boxes of each report in .xlsx format">
                                                <label
                                                    className="clickable-label"
                                                    onClick={() => {
                                                        props.setLoading(true);
                                                        exportBBoxCsv(true, [record["Accession No"]])
                                                        .then((res) => {
                                                            downloadBBox(res, "xlsx", false);
                                                        }).catch((err) => {
                                                            console.log(err);
                                                        })
                                                    }}
                                                >
                                                    save .xlsx
                                                </label>
                                            </Tooltip>
                                        </Menu.Item>
                                        <Menu.Item key="1">
                                            <Tooltip placement="top" title="Export bounding boxes of each report in .png format">
                                                <label
                                                    className="clickable-label"
                                                    onClick={() => {
                                                        props.setLoading(true);
                                                        exportBBoxPng(true, record["Accession No"], record["Accession No"])
                                                        .then((res) => {
                                                            downloadBBox(res, "png", false);
                                                        }).catch((err) => {
                                                            console.log(err.response);
                                                            Modal.error({content: 'Bounding box data not found'});
                                                            props.setLoading(false);
                                                        })
                                                    }}
                                                >
                                                    save .png
                                                </label>
                                            </Tooltip>
                                        </Menu.Item>
                                    </Menu>
                                } trigger={['click']}>
                                    <DownloadOutlined className="clickable-icon" />
                                </Dropdown>
                                <AnnotationModal accession_no={record["Accession No"]} />
                                {/* <Popconfirm
                                    title="Delete this report?"
                                    onConfirm={() => {
                                        // delete image api
                                    }}
                                    okButtonProps={{ className: "primary-btn popconfirm" }}
                                    cancelButtonProps={{ style: { display: "none" } }}
                                >
                                    <DeleteOutlined
                                        className="clickable-icon"
                                        style={{ marginLeft: "8px" }}
                                    />
                                </Popconfirm> */}
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
            data[i]["Study Date Time"] = new Date(data[i]["Study Date Time"]).toLocaleDateString();
        }
        return data;
    }

    useEffect(() => {
        if (props.mode === "diagnosis") {
            if (props.pacsTableData) {
                setTableData(prepareTable(props.pacsTableData));
            }
        }
    }, []);

    return(
        <div>
            <label style={{marginBottom: "8px"}}>{props.mode === "diagnosis" ? "Select X-Ray Image" : "Annotate Images"}</label>
            <Form layout="inline" style={{marginBottom: "5px"}}>
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
                    name="acc_no"
                    label="Accession No"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                    <Input
                        className="input-text"
                        defaultValue={props.searchAccNo}
                        onChange={(item) => {
                            props.mode === "diagnosis" ?
                                props.setSearchAccNo(item.target.value)
                                : setAccessionNo(item.target.value);
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
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
                                getPatientDataLocal(
                                    props.HN, 
                                    props.searchAccNo === null ? "" : props.searchAccNo, 
                                    props.fromDate === null ? "" : props.fromDate, 
                                    props.toDate === null ? "" : props.toDate)
                                .then((res) => {
                                    if (Object.keys(res.data).length === 0) {
                                        setTableData([]);
                                        props.setPacsTableData([]);
                                        props.setAccessionNoIndex([]);
                                        props.setAccessionNo(null);
                                        setLoaded(true);
                                    } else {
                                        const data = prepareTable(res.data);
                                        setTableData(data);
                                        props.setPacsTableData(data);
                                        props.setAccessionNoIndex([]);
                                        props.setAccessionNo(null);
                                        setLoaded(true);
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                });
                            } else {
                                getPatientDataLocal(
                                    HN, 
                                    accessionNo === null ? "" : accessionNo, 
                                    fromDate === null ? "" : fromDate, 
                                    toDate === null ? "" : toDate)
                                .then((res) => {
                                    if (Object.keys(res.data).length === 0) {
                                        setTableData([]);
                                        setLoaded(true);
                                    } else {
                                        const data = prepareTable(res.data);
                                        setTableData(data);
                                        setLoaded(true);
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }
                        }}>
                            Search
                    </Button>
                </Form.Item>
            </Form>
            <label
                style={{
                    fontSize: "medium", 
                    color: "#de5c8e", 
                    marginBottom: props.mode === "annotate" ? 0 : (loaded ? "32px" : 0), 
                    marginLeft: "20px",
                    width: "100%"
                }}
            >
                Press 'Search' button without filling any fields to get all results
            </label>
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
            {loaded && tableData && props.mode === "annotate" &&
                <div style={{float: "right", margin: "10px 0 10px 0"}}>
                    <Tooltip placement="top" title="Export bounding boxes of all reports in .xlsx format">
                        <Button
                            className="primary-btn smaller"
                            onClick={() => {
                                props.setLoading(true);
                                let acc_no_list = tableData.map((data) => data["Accession No"]);
                                exportBBoxCsv(true, acc_no_list)
                                .then((res) => {
                                    downloadBBox(res, "xlsx", true);
                                }).catch((err) => {
                                    console.log(err);
                                })
                            }}
                        >
                                Export all to .xlsx
                        </Button>
                    </Tooltip>
                </div>}
            {loaded && tableData && 
                <Table 
                    columns={columns} 
                    dataSource={tableData} 
                    // pagination={false} 
                    rowSelection={props.mode === "diagnosis" ? rowSelection : null}
                    size="small"
                    // className={props.mode === "diagnosis" ? "three-rows-table with-row-selection" : "seven-rows-table with-row-selection"}
                />
            }
        </div>
    );
}

export default SelectXRayImage;