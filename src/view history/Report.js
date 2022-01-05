import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Collapse, Popover, Button, Row, Col, Image, Spin, Tag } from "antd";
import Info from "../component/Info";
import DicomViewOnly from "../component/dicom-viewer/DicomViewOnly";
import {
  InfoCircleOutlined,
  CloudDownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import AnnotationModal from "./annotate/AnnotationModal";
import ProjectInfo from "../component/ProjectInfo";
import ResultsTable from "./ResultsTable";
import { getGradCam, getDicomByAccessionNo } from "../api/image";
import { getReport } from "../api/report";
import { saveAs } from "file-saver";
const { Panel } = Collapse;

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

export default function Report(props) {
  const { mode, rid } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [info, setInfo] = useState();
  const [gradCam, setGradCam] = useState();
  useEffect(() => {
    getReport(rid).then((res) => {
      console.log(res);
      setInfo(res.data);
      // setLoaded(true);
    });
  }, []);
  useEffect(() => {
    if (info) {
      console.log(info);
      setLoaded(true);
    }
  }, [info]);

  const downloadImage = () => {
    saveAs(
      getGradCam(rid, gradCam),
      `${info.result.project_id.name}_${gradCam}.png`
    ); // Put your image url here.
  };

  const updateTimestamp = (updatedAt, updated_by) => {
    setInfo({
      ...info,
      result: { ...info.result, updatedAt: updatedAt, updated_by: updated_by },
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
            <DicomViewOnly
              img_url={getDicomByAccessionNo(info.result.image_id.accession_no)}
              img_source="wado"
              size={400}
            />
            {mode === "edit" && (
              <AnnotationModal
                accession_no={info.result.image_id.accession_no}
                labelList={info.classes.map((item) => {
                  return item.finding;
                })}
              />
            )}
          </Col>
          {gradCam && (
            <Col xs={24} sm={24} md={24} lg={12} xl={12} align="center">
              <div
                style={{
                  height: "400px",
                  textAlign: "center",
                }}
              >
                <Image
                  preview={false}
                  height={400}
                  src={getGradCam(rid, gradCam)}
                />
                {/* {gradCam ? (
                <Image
                  preview={false}
                  height={400}
                  src={getGradCam(rid, gradCam)}
                />
              ) : (
                <DicomViewOnly
                  img_url={getDicomByAccessionNo(
                    info.result.image_id.accession_no
                  )}
                  img_source="wado"
                  size={400}
                  div_id="gradcam"
                />
              )} */}
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
                Download Image
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
          color: "#de5c8e",
          marginBottom: "10px",
        }}
      >
        Patient's HN: {props.HN}
      </label>
      <label
        style={{
          display: "block",
          color: "#58595b",
        }}
      >
        Project: {props.project.name}{" "}
        <Popover
          className="proj-popover"
          placement="rightTop"
          content={<ProjectInfo notChange={true} />}
          style={{ margin: "0 30px 30px 30px" }}
        >
          <Button type="link" icon={<InfoCircleOutlined />} />
        </Popover>
      </label>
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
