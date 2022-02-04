import React, { useState, useContext, useEffect } from "react";
import "antd/dist/antd.css";
import { Menu, Modal } from "antd";
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
      default:
        return path[0];
    }
  }

  function selectMenu(path) {
    setTab(globalProject.projectId || path === "/annotate" || path === "/admin" ? getTabKey(path) : "home");
    history.push(path);
  }

  function selectMenu(path) {
    if(!globalProject.projectId && path !== "/admin")
    return Modal.warning({
      title: "Please Select Project First.",
      content:
        "You need to select your working project before performing that action.",
      okText: "Ok",
    });
    setTab(
      globalProject.projectId || path === "/admin" ? getTabKey(path) : "home"
    );
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
