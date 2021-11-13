import React, { useState, useEffect } from "react";
import { Card } from 'antd';
import { selectProject } from './api/project';

function Home() {
    const [projectList, setProjectList] = useState();
    const [project, setProject] = useState()

    useEffect(() => {
        selectProject().then((response) => {
            console.log(response)
            setProject(response)
        })
        .catch((e) => {
            console.log(e)
        })
    }, [])

    return(
        <div className="content">
            <Card style={{ width: 300 }} hoverable={true} tabindex="1" onClick={()=>console.log('a')}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
            <Card style={{ width: 300 }} hoverable={true} tabindex="2" onClick={()=>console.log('a')}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        </div>
    );
}

export default Home;