import React from "react";
import { Tag } from "antd";

export default function ProjectInfo(props){
    return(
      <div className="info">
                <div>
                  Task : <Tag className="brown">{props.Project.Task}</Tag>
                </div>
                <div>
                  Classes :{" "}
                  {props.Project.Classes.map((item, i) => (
                    <Tag key={i} className="pink">
                      {item}
                    </Tag>
                  ))}
                </div>
                <div>Description: {props.Project.Description}</div>
                <div>
                  Requirement :
                  {props.Project.Requirement.map((item, i) => (
                    <ol key={i}>{item.name}</ol>
                  ))}
                </div>
              </div>
    )
  }