import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Select, DatePicker } from "antd";
import {selectProject} from '../api/project'
import { searchVitlasProject } from "../api/vitals";
import ShowAllRecords from "./ShowAllRecords";

const { Option } = Select;

function MyRecord () {
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const [project, setProject] = useState({ProjectName:"All"});
    const [itemList, setItemList] = useState([]);
    const [name, setName] = useState("");
    const [firstDate, setFirstDate] = useState("none");
    const [lastDate, setLastDate] = useState("none");
    const [uploadedItem, setUploadedItem] = useState([]);
    const [vitalsList, setVitalsList] = useState([])
    const [currentRecord, setCurrentRecord] = useState(null);

    const columns = [
        {
            title: "Uploaded Time",
            dataIndex: "updated",
            key: "updated",
            align: "center",
            ellipsis: {
                showTitle: true
            },
            sorter: {
                compare: (a, b) => new Date(a.updated) - new Date(b.updated)
            }
        },
        {
            title: "Record Name",
            dataIndex: "rec_name",
            key: "rec_name",
            align: "center",
            ellipsis: {
                showTitle: true
            },
            sorter: {
                compare: (a, b) => a.proj_name.localeCompare(b.proj_name)
            },
        },
        {
            title: "Project Name",
            dataIndex: "proj_name",
            key: "proj_name",
            align: "center",
            ellipsis: {
                showTitle: true
            },
            sorter: {
                compare: (a, b) => a.proj_name.localeCompare(b.proj_name)
            },
        }
    ];

    useEffect(() => {
        selectProject().then((response) => {
          let res_list = (response.data.projects).map((project)=>{
            return({
              ProjectID: project._id,
              ProjectName: project.name,
            })
          })
          res_list = [{ProjectName:"All"}, ...res_list]
          setItemList(res_list);
        })
        .catch((err) => {
          console.error(err);
        });

        searchVitlasProject().then((response) => {
            let res_list = (response.data).map((project)=>({
                vitals_proj_id: project._id,
                updated: (new Date(project.updatedAt)).toLocaleString(),
                rec_name: project.record_name,
                proj_name: project.name,
                key: project._id
            }))
            
            setUploadedItem(res_list)
            setVitalsList(res_list)
        })
        .catch((err)=>{
            console.log(err)
        })
    }, []);

    function handleChangeProject(value) {
        setProject(itemList[value])
    }

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
            (project.ProjectName==="All"? true: item.proj_name === project.ProjectName) &&
            (name===""? true: item.rec_name === name) &&
            (firstDate==="none"? true: new Date(item.updated) >= firstDate) &&
            (lastDate==="none"? true: new Date(item.updated) <= lastDate)
        ))
        setUploadedItem(filterList)
    }

    return (
        <div className="content">
            {current === 0 &&
                <div>
                    <div>
                        <Form layout="inline">
                            <Form.Item label="Record Name" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                                <Input className="input-text" onChange={onChangeName} style={{width:"200px"}} />
                            </Form.Item>
                            <Form.Item label="Project" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>                
                                <Select className="search-component" defaultValue="All" onChange={handleChangeProject}>
                                    {itemList.map((item, i) => (
                                    <Option key={i} value={i}>
                                        {item.ProjectName}
                                    </Option>
                                    ))}
                                </Select>
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
                            pagination={false} 
                            size="small"
                            onRow={(record, rowIndex) => {
                                return {
                                onClick: event => {
                                    setCurrentRecord(record);
                                    next();
                                    }, // click row
                                };
                            }}
                            style={{width:"700px"}}
                            className="clickable-table seven-rows-table"
                        />
                    </div>
                </div>}
            {current === 1 &&
                <div style={{height: "100%"}}>
                    <ShowAllRecords record={currentRecord} />
                    <Button
                        className="primary-btn"
                        onClick={() => {
                            setCurrentRecord(null);
                            prev();
                        }}>
                            Back
                    </Button>
                </div>}
        </div>
    )
}

export default MyRecord