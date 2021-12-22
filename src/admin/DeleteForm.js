import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Spin,
  Col,
  Row,
  message,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getAllProjects, deleteProjectById } from "../api/project";
import { getAllUsers, deleteUserById } from "../api/admin";

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);
const { Option } = Select;

export default function DeleteForm(props) {
  const [keyword, setKeyword] = useState();
  const [options, setOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cfmMessage, setCfmMessage] = useState("");

  useEffect(() => {
    initializePage();
  }, [props.mode]);

  function initializePage() {
    setKeyword();
    setLoaded(false);
    if (props.mode === "user") {
      getAllUsers()
        .then((res) => {
          setOptions(res);
          setLoaded(true);
        })
        .catch((err) => console.log(err.response));
    } else {
      //get all project
      getAllProjects()
        .then((res) => {
          console.log(res)
          setOptions(res);
          setLoaded(true);
        })
        .catch((err) => console.log(err.response));
    }
  }

  const deleteAPI = () => {
    if (cfmMessage === keyword.children) {
      if (props.mode === "user") {
        deleteUserById(keyword.value)
          .then((res) => {
            res.success
              ? message.success(res.message, 5)
              : message.error(res.message, 5);
          })
          .catch((err) => message.error(err.response));
      }
      if (props.mode === "project") {
        deleteProjectById(keyword.value)
          .then((res) => {
            res.success
              ? message.success(res.message, 5)
              : message.error(res.message, 5);
          })
          .catch((err) => message.error(err.response));
      }
      initializePage();
    } else Modal.warning({ content: "Confirm message does not match." });
  };

  const handleOnChangeCfmMessage = (e) => {
    setCfmMessage(e.target.value);
  };

  return (
    <Col>
      <Row>
        <label style={{ fontWeight: "bold" }}>
          {`Delete ${props.mode === "user" ? "User" : "Project"}`}
        </label>
      </Row>
      {!loaded && (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <Spin indicator={LoadingIcon} />
          <br />
          <br />
          <span style={{ fontSize: "medium", color: "#de5c8e" }}>
            Loading ...
          </span>
        </div>
      )}
      <Row style={{ marginTop: "30px" }}>
        {loaded && (
          <div>
            <div>
              <label>
                {props.mode === "user" ? "Username" : "Project Name"}
              </label>
            </div>
            <Select
              className="search-component wider"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(i, j) => {
                console.log(j);
                setKeyword(j);
                console.log("selected ---> ", i);
              }}
              style={{ width: "243px" }}
            >
              {options.map((item, i) => (
                <Option key={i} value={item._id}>
                  {props.mode === "user" ? item.username : item.name}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </Row>
      {keyword && (
        <Form layout="vertical" style={{ marginTop: "30px" }}>
          <Form.Item onChange={handleOnChangeCfmMessage}>
            <p
              style={{
                fontSize: "large",
                marginBottom: "8px",
                color: "#58595b",
              }}
            >
              confirmation (type <i>{keyword.children}</i> to confirm)
            </p>
            <div>
              <Input
                className="input-text"
                style={{ width: "550px", marginBottom: 0 }}
              />
              <Button
                className="primary-btn smaller"
                style={{ marginLeft: 8 }}
                onClick={deleteAPI}
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Col>
  );
}
