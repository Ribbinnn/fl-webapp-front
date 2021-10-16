import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Select, DatePicker } from "antd";
import styles from "./myrecord.css"
import {selectProject} from '../api/project'
import { searchVitlasProject } from "../api/vitals";

const { Option } = Select;

function MyRecord () {
    const [project, setProject] = useState({ProjectName:"All"});
    const [itemList, setItemList] = useState([]);
    const [name, setName] = useState("");
    const [firstDate, setFirstDate] = useState("none");
    const [lastDate, setLastDate] = useState("none");
    const [uploadedItem, setUploadedItem] = useState([]);
    const [vitalsList, setVitalsList] = useState([])

    const columns = [ // get from project > map
        {
            title: "Uploaded Time",
            dataIndex: "updated",
            key: "updated",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        },
        {
            title: "Record Name",
            dataIndex: "rec_name",
            key: "rec_name",
            align: "center",
            ellipsis: {
                showTitle: true
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
                rec_name: project.filename,
                proj_name: project.name
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
        setLastDate(date? date.startOf('day').toDate(): "none") // Moment Object
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
            <div>
                <Form layout="inline">
                    <Form.Item label="Record Name" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                        <Input className="input-text" onChange={onChangeName} style={{width:"200px"}} />
                    </Form.Item>
                    <Form.Item label="Project" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>                
                        <Select defaultValue="All" onChange={handleChangeProject}>
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

                              /* SHOW ALL RECORD INTERFACE */

                              console.log(record)
                            }, // click row
                        };
                      }}
                    style={{width:"60%"}}
                    className="clickable-table"
                />
            </div>
        </div>
    )
}

export default MyRecord