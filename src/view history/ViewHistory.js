import React, { useEffect, useState, useContext } from "react";
import { Table, Tooltip, Form, Input, Button, Select, DatePicker, Tag, Spin, Popconfirm } from "antd";
import { DownloadOutlined ,EditOutlined, DeleteOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import {viewHistory, deleteReport} from "../api/viewHistory"
import ImageModal from "../component/ImageModal";
import { useHistory, useLocation } from "react-router-dom";
import * as moment from "moment";
import Contexts from "../utils/Contexts";

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

const { Option } = Select;

export default function ViewHistory() {
  const { globalProject, setGlobalProject } = useContext(Contexts.project);

  return (
    <div className="content">
      {globalProject !== "none" && <HistoryLog project={globalProject} />}
    </div>
  );
}

function HistoryLog(props) {
  function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
  }

    const [loaded, setLoaded] = useState(false);

    function useQuery() {
        const { search } = useLocation();
        return new URLSearchParams(search);
    }

    const history = useHistory();
    const queryString = useQuery();
    const [uploadedItem, setUploadedItem] = useState([])
    const [status, setStatus] = useState([]);
    const shownStatus = {
        "all": {shown: "All", color: ""},
        "canceled": {shown: "Canceled", color: "default"},
        "in progress": {shown: "1 In Progress", color: "processing"},
        "annotated": {shown: "2 AI-Annotated", color: "warning"},
        "reviewed": {shown: "3 Human-Annotated", color: "error"},
        "finalized": {shown: "4 Finalized", color: "success"}
    }
    const [findings, setFindings] = useState([]);
    const [reload, setReload] = useState("");

    const columns = [
        {
            title: "No.",
            dataIndex: "key",
            key: "key",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.key.localeCompare(b.key)
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => shownStatus[a.status].shown.localeCompare(shownStatus[b.status].shown)
            },
            render: (status) => {
                return(
                    <Tag color={shownStatus[status].color}  style={{width: "100%"}}>
                        {shownStatus[status].shown}
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
            render: (HN) => (
                <Tooltip placement="topLeft" title={HN}>
                    {HN}
                </Tooltip>
            ),
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
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
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
            render: (finding) => (
                <Tooltip placement="topLeft" title={finding}>
                    {finding}
                </Tooltip>
            ),
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
            render: (clinician) => (
                <Tooltip placement="topLeft" title={clinician}>
                    {clinician}
                </Tooltip>
            ),
        },
        {
            title: "Action",
            key: "action",
            dataIndex: "action",
            render: (_, report) => {
                return(
                    report.status === "in progress" ?
                    // <EditOutlined className="clickable-icon" /> :
                    null :
                    <div className="center-div">
                        <ImageModal
                            AccessionNo={report.accession_no}
                            // ProcDescription=""
                            ReportID={report.pred_result_id}
                            StudyDateTime=" " />
                        {/* <DownloadOutlined
                            className="clickable-icon"
                            onClick={() => {
                                // download image api
                            }}
                        /> */}
                        {report.status === "canceled" ?
                            null : 
                            <EditOutlined
                                className="clickable-icon"
                                // style={{marginLeft: "8px"}}
                                onClick={() => {
                                    let role = JSON.parse(sessionStorage.getItem("user")).role;
                                    // console.log(
                                    // JSON.parse(sessionStorage.getItem("user")).role,
                                    // report
                                    // );
                                    /* SHOW REPORT */
                                    history.push(
                                    `/viewhistory/${role === "clinician" ? "view" : "edit"}/${
                                        report.pred_result_id
                                    }/?${queryString}`
                                    );
                                }}
                            />}
                        <Popconfirm
                            title="Delete this report?"
                            onConfirm={() => {
                                setLoaded(false);
                                deleteReport(report.pred_result_id).then((res) => {
                                    window.location.reload();
                                }).catch((err) => {
                                    console.log(err);
                                })
                            }}
                            okButtonProps={{ className: "primary-btn popconfirm" }}
                            cancelButtonProps={{ style: { display: "none" } }}
                        >
                            <DeleteOutlined
                                className="clickable-icon"
                                style={{ marginLeft: report.status === "canceled" ? 0 : "8px" }}
                            />
                        </Popconfirm>
                    </div>
                );
      },
      align: "center",
    },
  ];

  useEffect(() => {
    viewHistory(props.project.projectId)
      .then((response) => {
        // console.log(response);
        // add status, findings list
        const status = ["all"];
        const findings = ["all"];
        for (const i in response.data) {
            if (!status.includes(response.data[i]["status"])) {
                status.push(response.data[i]["status"]);
            }
            if (!findings.includes(response.data[i]["finding"])) {
                findings.push(response.data[i]["finding"]);
            }
        }
        // filter data by search query params
        let filter_data = response.data.filter(
          (item, i) =>
            (queryString.get("patient_HN") === null
              ? true
              : item.hn.includes(queryString.get("patient_HN"))) &&
            (queryString.get("status") === null
              ? true
              : item.status === queryString.get("status")) &&
            (queryString.get("findings") === null
              ? true
              : item.finding === queryString.get("findings")) &&
            (queryString.get("clinician") === null
              ? true
              : item.clinician_name.toLowerCase().includes(queryString.get("clinician").toLowerCase())) &&
            (queryString.get("from") === null
              ? true
              : new Date(item.createdAt) >=
                new Date(queryString.get("from"))) &&
            (queryString.get("to") === null
              ? true
              : new Date(item.createdAt) <= new Date(queryString.get("to")))
        );
        // default sort
        filter_data.sort((a, b) =>
            ((a.status === "in progress" || b.status === "in progress")
            && shownStatus[a.status].shown.localeCompare(shownStatus[b.status].shown))
            || new Date(b.updatedAt) - new Date(a.updatedAt));
        // add key to each row & change date-time
        for (const i in filter_data) {
          filter_data[i]["key"] = (parseInt(i) + 1).toString();
          filter_data[i].createdAt = new Date(
            filter_data[i].createdAt
          ).toLocaleString();
          filter_data[i].updatedAt = new Date(
            filter_data[i].updatedAt
          ).toLocaleString();
        }
            setUploadedItem(filter_data);
            setStatus(status);
            setFindings(findings);
            setLoaded(true);
        }).catch((err) => console.log(err.response));
    }, [reload, props])

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
                            value === "all" ? queryString.delete("status") : queryString.set("status", value);
                        }}>
                            {status.map((status, i) => (
                                <Option key={i} value={status}>
                                    {shownStatus[status].shown}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
                <Form.Item name="findings" label="Findings" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>                
                    <Select
                        className="search-component"
                        defaultValue={queryString.get("findings") === null ? "All" : queryString.get("findings")}
                        onChange={(value) => {
                            value === "all" ? queryString.delete("findings") : queryString.set("findings", value);
                        }}>
                            {findings.map((finding, i) => (
                                <Option key={i} value={finding}>
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
                            setLoaded(false);
                        }}>
                            Search
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
            {loaded &&
                <label
                className="clickable-label"
                style={{color: "#de5c8e", display: "flex", alignItems: "center", margin: "30px 0 8px 0"}}
                onClick={() => {
                    reload === "" ? setReload("reload") : setReload("")
                    setLoaded(false);
                }}>
                    <ReloadOutlined style={{marginRight: "5px"}} />
                    Reload
            </label>}
            {loaded &&
                <Table 
                    columns={columns} 
                    dataSource={uploadedItem} 
                    size="small"
                    className="view-history-table with-tag"
                />}
        </div>
    )
}
