import React, {useContext} from 'react';
import { useHistory } from "react-router-dom";
import { Button, Image } from "antd";
import "antd/dist/antd.css";
import {
    LogoutOutlined
  } from "@ant-design/icons";
import { logout } from '../api/logout';
import Contexts from '../utils/Contexts';
import SelectProject from '../component/SelectProject';

export default function Header(){
    const { globalProject, setGlobalProject } = useContext(Contexts.project);
    const history = useHistory();
    const username = JSON.parse(sessionStorage.getItem("user")).username

    return(
            <div id="header">
                <div style={{marginLeft: 10, height: 50}}>
                    <SelectProject Project={globalProject} Class="select-header"/>
                </div>
                <Image
            preview={false}
            height={40}
            src="/logos/DeepMed Header Logo.png"
          />

                <div id="right-pane">
                    Hi, {username}.
                    <Button 
                    type = "link" 
                    style={{color:'#E9C869', fontWeight:'bold', fontSize: "large", position: "relative", top:"-3px"}} 
                    onClick={() => {
                        /* logut api */
                        logout().then((respond) => {
                            history.push({state: null});
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

