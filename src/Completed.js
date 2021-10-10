import React from "react";
import { Button } from "antd";
import "antd/dist/antd.css";
import {
  CheckCircleOutlined
} from "@ant-design/icons";

export default function Completed(props) {
    const btnList = props.btnList;
    const title = props.title
  
    return (
      <div className="btn-column">
        <CheckCircleOutlined style={{ fontSize: '200px', color: "#de5c8e" }}/>
        <span style={{ fontSize: '30px', color: "#de5c8e", marginTop: 20, marginBottom: 10 }}> {title} </span>
        {btnList.map((btn) => (
          <a href={btn.destination} key={btn.title}>
            <Button className="primary-btn" >{btn.title}</Button>
          </a>
        ))}
      </div>
    );
  }