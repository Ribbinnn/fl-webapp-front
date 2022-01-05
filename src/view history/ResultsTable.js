import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Row, Col, Rate, message } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { updateReport } from "../api/report";

const { TextArea } = Input;
const GradCamStyle = { fontSize: "x-large" };

export default function ResultsTable(props) {
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
  const [rating, setRating] = useState(props.rate);
  const [columns, setColumn] = useState();
  const [data, setData] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [defaultRowKeys, setDefaultRowKeys] = useState([]);
  const [btnGroup, setBtnGroup] = useState("back");
  const [defaultNote, setDefaultNote] = useState(props.note);
  const [note, setNote] = useState(props.note);

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
            gradCam: props.gradCamList.includes(item.finding),
          },
        ];
      }, []);
      filtered_data.sort((a, b) => b.confidence - a.confidence);
      setData(filtered_data);
      setSelectedRowKeys(defaultSelectedRowKeys);
      setDefaultRowKeys(defaultSelectedRowKeys);
    }
    changeGradcam(props.gradCam);
  }, [props.gradCam]);

  function changeGradcam(selected_class) {
    const col = [
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
          multiple: 1,
        },
      },
      {
        title: "Gradcam",
        key: "action",
        render: (text, record) =>
          record.gradCam && (
            <Button
              type="link"
              icon={
                record.class === selected_class ? (
                  <EyeOutlined style={GradCamStyle} />
                ) : (
                  <EyeInvisibleOutlined
                    style={GradCamStyle}
                    onClick={() => props.setGradCam(record.class)}
                  />
                )
              }
            />
          ),
      },
    ];
    setColumn(col);
  }
  const onSavetoPACS = () => {
    /* save to PACS api */
    const key = "updatable";
    message.loading({ content: "Loading...", key, duration: 2.5}).then(() => message.success({ content: "Successfully save to PACS. This report can no longer edit.", key, duration: 5 }));
    
    // SaveToPACS()
    //   .then((res) => {
    //     console.log(res);
    //     if (res.success) {
    //       message.success({ content: res.message, key, duration: 5 });
    //     } else message.error({ content: res.message, key, duration: 5 });
    //   })
    //   .catch((err) => console.log(err.response));
  };

  const onSaveReport = () => {
    /* save report api */
    const key = "updatable";
    message.loading({ content: "Loading...", key });
    let selected_class = [];
    for (const i in selectedRows) {
      selected_class.push(selectedRows[i].class);
    }
    updateReport(
      props.rid,
      note,
      JSON.parse(sessionStorage.getItem("user")).id,
      { finding: selected_class },
      rating
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          message.success({ content: res.message, key, duration: 5 });
          setDefaultRowKeys(selectedRowKeys);
          setDefaultNote(note);
          setBtnGroup("back");
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
        setSelectedRowKeys(defaultRowKeys);
        setNote(defaultNote);
        setBtnGroup("back");
      },
      cancelText: "No",
    });
  };

  const onChangeRating = (e) => {
    console.log(e)
    setRating(e);
    btnGroup !== "save" && setBtnGroup("save");
  }
  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      /* console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      ); */
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedKeys);
      console.log(selectedKeys.sort(), defaultRowKeys.sort());
      if (selectedKeys.sort() !== defaultRowKeys.sort()) {
        setBtnGroup("save");
      }
    },
  };

  return (
    <div>
      {mode === "edit" && (
        <Table
          className="report-table"
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
      {(mode === "view" || status === "finalized") && (
        <Table
          className="report-table"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
      <Row align="space-between">
        <Col  xs={24}
            sm={24}
            md={24}
            lg={11}
            xl={11}>
          <label
            style={{
              display: "block",
              color: "#58595b",
              marginBottom: "10px",
              fontWeight: "bold",
              marginTop: "20px"
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
          {mode === "edit" && (
            <TextArea
              id="report-note"
              className="input-text"
              style={{ width: "100%", fontSize: "medium" }}
              autoSize={{ minRows: 2, maxRows: 6 }}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                e.target.value !== defaultNote && setBtnGroup("save");
              }}
            />
          )}
        </Col>
        <Col xs={24}
            sm={24}
            md={24}
            lg={11}
            xl={11}>
          <label
            style={{
              display: "block",
              color: "#58595b",
              marginBottom: "10px",
              fontWeight: "bold",
              marginTop: "20px"
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
              value={rating}
            />
            <span className="rating-text">
              {rating ? ratingDesc[rating - 1] : "No Rating"}
            </span>
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
        {btnGroup === "back" && (
          <Button className="primary-btn" onClick={() => window.history.back()}>
            Back
          </Button>
        )}
        {btnGroup === "back" &&
          status === "reviewed" &&
          props.head.includes(user) && (
            <Button className="primary-btn" onClick={() => onSavetoPACS()}>
              Save to PACS
            </Button>
          )}
        {btnGroup === "save" && (
          <Button className="primary-btn" onClick={() => onCancelReport()}>
            Cancel
          </Button>
        )}
        {btnGroup === "save" && (
          <Button className="primary-btn" onClick={() => onSaveReport()}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
