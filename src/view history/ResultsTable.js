import React, { useState, useEffect, useContext } from "react";
import { Table, Input, Button, Modal, Row, Col, Rate, message } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { updateReport } from "../api/report";
import SaveToPACSButton from "./SaveToPACSButton";
import Contexts from "../utils/Contexts";

const { TextArea } = Input;
const GradCamStyle = { fontSize: "x-large" };

export default function ResultsTable(props) {
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const user = JSON.parse(sessionStorage.getItem("user")).id;
  const mode = props.mode;
  const status = props.status;
  const ratingDesc = [
    "Poor",
    "Need Improvements",
    "Satisfactory",
    "Good",
    "Excellent",
  ];
  const [columns, setColumn] = useState();
  const [data, setData] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [reportState, setReportState] = useState({
    rating: props.rate,
    note: props.note,
    btnGroup: "back",
  });
  const [defaultData, setDefaultData] = useState({
    note: props.note,
    rating: props.rate,
  });
  useEffect(() => {
    if (!data) {
      let defaultSelectedRowKeys = [];
      let filtered_data = props.classes.reduce((config, item, i) => {
        if (mode === "edit" && status === "reviewed" && item.selected) {
          defaultSelectedRowKeys = [...defaultSelectedRowKeys, i];
        }
        if (
          ((status === "reviewed" && mode === "view") ||
            status === "finalized") &&
          !item.selected
        ) {
          return [...config];
        }
        return [
          ...config,
          {
            key: i,
            class: item.finding,
            confidence: item.confidence.toFixed(4),
            isPositive: item.isPositive,
            gradCam: props.gradCamList.includes(item.finding),
          },
        ];
      }, []);
      filtered_data.sort(
        (a, b) => b.isPositive - a.isPositive || b.confidence - a.confidence
      );
      setData(filtered_data);
      setSelectedRowKeys(defaultSelectedRowKeys);
      setDefaultData({ ...defaultData, rowKeys: defaultSelectedRowKeys });
    }
    changeGradcam(props.gradCam);
  }, [props.gradCam]);

  useEffect(() => {
    if (reportState.btnGroup === "back" && !currentActivity.enablePageChange) {
      setCurrentActivity({ ...currentActivity, enablePageChange: true });
    }
    if (reportState.btnGroup === "save" && currentActivity.enablePageChange) {
      setCurrentActivity({ ...currentActivity, enablePageChange: false });
    }
  }, [reportState]);

  function changeGradcam(selected_class) {
    let col = [
      {
        title: "Class",
        dataIndex: "class",
        key: "class",
        sorter: {
          compare: (a, b) => a.class.localeCompare(b.class),
          multiple: 2,
        },
      },
      {
        title: "Confidence",
        dataIndex: "confidence",
        key: "confidence",
        sorter: {
          compare: (a, b) => a.confidence - b.confidence,
        },
      },
      {
        title: "Positiveness",
        dataIndex: "isPositive",
        key: "isPositive",
        sorter: {
          compare: (a, b) => a.isPositive - b.isPositive,
        },
        render: (text, record) => (record.isPositive ? 1 : 0),
      },
    ];
    if (!(props.gradCamList.length === 1 && props.gradCamList.includes("original") && props.gradCamList.length)) {
      col = [
        ...col,
        {
          title: "Gradcam",
          key: "action",
          render: (text, record) =>
            record.gradCam && (
              <Button
                type="link"
                icon={
                  record.class === selected_class ? (
                    <EyeOutlined
                      style={
                        record.isPositive
                          ? { ...GradCamStyle, color: "#03989e" }
                          : GradCamStyle
                      }
                    />
                  ) : (
                    <EyeInvisibleOutlined
                      style={
                        record.isPositive
                          ? { ...GradCamStyle, color: "#03989e" }
                          : GradCamStyle
                      }
                      onClick={() => props.setGradCam(record.class)}
                    />
                  )
                }
              />
            ),
        },
      ];
    }
    setColumn(col);
  }

  const onSaveReport = () => {
    /* save report api */
    const key = "updatable";
    message.loading({ content: "Loading...", key, duration: 0 });
    let selected_class = data.reduce((current, item) => {
      if (selectedRowKeys.includes(item.key)) return [...current, item.class];
      return current;
    }, []);
    updateReport(
      props.rid,
      reportState.note,
      JSON.parse(sessionStorage.getItem("user")).id,
      { finding: selected_class },
      reportState.rating
    )
      .then((res) => {
        // console.log(res);
        if (res.success) {
          setDefaultData({
            rating: reportState.rating,
            rowKeys: selectedRowKeys,
            note: reportState.note,
          });
          props.updateTimestamp(res.data.updatedAt, res.data.updated_by);
          setReportState({ ...reportState, btnGroup: "back" });
          message.success({ content: res.message, key, duration: 5 });
        } else message.error({ content: res.message, key, duration: 5 });
      })
      .catch((err) => console.log(err.response));
  };

  const onCancelReport = () => {
    return Modal.confirm({
      title: "Are you sure you want to cancel?",
      icon: <ExclamationCircleOutlined />,
      content: "All changes you made will not be saved.",
      okText: "Sure",
      onOk: () => {
        setSelectedRowKeys(defaultData.rowKeys);
        setReportState({
          note: defaultData.note,
          rating: defaultData.rating,
          btnGroup: "back",
        });
      },
      cancelText: "No",
    });
  };

  const onChangeRating = (e) => {
    // console.log(e);
    setReportState({ ...reportState, rating: e, btnGroup: "save" });
  };
  const rowSelection = {
    type: "checkbox",
    columnWidth: 113,
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      if (selectedKeys.sort() !== defaultData.rowKeys.sort()) {
        setReportState({ ...reportState, btnGroup: "save" });
      }
    },
  };

  return (
    <div>
      {mode === "edit" && status !== "finalized" && (
        <Table
          // className="report-table"
          rowSelection={{
            ...rowSelection,
          }}
          rowClassName={(record, index) => {
            return record.isPositive ? "pos-row" : "";
          }}
          columns={columns}
          dataSource={data}
          scroll={{ y: 200 }}
          pagination={false}
        />
      )}
      {(mode === "view" || status === "finalized") && (
        <Table
          // className="report-table"
          rowClassName={(record, index) => {
            return record.isPositive ? "pos-row" : "";
          }}
          columns={columns}
          dataSource={data}
          scroll={{ y: 200 }}
          pagination={false}
        />
      )}
      <Row align="space-between">
        <Col xs={24} sm={24} md={24} lg={11} xl={11}>
          <label
            style={{
              display: "block",
              color: "#58595b",
              marginBottom: "10px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Note
          </label>
          {(mode === "view" || status === "finalized") && (
            <label
              style={{
                display: "block",
                color: "#58595b",
                marginBottom: "10px",
                fontSize: "medium",
              }}
            >
              {props.note === "" ? "-" : props.note}
            </label>
          )}
          {mode === "edit" && status !== "finalized" && (
            <TextArea
              id="report-note"
              className="input-text"
              style={{ width: "100%", fontSize: "medium" }}
              autoSize={{ minRows: 2, maxRows: 6 }}
              value={reportState.note}
              onChange={(e) => {
                setReportState({
                  ...reportState,
                  note: e.target.value,
                  btnGroup:
                    e.target.value !== defaultData.note
                      ? "save"
                      : reportState.btnGroup,
                });
              }}
            />
          )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={11} xl={11}>
          <label
            style={{
              display: "block",
              color: "#58595b",
              marginBottom: "10px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            Rate this AI
          </label>
          <span style={{ justifyItems: "center" }}>
            <Rate
              className="rating"
              disabled={mode === "view" || status === "finalized"}
              tooltips={ratingDesc}
              onChange={onChangeRating}
              value={reportState.rating}
            />
            <label className="rating-text" style={{ marginLeft: "20px" }}>
              {reportState.rating
                ? ratingDesc[reportState.rating - 1]
                : "No Rating"}
            </label>
          </span>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {reportState.btnGroup === "back" && (
          <Button className="primary-btn" onClick={() => window.history.back()}>
            Back
          </Button>
        )}

        {reportState.btnGroup === "back" &&
          props.HN &&
          status === "reviewed" &&
          props.head.includes(user) && <SaveToPACSButton rid={props.rid} />}

        {reportState.btnGroup === "save" && (
          <Button className="primary-btn" onClick={() => onCancelReport()}>
            Cancel
          </Button>
        )}
        {reportState.btnGroup === "save" && (
          <Button className="primary-btn" onClick={() => onSaveReport()}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
