import React from 'react';
import { Button } from "antd";
import "antd/dist/antd.css";
import {
    LogoutOutlined
  } from "@ant-design/icons";

export default function Header(){
    const logout = () => {
            /* logut api */
    }
    return(
            <div id="header">
                <div id="logo" style={{height: 25, width:200, backgroundColor:'#E5E5E5', textAlign:'center', marginLeft: 10}}>
                    Temp Logo Image
                </div>

                <div id="right-pane">
                    Hi, username.
                    <Button 
                    type = "link" 
                    style={{color:'#E9C869', fontWeight:'bold'}} 
                    onClick={logout}>
                        Log out <LogoutOutlined style={{strokeWidth: 50, stroke:'#E9C869'}}/>
                    </Button>
                </div>
            </div>
    );
}

