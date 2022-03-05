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
} from "@ant-design/icons";
import Contexts from "../utils/Contexts";
const { SubMenu } = Menu;

export default function NavBar() {
  const { globalProject } = useContext(Contexts).project;
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const [tab, setTab] = useState();
  const history = useHistory();

  useEffect(() => {
    let key = getTabKey();
    setTab(key);
    setCurrentActivity({ menu: key, enablePageChange: true });
  }, []);

  function getTabKey(path) {
    path = (path ?? window.location.pathname).slice(1).split("/");
    switch (path[0]) {
      case "":
        return "home";
      case "record":
        return path[1];
      case "diagnosis":
        return path[1];
      default:
        return path[0];
    }
  }

  function selectMenu(path) {
    if (!globalProject.projectId && path !== "/admin")
      return Modal.warning({
        title: "Please Select Project First.",
        content:
          "You need to select your working project before performing that action.",
        okText: "Ok",
      });
    if (!currentActivity.enablePageChange) {
      let contentText = "";
      switch (currentActivity.menu) {
        case "upload":
          contentText = "Your uploaded record hasn't been saved and will be lost.";
          break;
        case "myrecord":
          contentText = "Unsaved changes will be lost.";
          break;
        case "viewhistory":
          contentText = "All changes made will be lost.";
          break;
        default:
          contentText =
            "Your action hasn't completed and it won't be saved.";
      }
      return Modal.confirm({
        title: "Are you sure you want to navigate away from this page?",
        content: contentText + " Press Yes to continue or No to stay on the current page.",
        okText: "Yes",
        onOk: () => {
          setTab(
            globalProject.projectId || path === "/admin"
              ? getTabKey(path)
              : "home"
          );
          setCurrentActivity({ menu: getTabKey(path), enablePageChange: true });
          history.push(path);
        },
        cancelText: "No",
      });
    }
    setTab(
      globalProject.projectId || path === "/admin" ? getTabKey(path) : "home"
    );
    setCurrentActivity({ menu: getTabKey(path), enablePageChange: true });
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
        defaultOpenKeys={["record", "diagnosis"]}
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
        <SubMenu
          key="diagnosis"
          className="submenu"
          icon={<PlusSquareOutlined />}
          title="Diagnosis"
        >
          <Menu.Item
            key="individual"
            onClick={() => selectMenu("/diagnosis/individual")}
          >
            Individual
          </Menu.Item>
          {!globalProject.projectReq.length && (
            <Menu.Item
              key="batch"
              onClick={() => selectMenu("/diagnosis/batch")}
            >
              Batch
            </Menu.Item>
          )}
        </SubMenu>
        <Menu.Item
          key="viewhistory"
          className="menuitem"
          icon={<HistoryOutlined />}
          onClick={() => selectMenu("/viewhistory")}
        >
          View History
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
