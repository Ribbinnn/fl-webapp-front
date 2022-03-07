import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Select, Modal } from "antd";
import { selectProject } from "../api/project";
import Contexts from "../utils/Contexts";
const { Option } = Select;

export default function SelectProject(props) {
  const [itemList, setItemList] = useState([]);
  const { globalProject, setGlobalProject } = useContext(Contexts).project;
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const { pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    selectProject()
      .then((response) => {
        // console.log(response);
        let res_list = response.data.projects.map((project) => {
          return {
            ProjectID: project._id,
            ProjectName: project.name,
            // Description: project.description,
            Requirement: project.requirements,
            Head: project.head,
            // Classes: project.predClasses,
            // Owner: project.users,
            // Task: project.task
          };
        });
        setItemList(res_list);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // handle change for select project dropdown in header
  function handleChange(value) {
    if (globalProject.projectId === value) return;
    if(!currentActivity.enablePageChange){
      console.log(currentActivity);
      return Modal.confirm({
        title: "Are you sure you want to change the project?",
        content:
          currentActivity.menu === "viewhistory"
            ? "All changes will not be saved and you will be redirected to View History page"
            : `All changes will not be saved and you will be redirected to the first step of
          ${
            pathname.split("/")[1].charAt(0).toUpperCase() +
            pathname.split("/")[1].slice(1)
          }`,
        okText: "Sure",
        width: 500,
        onOk: () => {
          const project = itemList.filter((item) => item.ProjectID === value);
          console.log(project[0]);
          setGlobalProject({
            projectId: project[0].ProjectID,
            projectName: project[0].ProjectName,
            projectReq: project[0].Requirement,
            projectHead: project[0].Head,
          });
          sessionStorage.setItem(
            "project",
            JSON.stringify({
              projectId: project[0].ProjectID,
              projectName: project[0].ProjectName,
              projectReq: project[0].Requirement,
              projectHead: project[0].Head,
            })
          );
          if (currentActivity.menu === "viewhistory"){
              setCurrentActivity({ menu: "viewhistory", enablePageChange: true });
              history.push("/viewhistory")
              return
          }
          pathname.includes("/batch") && project[0].Requirement.length
            ? history.push("/diagnosis/individual")
            : window.location.reload();
        },
        cancelText: "No",
      });
    }
    const project = itemList.filter((item) => item.ProjectID === value);
    setGlobalProject({
      projectId: project[0].ProjectID,
      projectName: project[0].ProjectName,
      projectReq: project[0].Requirement,
    });
    sessionStorage.setItem(
      "project",
      JSON.stringify({
        projectId: project[0].ProjectID,
        projectName: project[0].ProjectName,
        projectReq: project[0].Requirement,
      })
    );
    if (pathname.includes("/myrecord")){
      window.location.reload();
    }
  }

  return (
    <Select
      onChange={handleChange}
      dropdownStyle={{ borderRadius: 8 }}
      // defaultValue={props.Project.ProjectName?? "No Selected Project"}
      style={{ marginBottom: "20px" }}
      className={props.Class}
      value={globalProject.projectName ?? "No Selected Project"}
    >
      {itemList.map((item, i) => (
        <Option key={i} value={item.ProjectID}>
          {item.ProjectName}
        </Option>
      ))}
    </Select>
  );
}
