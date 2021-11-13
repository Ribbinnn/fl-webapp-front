import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const GradCamStyle = { fontSize: "x-large" };

export default function ResultsTable(props) {
  const mode = props.mode;
  const status = props.status;
  const [columns, setColumn] = useState();
  const [data, setData] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [defaultRowKeys, setDefaultRowKeys] = useState([]);
  const [btnGroup, setBtnGroup] = useState("back");
  const [defaultNote, setDefaultNote] = useState(props.note);
  const [note, setNote] = useState(props.note);

  useEffect(() => {
    if (!data) {
      let defaultSelectedRowKeys = [];
      let filtered_data = props.classes.reduce((config, item, i) => {
        if (mode === "edit" && status === "finalized" && item.selected) {
          defaultSelectedRowKeys = [...defaultSelectedRowKeys, i];
        }
        if (status === "finalized" && mode === "view" && !item.selected) {
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

  const onSaveReport = () => {
    /** save report api
     *
     *
     *
     *
     *
     *
     *
     */
    setDefaultRowKeys(selectedRowKeys);
    setDefaultNote(note);
    setBtnGroup("back");
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

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      /* console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      ); */
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
      {mode === "view" && (
        <Table
          className="report-table"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      )}
      <label
        style={{
          display: "block",
          color: "#58595b",
          marginBottom: "10px",
          marginTop: "10px",
        }}
      >
        Note
      </label>
      {mode === "view" && (
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
          style={{ width: "600px", fontSize: "medium" }}
          autoSize={{ minRows: 2, maxRows: 6 }}
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            e.target.value !== defaultNote && setBtnGroup("save");
          }}
        />
      )}
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
