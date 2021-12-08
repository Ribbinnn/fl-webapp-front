import React from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import {
  ControlOutlined,
  HistoryOutlined,
  PlusSquareOutlined,
  DatabaseOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

export default function NavBar() {
  const history = useHistory();
  const findSelected = () => {
    let path = (window.location.pathname).slice(1).split("/")
    if (path[0]==="") {return(["home"])}
    if (path[0] === "record") {
      if (path[1].includes("upload")) {return ["upload"]}
      if (path[1].includes("myrecord")) {return ["myrecord"]}
    }
    return [path[0]]
  }
  return (
    <div className="navbar" style={{ minWidth: 180, padding: 0, backgroundColor:"white", height:"100%"}}>
      <Menu
        defaultSelectedKeys={findSelected}
        defaultOpenKeys={["record"]}
        mode="inline"
        style={{height:'calc(100vh - 50px)', paddingTop:40}}
      >
        <Menu.Item
          key="home"
          className="menuitem"
          icon={<HomeOutlined />}
          style={{ borderRight: "none" }}
          onClick={() => history.push("/")}
        >
            Home
        </Menu.Item>
        <SubMenu
          key="record"
          className="submenu"
          icon={<DatabaseOutlined />}
          title="Record"
        >
          <Menu.Item key="upload" onClick={() => history.push("/record/upload")}>
            Upload
          </Menu.Item>
          <Menu.Item
            key="myrecord"
            onClick={() => history.push("/record/myrecord")}
          >
            My Record
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          key="diagnosis"
          className="menuitem"
          icon={<PlusSquareOutlined />}
          onClick={() => history.push("/diagnosis")}
        >
          Diagnosis
        </Menu.Item>
        <Menu.Item
          key="viewhistory"
          className="menuitem"
          icon={<HistoryOutlined />}
          onClick={() => history.push("/viewhistory")}
        >
          View History
        </Menu.Item>
        <Menu.Item key="aboutus" className="menuitem" icon={<UserOutlined />}>
          About Us
        </Menu.Item>
        {JSON.parse(sessionStorage.getItem("user")).role === "admin" &&
          <Menu.Item
            key="admin"
            className="menuitem"
            icon={<ControlOutlined />}
            style={{ marginTop: 40 }}
            onClick={() => history.push("/admin")}
          >
            Admin
          </Menu.Item>}
      </Menu>
    </div>
  );
}
