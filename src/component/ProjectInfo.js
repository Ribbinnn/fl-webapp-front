import React, { useState, useEffect, useContext } from "react";
import { Tag, Collapse, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getProjectInfoByID } from '../api/project'
import Contexts from '../utils/Contexts';

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);
const { Panel } = Collapse;

export default function ProjectInfo(props) {
  const { globalProject } = useContext(Contexts).project;
  const [loaded, setLoaded] = useState();
  const palette = ["magenta","red","volcano","orange","gold","green","cyan","blue","geekblue","purple"]
  const [pinfo, setPinfo] = useState();

  useEffect(() => {
    // console.log("here")
    setLoaded(false);
    getProjectInfoByID(globalProject.projectId).then((response) => {
      // console.log(response)
      setPinfo({
          ProjectID: response.data._id,
          ProjectName: response.data.name,
          Description: response.data.description,
          Requirement: response.data.requirements,
          Classes: response.data.predClasses,
          Owner: response.data.users,
          Task: response.data.task,
          Head: response.data.head
        })
      setLoaded(true);
      })
      
    .catch((err) => {
      console.error(err);
    });
  }, props.notChange? []: [globalProject]);

  return (
    <div>
      <label style={{ display: "block" }}>
        Project: {pinfo && pinfo.ProjectName}
      </label>
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
      {loaded && pinfo && <Collapse defaultActiveKey={props.collapse ? ["1"] : null} expandIconPosition="right" ghost>
            <Panel key="1" header="Project information">
            <div className="info" style={{ width: props.width ?? "100%" }}>
        <div style={{ width: props.width ?? "100%", wordWrap:"break-word" }}>
          Task : <Tag color="#e9c869">{pinfo.Task}</Tag>
        </div>
        <div style={{ width: props.width ?? "100%", wordWrap:"break-word" }}>
          Head : 
          {pinfo.Head.map((item, i) => (
            <ol key={i}>{`${item.first_name} ${item.last_name}`}</ol>
          ))}
        </div>
        <div style={{ width: props.width ?? "100%", wordWrap:"break-word" }}>
          Classes :{" "}
          {pinfo.Classes.map((item, i) => (
            <Tag key={i} color={palette[(item.charCodeAt(0))%palette.length]}>
              {item}
            </Tag>
          ))}
        </div>
        <div style={{ width: props.width ?? "100%", wordWrap:"break-word" }}>Description: {pinfo.Description}</div>
        <div style={{ width: props.width ?? "100%", wordWrap:"break-word" }}>
          Requirement : {!pinfo.Requirement.length && "-"}
          {pinfo.Requirement.map((item, i) => (
            <ol key={i}>{item.name}</ol>
          ))}
        </div>
      </div>
            </Panel>
      </Collapse>}
    </div>)
}