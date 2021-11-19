import React, { useState, useEffect, useContext } from "react";
import { Card, Tag, Row, Col } from 'antd';
import { selectProject } from './api/project';
import ProjectInfo from './component/ProjectInfo'
import Contexts from './utils/Contexts'

function Home() {
    const { globalProject, setGlobalProject } = useContext(Contexts.project);
    
    const [projectList, setProjectList] = useState([]);
    const [projectId, setProjectId] = useState()

    useEffect(() => {
        selectProject().then((response) => {
            console.log(response.data.projects)
            setProjectList(response.data.projects)
        })
            .catch((e) => {
                console.log(e)
            })
    }, [])

    return (
        <div className="content">
            {projectList &&
                <Row>
                    <Col span={12}>
                        {projectList.map((item, i) => (
                            <Card
                                style={{ width: 400, marginBottom: '22px' }}
                                hoverable={true}
                                tabIndex={i}
                                onClick={() => {
                                    setProjectId(item._id)
                                    setGlobalProject({"projectId": item._id, "projectName": item.name, "projectReq": item.requirements})
                                    sessionStorage.setItem("project", JSON.stringify({"projectId": item._id, "projectName": item.name, "projectReq": item.requirements}));
                                }}
                            >
                                <label style={{ display: "block", fontWeight: "bold" }}>
                                    {item.name}
                                </label>
                                <Tag className="brown">{item.task}</Tag>
                                <div>{item.description}</div>
                            </Card>
                        ))}
                    </Col>
                    {!projectId &&
                        <Col span={12} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <label style={{fontWeight: "bold"}}>
                                Please Select Project
                            </label>
                        </Col>
                    }
                    {projectId &&
                        <Col span={12}>
                            <ProjectInfo project_id={projectId}/>
                        </Col>
                    }
                </Row>
            }
        </div>
    );
}

export default Home;