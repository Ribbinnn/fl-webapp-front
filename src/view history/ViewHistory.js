import React, { useEffect, useState, useContext } from "react";
import { Table, Tooltip, Form, Input, Button, Select, DatePicker, Tag, Spin, Popconfirm, Popover, Row, Col } from "antd";
import { DownloadOutlined ,EditOutlined, DeleteOutlined, ReloadOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
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
  const { globalProject, setGlobalProject } = useContext(Contexts).project;

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
        "canceled": {shown: "Canceled", color: "default", desc: "Image inference has been canceled because of server errors."},
        "waiting": {shown: "0 Waiting", color: "purple", desc: "Image inference is waiting in queue before being in progress"},
        "in progress": {shown: "1 In Progress", color: "processing", desc: "Image inference is still in progress."},
        "annotated": {shown: "2 AI-Annotated", color: "warning", desc: "Image inference succeeds, the results are saved as report."},
        "reviewed": {shown: "3 Human-Annotated", color: "error", desc: "Report has been edited by radiologists."},
        "finalized": {shown: "4 Finalized", color: "success", desc: "Report has been saved to PACS and cannot be edited."}
    }
    const [findings, setFindings] = useState([]);
    const [reload, setReload] = useState("");
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

    const columns = [
        {
            title: "No.",
            dataIndex: "no",
            key: "no",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.key.localeCompare(b.key)
            },
            showSorterTooltip: false,
            render: (no) => (
                <Tooltip placement="topLeft" title={no}>
                    {no}
                </Tooltip>
            ),
        },
        {
            title: 
                <span>
                    Status
                    <Popover
                        placement="right"
                        content={
                            <span>
                                {Object.keys(shownStatus).splice(Object.keys(shownStatus).indexOf("canceled"), 6).map((key) => (
                                    <Row style={{marginTop: key === "canceled" ? 0 : "10px"}}>
                                        <Col span={10}>
                                            <Tag color={shownStatus[key].color} style={{marginTop: "5px"}}>
                                                {shownStatus[key].shown}
                                            </Tag>
                                        </Col>
                                        <Col span={14}>
                                            <span>{shownStatus[key].desc}</span>
                                        </Col>
                                    </Row>
                                ))}
                            </span>
                        }
                        trigger="hover"
                    >
                        <Button type="link" icon={<InfoCircleOutlined />} style={{color: "white"}} />
                    </Popover>
                </span>,
            dataIndex: "status",
            key: "status",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => shownStatus[a.status].shown.localeCompare(shownStatus[b.status].shown)
            },
            showSorterTooltip: false,
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
            showSorterTooltip: false,
            render: (HN) => (
                <Tooltip placement="topLeft" title={HN}>
                    {HN}
                </Tooltip>
            ),
        },
        {
            title:
                <Tooltip placement="topLeft" title="Patient's Name">
                    Patient's Name
                </Tooltip>,
            dataIndex: "patient_name",
            key: "patient_name",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.patient_name.localeCompare(b.patient_name)
            },
            showSorterTooltip: false,
            render: (name) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            ),
        },
        {
            title:
                <Tooltip placement="topLeft" title="Findings">
                    Findings
                </Tooltip>,
            dataIndex: "finding",
            key: "finding",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.finding.localeCompare(b.finding)
            },
            showSorterTooltip: false,
            render: (finding) => (
                <Tooltip placement="topLeft" title={finding}>
                    {finding}
                </Tooltip>
            ),
        },
        {
            title:
                <Tooltip placement="topLeft" title="Created Date Time">
                    Created Date Time
                </Tooltip>,
            dataIndex: "createdAt",
            key: "createdAt",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            },
            showSorterTooltip: false,
            render: (date) => (
                <Tooltip placement="topLeft" title={date}>
                    {date}
                </Tooltip>
            ),
        },
        {
            title:
                <Tooltip placement="topLeft" title="Last Modified">
                    Last Modified
                </Tooltip>,
            dataIndex: "updatedAt",
            key: "updatedAt",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
            },
            showSorterTooltip: false,
            render: (date) => (
                <Tooltip placement="topLeft" title={date}>
                    {date}
                </Tooltip>
            ),
        },
        {
            title:
                <Tooltip placement="topLeft" title="Clinician">
                    Clinician
                </Tooltip>,
            dataIndex: "clinician_name",
            key: "clinician_name",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.clinician_name.localeCompare(b.clinician_name)
            },
            showSorterTooltip: false,
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
                    report.status === "waiting" || report.status === "in progress" ?
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
            (queryString.get("no") === null
              ? true
              : item.no.toLowerCase().includes(queryString.get("no").toLowerCase())) &&
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
            ((a.status === "waiting" || b.status === "waiting" || a.status === "in progress" || b.status === "in progress")
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
                <Form.Item name="no" label="No." style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <Input
                        className="input-text"
                        defaultValue={queryString.get("no")}
                        onChange={(item) => {
                            item.target.value === "" ? queryString.delete("no") : queryString.set("no", item.target.value);
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
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
                <Row style={{margin: "30px 0 8px 0"}}>
                    <Col span={12}>
                            <label
                                className="clickable-label"
                                style={{color: "#de5c8e", display: "flex", alignItems: "center"}}
                                onClick={() => {
                                    reload === "" ? setReload("reload") : setReload("")
                                    setLoaded(false);
                                }}>
                                    <ReloadOutlined style={{marginRight: "5px"}} />
                                    Reload
                            </label>
                    </Col>
                    <Col span={12}>
                        <div style={{float: "right", marginRight: "5px"}}>
                            <label>
                                {`${uploadedItem.length} report(s)`}
                            </label>
                        </div>
                    </Col>
                </Row>}
            {loaded &&
                <Table 
                    columns={columns} 
                    dataSource={uploadedItem} 
                    size="small"
                    className="view-history-table with-tag"
                    pagination={
                        uploadedItem.length > 20 && {
                          size: "small",
                          hideOnSinglePage: uploadedItem.length <= 20,
                          onChange(page, pageSize) {
                            setPagination({ page: page, pageSize: pageSize });
                          },
                          showQuickJumper: uploadedItem.length / pagination.pageSize > 12,
                          showSizeChanger: uploadedItem.length > 20,
                          pageSizeOptions: ["10", "20", "50", "100"].reduce(
                            (current, item) => {
                              return current.slice(-1) > uploadedItem.length
                                ? current
                                : [...current, item];
                            },
                            []
                          ),
                          position: ["topRight", "bottomRight"],
                        }
                      }
                />}
        </div>
    )
}
