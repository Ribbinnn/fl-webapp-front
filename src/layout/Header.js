import React, {useState, useEffect, useContext} from 'react';
import { Button } from "antd";
import "antd/dist/antd.css";
import {
    LogoutOutlined
  } from "@ant-design/icons";
import { logout } from '../api/logout';
import Contexts from '../utils/Contexts';

export default function Header(){
    const { globalProject, setGlobalProject } = useContext(Contexts.project);

    const username = JSON.parse(sessionStorage.getItem("user")).username
    const [projectName, setProjectName] = useState(sessionStorage.getItem('project_name'))

    useEffect(()=>{
        console.log(projectName)
        setProjectName(sessionStorage.getItem('project_name'))
    }, [projectName])

    return(
            <div id="header">
                <div style={{color: '#ffffff', textAlign:'center', marginLeft: 10, fontSize: 'large', width: "180px", textAlign:'left'}}>
                    {globalProject.projectName}
                </div>
                <div id="logo" style={{height: 25, width:200, backgroundColor:'#E5E5E5', textAlign:'center'}}>
                    Temp Logo Image
                </div>

                <div id="right-pane">
                    Hi, {username}.
                    <Button 
                    type = "link" 
                    style={{color:'#E9C869', fontWeight:'bold', fontSize: "large", position: "relative", top:"-3px"}} 
                    onClick={() => {
                        /* logut api */
                        logout().then((respond) => {
                            window.location.reload();
                        }).catch((e) => {
                            console.log(e);
                            window.location.reload();
                        })
                    }}>
                        Log out <LogoutOutlined style={{strokeWidth: 50, stroke:'#E9C869', position: "relative", top: "-3px"}}/>
                    </Button>
                </div>
            </div>
    );
}

