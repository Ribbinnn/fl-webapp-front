import React from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import {
  ControlOutlined,
  HistoryOutlined,
  PlusSquareOutlined,
  DatabaseOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./NavBar.css"
const { SubMenu } = Menu;

export default class NavBar extends React.Component {

  render() {
    return (
      <div style={{ width: 180 }}>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          style={{height:'100vh'}}
        >
          <Menu.Item key="home" className="menuitem" icon={<HomeOutlined />} style={{borderRight:'none'}}>
            Home
          </Menu.Item>
           <SubMenu key="record" className="submenu" icon={<DatabaseOutlined />} title="Record">
             <Menu.Item key="upload">Upload</Menu.Item>
             <Menu.Item key="myrecord">My Record</Menu.Item>
           </SubMenu>
           <Menu.Item key="diagnosis" className="menuitem" icon={<PlusSquareOutlined />}>
             Diagnosis
           </Menu.Item>
         <Menu.Item key="viewhistory" className="menuitem" icon={<HistoryOutlined />}>
            View History
           </Menu.Item>
           <Menu.Item key="aboutus" className="menuitem" icon={<UserOutlined />}>
            About Us
          </Menu.Item>
           <Menu.Item key="admin" className="menuitem" icon={<ControlOutlined />} style={{ marginTop: 20}}>
             Admin
           </Menu.Item>
        </Menu>
      </div>
    );
  }
}
