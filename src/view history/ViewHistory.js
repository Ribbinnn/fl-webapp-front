import React, { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import { DownloadOutlined ,EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {viewHistory} from "../api/viewHistory"
import SelectProject from "../component/SelectProject";
import ImageModal from "../component/ImageModal";
import { useHistory } from "react-router-dom";

export default function ViewHistory() {
    const [project, setProject] = useState("619279c10a5029826b6b6fb7");

    return (
        <div className="content">
            {project!=='none' && <HistoryLog project={project} />}
            {project==='none' && <SelectProject
                setProject={setProject}
                Project={project}
                mode = "select"
                width="530px" 
            />}
        </div>
    )
}

function HistoryLog(props) {
    const history = useHistory();
    const [uploadedItem, setUploadedItem] = useState([])

    const columns = [
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            ellipsis: {
                showTitle: true
            },
            sorter: {
                compare: (a, b) => a.status.localeCompare(b.status)
            }
        },
        {
            title: "HN",
            dataIndex: "hn",
            key: "hn",
            align: "center",
            ellipsis: {
                showTitle: true
            },
            sorter: {
                compare: (a, b) => a.hn.localeCompare(b.hn)
            },
        },
        {
            title: "Patient's Name",
            dataIndex: "patient_name",
            key: "patient_name",
            align: "center",
            ellipsis: {
                showTitle: true
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
                showTitle: true
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
                showTitle: true
            },
            sorter: {
                compare: (a, b) => (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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
                showTitle: true
            },
            sorter: {
                compare: (a, b) => (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
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
                showTitle: true
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
                                <DownloadOutlined
                                    className="clickable-icon"
                                    onClick={() => {
                                        /* download image api */
                                    }}
                                />
                                <EditOutlined
                                    className="clickable-icon"
                                    style={{marginLeft: "8px"}}
                                    onClick={() => {
                                        let role = (JSON.parse(sessionStorage.getItem('user'))).role
                                        console.log((JSON.parse(sessionStorage.getItem('user'))).role, report)
                                        /* SHOW REPORT */
                                        history.push(`/viewhistory/${role === "clinician" ? "view" : "edit"}/${report.pred_result_id}`)
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
        viewHistory(props.project).then((response) => {
            console.log(response);
            // add key to each row & change date-time
            for (const i in response.data) {
                response.data[i]["key"] = (parseInt(i)+1).toString();
                response.data[i].createdAt = new Date(response.data[i].createdAt).toLocaleString();
                response.data[i].updatedAt = new Date(response.data[i].updatedAt).toLocaleString();
            }
            setUploadedItem(response.data)
        })
    }, [])

    return (
        <Table 
            columns={columns} 
            dataSource={uploadedItem} 
            pagination={false} 
            size="small"
            className="seven-rows-table"
        />
    )
}