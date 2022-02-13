import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Collapse,
  Popover,
  Button,
  Row,
  Col,
  Image,
  Spin,
  Tag,
  Modal,
  Badge
} from "antd";
import Info from "../component/Info";
import {
  InfoCircleOutlined,
  CloudDownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import AnnotationModal from "./annotate/AnnotationModal";
import ProjectInfo from "../component/ProjectInfo";
import ResultsTable from "./ResultsTable";
import { getGradCam } from "../api/image";
import { getReport } from "../api/report";
import { saveAs } from "file-saver";
import Contexts from "../utils/Contexts";
const { Panel } = Collapse;

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

export default function Report(props) {
  const { globalProject } = useContext(Contexts.project);
  const { mode, rid } = useParams();
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [gradCam, setGradCam] = useState();
  useEffect(() => {
    getReport(rid)
      .then((res) => {
        // console.log(res);
        setInfo(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        return Modal.error({ title: "Report not Found", onOk:  () => history.push("/viewhistory")});
      });
  }, []);

  useEffect(() => {
    if (info && info.result.project_id._id !== globalProject.projectId) {
      // console.log(info);
      history.push("/viewhistory");
    }
  }, [globalProject]);

  const downloadImage = () => {
    saveAs(
      getGradCam(rid, gradCam),
      `${info.result.project_id.name}_${gradCam}.png`
    ); // Put your image url here.
  };

  const updateTimestamp = (updatedAt, updated_by) => {
    setInfo({
      ...info,
      result: { ...info.result, status: info.result.status === "annotated" ? "reviewed" : info.result.status, updatedAt: updatedAt, updated_by: updated_by },
    });
  };

  return (
    <div className="content">
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
      {loaded && (
        <ReportHeader
          HN={info.result.hn}
          rno={info.no}
          patient_name={info.result.patient_name}
          patient={info.patient}
          status={info.result.status}
          medrec={info.record}
          project={info.result.project_id}
          created_at={info.result.createdAt}
          created_by={info.result.created_by}
          updated_by={info.result.updated_by}
          updated_at={info.result.updatedAt}
        />
      )}
      {loaded && (
        <Row justify="center" align="top" style={{ marginBottom: "10px" }}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle">
            <label style={{ fontWeight: "bold" }}> Original Image </label>
            <div>
              <Image height={400} src={getGradCam(rid, "original")} />
            </div>
              <AnnotationModal
                accession_no={info.result.image_id.accession_no}
                gradCamList={info.classes.reduce((current, item) => {
                  if (!info.gradCam.includes(item.finding)) return current;
                  return [
                    ...current,
                    {
                      finding: item.finding,
                      isPositive: item.isPositive,
                    },
                  ];
                }, [])}
                labelList={info.classes.map((item) => {
                  return item.finding;
                })}
                displayText="Annotate"
                mode={info.result.status === "finalized" || mode !== "edit" ? "view-only":"editable"}
                updateTimestamp={updateTimestamp}
              />
          </Col>
          {gradCam && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12} align="center">
              <label style={{ fontWeight: "bold" }}> Gradcam Image </label>
              <div
                style={{
                  height: "400px",
                  textAlign: "center",
                }}
              >
                <Image height={400} src={getGradCam(rid, gradCam)} />
              </div>
              <Button
                type="link"
                style={{
                  color: "#de5c8e",
                  fontSize: "medium",
                  visibility: gradCam ? "visible" : "hidden",
                  fontWeight: "bold",
                  stroke: "#de5c8e",
                  strokeWidth: 30,
                }}
                onClick={downloadImage}
                icon={<CloudDownloadOutlined className="clickable-icon" />}
              >
                Download
              </Button>
            </Col>
          )}
        </Row>
      )}
      {loaded && (
        <ResultsTable
          rate={info.result.rating} //
          head={info.result.project_id.head} //
          rid={rid}
          HN={info.result.hn}
          gradCam={gradCam}
          setGradCam={setGradCam}
          classes={info.classes} //
          mode={mode}
          status={info.result.status} //
          gradCamList={info.gradCam} //
          note={info.result.note} //
          updateTimestamp={updateTimestamp}
        />
      )}
    </div>
  );
}

const ReportHeader = (props) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            display: "block",
            color: "#58595B",
            fontWeight: "bold",
            fontSize: "x-large",
          }}
        >
          Report
        </label>
        <Badge count={`No. ${props.rno}`} className="rno-badge"/>
        <Tag
          color={
            props.status === "annotated"
              ? "warning"
              : props.status === "reviewed"
              ? "error"
              : "success"
          }
          style={{ marginLeft: "10px" }}
        >
          {props.status === "annotated"
            ? "2 AI-Annotated"
            : props.status === "reviewed"
            ? "3 Human-Annotated"
            : "4 Finalized"}
        </Tag>
      </div>
      <label
        style={{
          display: "block",
          color: "#A3A3A3",
          marginBottom: "10px",
          fontSize: "medium",
          textAlign: "left",
        }}
      >
        <i>
          {" "}
          Created Date Time: {new Date(props.created_at).toLocaleString()}
          <br />
          Created By:{" "}
          {`${props.created_by.first_name} ${props.created_by.last_name}`}
        </i>
        {props.status !== "annotated" && (
          <i>
            <br />
            Last Updated: {new Date(props.updated_at).toLocaleString()}
            <br />
            Updated By:{" "}
            {`${props.updated_by.first_name} ${props.updated_by.last_name}`}
          </i>
        )}
      </label>
      <label
        style={{
          display: "block",
          color: "#58595b",
          marginBottom: "5px"
        }}
      >
        Project: {props.project.name}{" "}
        <Popover
          className="proj-popover"
          placement="rightTop"
          content={<ProjectInfo notChange={true} collapse={true} />}
          style={{ margin: "0 30px 30px 30px" }}
        >
          <Button type="link" icon={<InfoCircleOutlined />} />
        </Popover>
      </label>
      {props.HN && <label
        style={{
          display: "block",
          color: "#de5c8e",
          marginBottom: "5px"
        }}
      >
        Patient's HN: {props.HN}
      </label>}
      {props.patient_name && <label
        style={{
          display: "block",
        }}
      >
        Patient's Name: {props.patient_name}
      </label>}
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
            <Panel key="1" header="Patient information">
              <Info Data={props.patient} />
            </Panel>
          </Collapse>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Collapse defaultActiveKey={["1"]} expandIconPosition="right" ghost>
            <Panel key="1" header="Medical Records">
              <Info Data={props.medrec} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};
