import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Form, Input, DatePicker, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { searchVitlasProject, deleteRecord } from "../api/vitals";
import ShowAllRecords from "./ShowAllRecords";
import ConfirmDelete from "../component/ConfirmDelete";
import Contexts from '../utils/Contexts';

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function MyRecord () {
    const { globalProject, setGlobalProject } = useContext(Contexts).project;
    const [loaded, setLoaded] = useState(false);

    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
        reload === "" ? setReload("reload") : setReload("");
    };
    const [reload, setReload] = useState("");

    const [name, setName] = useState("");
    const [firstDate, setFirstDate] = useState("none");
    const [lastDate, setLastDate] = useState("none");
    const [uploadedItem, setUploadedItem] = useState([]);
    const [vitalsList, setVitalsList] = useState([])
    const [currentRecord, setCurrentRecord] = useState(null);
    const [recordId, setRecordId] = useState("");

    const columns = [
        {
            title: "Uploaded Time",
            dataIndex: "uploaded",
            key: "uploaded",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => new Date(a.uploaded) - new Date(b.uploaded)
            }
        },
        {
            title: "Updated Time",
            dataIndex: "updated",
            key: "updated",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.updated.localeCompare(b.updated)
            },
        },
        {
            title: "Record Name",
            dataIndex: "rec_name",
            key: "rec_name",
            align: "center",
            ellipsis: {
                showTitle: false
            },
            sorter: {
                compare: (a, b) => a.rec_name.localeCompare(b.rec_name)
            },
        },
    ];

    useEffect(() => {
        searchVitlasProject(globalProject.projectId).then((response) => {
            // console.log(response)
            let res_list = (response.data).map((project)=>({
                vitals_proj_id: project.project_id,
                uploaded: (new Date(project.createdAt)).toLocaleString(),
                rec_name: project.record_name,
                updated: (new Date(project.updatedAt)).toLocaleString(),
                key: response.data.indexOf(project),
            }))
            
            setUploadedItem(res_list)
            setVitalsList(res_list)
            setLoaded(true);
        })
        .catch((err)=>{
            console.log(err)
        })
    }, [reload, globalProject]);

    function onChangeFirstDate(date, dateString) {
        setFirstDate(date? date.startOf('day').toDate(): "none") // Moment Object
        
    }

    function onChangeLastDate(date, dateString) {
        setLastDate(date? date.endOf('day').toDate(): "none") // Moment Object
    }

    function onChangeName(item) {
        setName(item.target.value)
    }

    function onClickSearch() {
        let filterList = vitalsList.filter((item, i) => (
            (name===""? true: item.rec_name.toLowerCase().includes(name.toLowerCase())) &&
            (firstDate==="none"? true: new Date(item.updated) >= firstDate) &&
            (lastDate==="none"? true: new Date(item.updated) <= lastDate)
        ))
        setUploadedItem(filterList)
    }

    return (
        <div className="content">
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
            {loaded && current === 0 &&
                <div>
                    <div>
                        <Form layout="inline">
                            <Form.Item label="Record Name" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                                <Input className="input-text" onChange={onChangeName} style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="From" style={{display:"flex", flexDirection:"column", alignItems:"flex-start", marginLeft:"20px"}}>   
                                <DatePicker onChange={onChangeFirstDate} style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="To" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                                <DatePicker onChange={onChangeLastDate} style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item style={{marginLeft:"20px"}}>
                                <Button className="primary-btn smaller" style={{marginTop:"32px"}} onClick={onClickSearch}>
                                    Search
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{marginTop:"30px"}}>
                        <Table 
                            columns={columns} 
                            dataSource={uploadedItem} 
                            size="small"
                            onRow={(record, rowIndex) => {
                                return {
                                onClick: event => {
                                    setCurrentRecord(record);
                                    next();
                                    }, // click row
                                };
                            }}
                            style={{width:"790px"}}
                            className="clickable-table"
                        />
                    </div>
                </div>}
            {loaded && current === 1 &&
                <div style={{height: "100%"}}>
                    <ShowAllRecords 
                        record={currentRecord} 
                        setRecordId={setRecordId}
                        project={globalProject}
                        next={next}/>
                    <Button
                        className="primary-btn"
                        onClick={() => {
                            setCurrentRecord(null);
                            prev();
                        }}>
                            Back
                    </Button>
                </div>}
            {loaded && current === 2 &&
                <ConfirmDelete 
                    cfmMessage={"delete " + currentRecord.rec_name} 
                    handleCancel={prev}
                    deleteAPI = {() => {
                        deleteRecord(recordId)
                        .then((res) => {
                            // console.log(res);
                            window.location.reload();
                        }).catch((err) => {
                            console.log(err);
                        })
                    }} />}
        </div>
    )
}

export default MyRecord