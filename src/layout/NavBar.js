import React, { useState, useContext, useEffect } from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import {
  ControlOutlined,
  HistoryOutlined,
  PlusSquareOutlined,
  DatabaseOutlined,
  HomeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Contexts from "../utils/Contexts";
const { SubMenu } = Menu;

export default function NavBar() {
  const { globalProject } = useContext(Contexts.project);
  const [tab, setTab] = useState();
  const history = useHistory();

  useEffect(() => {
    setTab(getTabKey());
  }, []);

  function getTabKey(path) {
    path = (path ?? window.location.pathname).slice(1).split("/");
    switch (path[0]) {
      case "":
        return "home";
      case "record":
        return path[1];
      default:
        return path[0];
    }
  }

  function selectMenu(path) {
    setTab(globalProject.projectId ? getTabKey(path) : "home");
    history.push(path);
  }
  return (
    <div
      className="navbar"
      style={{
        minWidth: 180,
        padding: 0,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <Menu
        selectedKeys={[tab]}
        defaultOpenKeys={["record"]}
        mode="inline"
        style={{ height: "calc(100vh - 50px)", paddingTop: 40 }}
      >
        <Menu.Item
          key="home"
          className="menuitem"
          icon={<HomeOutlined />}
          style={{ borderRight: "none" }}
          onClick={() => selectMenu("/")}
        >
          Home
        </Menu.Item>
        <SubMenu
          key="record"
          className="submenu"
          icon={<DatabaseOutlined />}
          title="Record"
        >
          <Menu.Item key="upload" onClick={() => selectMenu("/record/upload")}>
            Upload
          </Menu.Item>
          <Menu.Item
            key="myrecord"
            onClick={() => selectMenu("/record/myrecord")}
          >
            My Record
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          key="diagnosis"
          className="menuitem"
          icon={<PlusSquareOutlined />}
          onClick={() => selectMenu("/diagnosis")}
        >
          Diagnosis
        </Menu.Item>
        <Menu.Item
          key="viewhistory"
          className="menuitem"
          icon={<HistoryOutlined />}
          onClick={() => selectMenu("/viewhistory")}
        >
          View History
        </Menu.Item>
        <Menu.Item
          key="annotate"
          className="menuitem"
          icon={<EditOutlined />}
          onClick={() => selectMenu("/annotate")}
        >
          Annotate
        </Menu.Item>
        {JSON.parse(sessionStorage.getItem("user")).role === "admin" && (
          <Menu.Item
            key="admin"
            className="menuitem"
            icon={<ControlOutlined />}
            style={{ marginTop: 40 }}
            onClick={() => selectMenu("/admin")}
          >
            Admin
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
}
