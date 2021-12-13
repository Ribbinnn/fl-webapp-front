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
  const { globalProject, setGlobalProject } = useContext(Contexts.project);
  const [loaded, setLoaded] = useState(false);
  const palette = ["magenta","red","volcano","orange","gold","green","cyan","blue","geekblue","purple"]
  const [pid, setPid] = useState(globalProject.projectId ?? "618e4a72d1207ca05475ac2c"); // <------ set project id to display here
  const [pinfo, setPinfo] = useState();

  useEffect(() => {
    console.log("here")
    setPid(globalProject.projectId)
    getProjectInfoByID(globalProject.projectId).then((response) => {
      console.log(response)
      setPinfo({
          ProjectID: response.data._id,
          ProjectName: response.data.name,
          Description: response.data.description,
          Requirement: response.data.requirements,
          Classes: response.data.predClasses,
          Owner: response.data.users,
          Task: response.data.task
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
      {loaded && pinfo && <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
            <Panel key="1" header="Project information">
            <div className="info" style={{ width: props.width ?? "100%" }}>
        <div>
          Task : <Tag className="brown">{pinfo.Task}</Tag>
        </div>
        <div>
          Classes :{" "}
          {pinfo.Classes.map((item, i) => (
            <Tag key={i} color={palette[(item.charCodeAt(0))%palette.length]}>
              {item}
            </Tag>
          ))}
        </div>
        <div>Description: {pinfo.Description}</div>
        <div>
          Requirement :
          {pinfo.Requirement.map((item, i) => (
            <ol key={i}>{item.name}</ol>
          ))}
        </div>
      </div>
            </Panel>
      </Collapse>}
    </div>)
}
