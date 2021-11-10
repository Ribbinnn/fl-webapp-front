import React, { useEffect, useState } from "react";
import { Table } from "antd";
import {viewHistory} from "../api/viewHistory"
import SelectProject from "../component/SelectProject";
import { useHistory } from "react-router-dom";

export default function ViewHistory() {
    const [project, setProject] = useState('none');

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
    ];

    useEffect(() => {
        viewHistory(props.project.ProjectID).then((response) => {
            setUploadedItem(response.data)
        })
    }, [])

    return (
        <Table 
            columns={columns} 
            dataSource={uploadedItem} 
            pagination={false} 
            size="small"
            onRow={(report, rowIndex) => {
                return {
                onClick: event => {
                    let role = (JSON.parse(sessionStorage.getItem('user'))).role
                    console.log((JSON.parse(sessionStorage.getItem('user'))).role, report)
                    /* SHOW REPORT */
                    history.push(`/viewhistory/${role === "clinician" ? "view" : "edit"}/${report.pred_result_id}`)
                    }, // click row
                };
            }}
            style={{width:"1200px"}}
            className="clickable-table seven-rows-table"
        />
    )
}