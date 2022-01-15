import React, { useState, useEffect, useContext } from "react";
import { Card, Tag, Row, Col, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import { selectProject } from './api/project';
import ProjectInfo from './component/ProjectInfo'
import Contexts from './utils/Contexts'

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function Home() {
    const { globalProject, setGlobalProject } = useContext(Contexts.project);
    const [loaded, setLoaded] = useState(false);
    
    const [projectList, setProjectList] = useState([]);
    const [projectId, setProjectId] = useState()

    useEffect(() => {
        selectProject().then((response) => {
            console.log(response.data.projects)
            setProjectList(response.data.projects)
            setLoaded(true);
        })
            .catch((e) => {
                console.log(e)
            })
    }, [])

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
            {loaded && projectList &&
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
                    {!globalProject.projectId &&
                        <Col span={12} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <label style={{fontWeight: "bold"}}>
                                Please Select Project
                            </label>
                        </Col>
                    }
                    {globalProject.projectId &&
                        <Col span={12}>
                            <ProjectInfo project_id={globalProject.projectId} collapse={true} />
                        </Col>
                    }
                </Row>
            }
        </div>
    );
}

export default Home;