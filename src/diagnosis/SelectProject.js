import React, { useEffect, useState } from "react";
import { Select, Collapse, Tag } from "antd";
import {selectProject} from '../api/project'
const { Panel } = Collapse;
const { Option } = Select;

// "data": [
//   {
//       "_id": "616589104c2b3de77a2f911f",
//       "__v": 0,
//       "createdAt": "2021-10-12T13:09:36.715Z",
//       "description": "sth",
//       "name": "COVID-19",
//       "predClasses": [
//           "[\"COVID-19\",\"normal\"]"
//       ],
//       "requirements": "[{\"name\":\"gender\",\"type\":\"string\"},{\"name\":\"age\",\"type\":\"int\"},{\"name\":\"pules\",\"type\":\"int\"}]",
//       "task": "2D-classification",
//       "updatedAt": "2021-10-12T13:09:36.715Z",
//       "users": [
//           "[{\"$oid\":\"61658748b55132dad0db4300\"}]"
//       ]
//   },
//   {
//       "_id": "6165da3a0eb37a145f11203f",
//       "__v": 0,
//       "createdAt": "2021-10-12T18:55:54.642Z",
//       "description": "classification for pneumonia",
//       "name": "Pneumonia",
//       "predClasses": [
//           "[\"COVID-19\",\"normal\",\"Pneumonia\"]"
//       ],
//       "requirements": "[{\"name\":\"weight\",\"type\":\"float\"},{\"name\":\"age\",\"type\":\"int\"},{\"name\":\"pules\",\"type\":\"int\"},{\"name\":\"fever\",\"type\":\"string\"}]",
//       "task": "2D-classification",
//       "updatedAt": "2021-10-12T18:55:54.642Z",
//       "users": [
//           "[{\"$oid\":\"6165d93c0eb37a145f11203b\"},{\"$oid\":\"6165d7e40eb37a145f112029\"}]"
//       ]
//   },
//   {
//       "_id": "6165db7f0eb37a145f11204d",
//       "__v": 0,
//       "createdAt": "2021-10-12T19:01:19.925Z",
//       "description": "classification for pneumonia",
//       "name": "Pneumonia (2)",
//       "predClasses": [
//           "[\"COVID-19\",\"normal\",\"Pneumonia\"]"
//       ],
//       "requirements": "[{\"name\":\"weight\",\"type\":\"float\"}]",
//       "task": "2D-classification",
//       "updatedAt": "2021-10-12T19:01:19.925Z",
//       "users": [
//           "[{\"$oid\":\"61658748b55132dad0db4300\"},{\"$oid\":\"6165d93c0eb37a145f11203b\"}]"
//       ]
//   }
// ]

export default function SelectProject(props) {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
      selectProject().then((response) => {
        console.log(response);
        let res_list = (response.data.projects).map((project)=>{
          return({
            ProjectID: project._id,
            ProjectName: project.name,
            Description: project.description,
            // Requirement: JSON.parse(project.requirements),
            // Classes: JSON.parse(project.predClasses),
            Requirement: project.requirements,
            Classes: project.predClasses,
            Owner: project.users,
            Task: project.task
          })
        })
        setItemList(res_list);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const setDefaultValue = () => {
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i].ProjectName === props.Project.ProjectName) return i;
    }
    return "";
  };

  function handleChange(value) {
    props.setProject(itemList[value]);
    console.log(`select value = ${value}`);
  }
  return (
    <div style={{ minWidth: props.minWidth ?? 450 }}>
      <p className="project-lable" style={{ marginBottom: "8px" }}>
        {" "}
        Project{" "}
      </p>
      <Select
        onChange={handleChange}
        dropdownStyle={{ borderRadius: 8 }}
        defaultValue={setDefaultValue}
      >
        {itemList.map((item, i) => (
          <Option key={i} value={i}>
            {item.ProjectName}
          </Option>
        ))}
      </Select>
      {props.Project !== "none" && (
        <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
          <Panel key="1" header="Project information">
            <div className="project-info">
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
          </Panel>
        </Collapse>
      )}
    </div>
  );
}
