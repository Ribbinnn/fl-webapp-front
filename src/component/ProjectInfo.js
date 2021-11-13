import React, { useState, useEffect } from "react";
import { Tag, Collapse } from "antd";
import { getProjectInfoByID } from '../api/project'
const { Panel } = Collapse;

export default function ProjectInfo(props) {
  const palette = ["magenta","red","volcano","orange","gold","green","cyan","blue","geekblue","purple"]
  const [pid, setPid] = useState(props.project_id ?? "618e4a72d1207ca05475ac2c"); // <------ set project id to display here
  const [pinfo, setPinfo] = useState();

  useEffect(() => {
    console.log("here")
      getProjectInfoByID(pid).then((response) => {
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
        })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
    <label style={{ display: "block" }}>
        Project: {pinfo && pinfo.ProjectName}
      </label>
    { pinfo&& <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
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
