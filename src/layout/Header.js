import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Image, Row, Col } from "antd";
import "antd/dist/antd.css";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../api/logout";
import Contexts from "../utils/Contexts";
import SelectProject from "../component/SelectProject";

export default function Header() {
  const { globalProject, setGlobalProject } = useContext(Contexts).project;
  const history = useHistory();
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Row span={24} id="header" justify="space-between" style={{ zIndex: 2 }}>
      <Col
        span={8}
        style={{ paddingLeft: "10px", height: "50px" }}
        justify="center"
      >
        <SelectProject Project={globalProject} Class="select-header" />
      </Col>
      <Col span={8} align="middle">
        <Image
          preview={false}
          height={50}
          src="/logos/DeepMed Header Logo.png"
        />
      </Col>
      <Col span={8} id="right-pane" justify="center">
        <p>{`Hi, ${user.first_name}`}</p>
        {globalProject.projectHead && <p style={{ fontSize: "medium", marginLeft: "5px" }}>{`${
          globalProject.projectHead.length === 0 ? "" :
          globalProject.projectHead.includes(user.id)
            ? "(Project Head)"
            : "(Project Member)"
        }`}</p>}
        <Button
          type="link"
          style={{
            color: "#E9C869",
            fontWeight: "bold",
            fontSize: "large",
            position: "relative",
            top: "-3px",
          }}
          onClick={() => {
            /* logut api */
            logout()
              .then((respond) => {
                history.push({ state: null });
                window.location.reload();
              })
              .catch((e) => {
                console.log(e);
                window.location.reload();
              });
          }}
        >
          Log out{" "}
          <LogoutOutlined
            style={{
              strokeWidth: 50,
              stroke: "#E9C869",
              position: "relative",
              top: "-3px",
            }}
          />
        </Button>
      </Col>
    </Row>
  );
}
