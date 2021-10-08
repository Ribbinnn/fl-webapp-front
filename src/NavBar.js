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
import "./LayOut.css";
const { SubMenu } = Menu;

export default function NavBar() {
  const history = useHistory();
  return (
    <div style={{ width: 180 }}>
      <Menu
        defaultSelectedKeys={["home"]}
        defaultOpenKeys={["record"]}
        mode="inline"
        style={{ height: "100vh" }}
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
        <Menu.Item
          key="admin"
          className="menuitem"
          icon={<ControlOutlined />}
          style={{ marginTop: 20 }}
        >
          Admin
        </Menu.Item>
      </Menu>
    </div>
  );
}
