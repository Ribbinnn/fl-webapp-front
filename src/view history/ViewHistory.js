import React, { useEffect, useState, useContext } from "react";
import { Table, Tooltip, Form, Input, Button, Select, DatePicker, Tag } from "antd";
import { DownloadOutlined ,EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import {viewHistory} from "../api/viewHistory"
import SelectProject from "../component/SelectProject";
import ImageModal from "../component/ImageModal";
import { useHistory, useLocation } from "react-router-dom";
import * as moment from 'moment';
import Contexts from '../utils/Contexts';

const { Option } = Select;

export default function ViewHistory() {
    const { globalProject, setGlobalProject } = useContext(Contexts.project);

    return (
        <div className="content">
            {globalProject!=='none' && <HistoryLog project={globalProject} />}
            {/* {globalProject==='none' && <SelectProject
                // setProject={setProject}
                Project={project}
                mode = "select"
                width="530px" 
            />} */}
        </div>
    )
}

function HistoryLog(props) {

    function useQuery() {
        const { search } = useLocation();
        return new URLSearchParams(search);
    }

    const history = useHistory();
    const queryString = useQuery();
    const [uploadedItem, setUploadedItem] = useState([])
    const [status, setStatus] = useState([]);
    const [findings, setFindings] = useState([]);
    const [reload, setReload] = useState("");

    const columns = [
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.status.localeCompare(b.status)
            },
            render: (status) => {
                var color = ""
                if (status === "in_progress") {
                    color = "blue"
                } else if (status === "annotated") {
                    color = "gold"
                    status = "AI-Annotated"
                } else {
                    color = "green"
                }
                return(
                    <Tag color={color}  style={{width: "100%"}}>
                        {status.charAt(0).toUpperCase() + status.slice(1).split("_").join(" ")}
                    </Tag>
                );
            }
        },
        {
            title: "HN",
            dataIndex: "hn",
            key: "hn",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.hn.toString().localeCompare(b.hn.toString())
            },
        },
        {
            title: "Patient's Name",
            dataIndex: "patient_name",
            key: "patient_name",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.patient_name.localeCompare(b.patient_name)
            },
        },
        {
            title: "Findings",
            dataIndex: "finding",
            key: "finding",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.finding.localeCompare(b.finding)
            },
        },
        {
            title: "Created Date Time",
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            },
            render: (date) => (
                <Tooltip placement="topLeft" title={date}>
                    {date}
                </Tooltip>
            ),
        },
        {
            title: "Last Modified",
            dataIndex: "updatedAt",
            key: "updatedAt",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
            },
            render: (date) => (
                <Tooltip placement="topLeft" title={date}>
                    {date}
                </Tooltip>
            ),
        },
        {
            title: "Clinician",
            dataIndex: "clinician_name",
            key: "clinician_name",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.clinician_name.localeCompare(b.clinician_name)
            },
        },
        {
            title: "Action",
            key: "action",
            dataIndex: "action",
            render: (_, report) => {
                return(
                    <div>
                        {uploadedItem.status === "in_progress" ?
                            <EditOutlined className="clickable-icon" /> :
                            <div className="center-div">
                                <ImageModal
                                    AccessionNo={report.accession_no}
                                    ProcDescription=""
                                    StudyDateTime="" />
                                {/* <DownloadOutlined
                                    className="clickable-icon"
                                    onClick={() => {
                                        // download image api
                                    }}
                                /> */}
                                <EditOutlined
                                    className="clickable-icon"
                                    // style={{marginLeft: "8px"}}
                                    onClick={() => {
                                        let role = (JSON.parse(sessionStorage.getItem('user'))).role
                                        console.log((JSON.parse(sessionStorage.getItem('user'))).role, report)
                                        /* SHOW REPORT */
                                        history.push(`/viewhistory/${role === "clinician" ? "view" : "edit"}/${report.pred_result_id}/?${queryString}`)
                                    }}
                                />
                                <DeleteOutlined
                                    className="clickable-icon"
                                    style={{marginLeft: "8px"}}
                                    onClick={() => {
                                        /* delete report api */
                                    }}
                                />
                            </div>}
                    </div>
                );
            },
            align: "center",
        }
    ];

    useEffect(() => {
        viewHistory(props.project.projectId).then((response) => {
            console.log(response);
            // filter data by search query params
            let filter_data = response.data.filter((item, i) => (
                (queryString.get("patient_HN") === null ? true : item.hn === parseInt(queryString.get("patient_HN"))) &&
                (queryString.get("status") === null ? true : item.status === queryString.get("status")) &&
                (queryString.get("findings") === null ? true : item.finding === queryString.get("findings")) &&
                (queryString.get("clinician") === null ? true : item.clinician_name === queryString.get("clinician")) &&
                (queryString.get("from") === null ? true : new Date(item.createdAt) >= new Date(queryString.get("from"))) &&
                (queryString.get("to") === null ? true : new Date(item.createdAt) <= new Date(queryString.get("to")))
            ))
            // add key to each row & change date-time & add status, findings list
            const status = ["all"];
            const findings = ["all"];
            for (const i in filter_data) {
                filter_data[i]["key"] = (parseInt(i)+1).toString();
                filter_data[i].createdAt = new Date(filter_data[i].createdAt).toLocaleString();
                filter_data[i].updatedAt = new Date(filter_data[i].updatedAt).toLocaleString();
                if (!status.includes(filter_data[i]["status"])) {
                    status.push(filter_data[i]["status"]);
                }
                if (!findings.includes(filter_data[i]["finding"])) {
                    findings.push(filter_data[i]["finding"]);
                }
            }
            setUploadedItem(filter_data);
            setStatus(status);
            setFindings(findings);
        }).catch((err) => console.log(err.response));
    }, [reload])

    return (
        <div>
            <Form layout="inline">
                <Form.Item name="patient_HN" label="Patient's HN" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <Input
                        className="input-text"
                        defaultValue={queryString.get("patient_HN")}
                        onChange={(item) => {
                            item.target.value === "" ? queryString.delete("patient_HN") : queryString.set("patient_HN", item.target.value);
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item name="status" label="Status" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>                
                    <Select
                        className="search-component"
                        defaultValue={queryString.get("status") === null ? "All" : queryString.get("status")}
                        onChange={(value) => {
                            status[value] === "all" ? queryString.delete("status") : queryString.set("status", status[value]);
                        }}>
                            {status.map((status, i) => (
                                <Option key={i} value={i}>
                                    {status.charAt(0).toUpperCase() + status.slice(1).split("_").join(" ")}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item name="findings" label="Findings" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>                
                    <Select
                        className="search-component"
                        defaultValue={queryString.get("findings") === null ? "All" : queryString.get("findings")}
                        onChange={(value) => {
                            findings[value] === "all" ? queryString.delete("findings") : queryString.set("findings", findings[value]);
                        }}>
                            {findings.map((finding, i) => (
                                <Option key={i} value={i}>
                                    {finding.charAt(0).toUpperCase() + finding.slice(1).split("_").join(" ")}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item name="clinician" label="Clinician" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <Input
                        className="input-text"
                        defaultValue={queryString.get("clinician")}
                        onChange={(item) => {
                            item.target.value === "" ? queryString.delete("clinician") : queryString.set("clinician", item.target.value);
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
            </Form>
            <Form layout="inline">
                <Form.Item name="from" label="From" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>   
                    <DatePicker
                        defaultValue={queryString.get("from") === null ? null : moment(new Date(queryString.get("from")))}
                        onChange={(date) => {
                            date === null ? queryString.delete("from") : queryString.set("from", date.startOf('day').toDate().toLocaleString());
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item name="to" label="To" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <DatePicker
                        defaultValue={queryString.get("to") === null ? null : moment(new Date(queryString.get("to")))}
                        onChange={(date) => {
                            date === null ? queryString.delete("to") : queryString.set("to", date.startOf('day').toDate().toLocaleString());
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item style={{marginLeft:"20px"}}>
                    <Button
                        className="primary-btn smaller"
                        style={{marginTop:"32px"}}
                        onClick={() => {
                            history.push(`/viewhistory/?${queryString}`);
                            // window.location.reload();
                            reload === "" ? setReload("reload") : setReload("");
                        }}>
                            Search
                    </Button>
                </Form.Item>
            </Form>
            <label
                className="clickable-label"
                style={{color: "#de5c8e", display: "flex", alignItems: "center", margin: "30px 0 8px 0"}}
                onClick={() => reload === "" ? setReload("reload") : setReload("")}>
                    <ReloadOutlined style={{marginRight: "5px"}} />
                    Reload
            </label>
            <Table 
                columns={columns} 
                dataSource={uploadedItem} 
                pagination={false} 
                size="small"
                className="seven-rows-table"
            />
        </div>
    )
}