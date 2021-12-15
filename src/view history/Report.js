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
      setLoaded(true);
    });
  }, []);

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
          HN={info.HN}
          patient={info.patient}
          status={info.status}
          medrec={info.record}
          project={info.project}
          created_at={info.created_at}
          created_by={info.created_by}
          finalized_by={info.finalized_by}
          updated_at={info.updated_at}
        />
      )}
      {loaded && (
        <Row justify="center" align="top">
          <Col xs={24} sm={24} md={24} lg={12} xl={12} align="middle">
            <DicomViewOnly
              img_url={getDicomByAccessionNo(info.image)}
              img_source="wado"
              size={400}
            />
            {mode === "edit" && <AnnotationModal accession_no={info.image} labelList={info.classes.map((item)=>{return item.finding})}/>}
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <div
              style={{
                height: "400px",
                textAlign: "center",
              }}
            >
              {gradCam ? (
                <Image
                  preview={false}
                  height={400}
                  src={getGradCam(rid, gradCam)}
                />
              ) : (
                <DicomViewOnly
                  img_url={getDicomByAccessionNo(info.image)}
                  img_source="wado"
                  size={400}
                  div_id="gradcam"
                />
              )}
            </div>
            <Button
              type="link"
              style={{
                color: "#de5c8e",
                fontSize: "medium",
                visibility: "hidden",
              }}
            >
              Download <CloudDownloadOutlined />
            </Button>
          </Col>
        </Row>
      )}
      {loaded && (
        <ResultsTable
          rid={rid}
          gradCam={gradCam}
          setGradCam={setGradCam}
          classes={info.classes}
          mode={mode}
          status={info.status}
          gradCamList={info.gradCam}
          note={info.note}
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
        <Tag color={props.status === "annotated" ? "warning" : props.status === "reviewed" ? "error" : "success"} style={{marginLeft: "10px"}}>
          {props.status === "annotated" ? "AI-Annotated" : props.status === "reviewed" ? "Human-Annotated":"Finalized"}
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
          Created Date Time: {(new Date(props.created_at)).toLocaleString()}
          <br />
          Created By: {props.created_by}
        </i>
        {props.status !== "annotated" && (
          <i>
            <br />
            Last Modified: {(new Date(props.updated_at)).toLocaleString()}
            <br />
            Finalized By: {props.finalized_by}
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
        Project: {props.project.Name}{" "}
        <Popover
          className="proj-popover"
          placement="rightTop"
          content={<ProjectInfo Project={props.project} notChange={true} />}
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
