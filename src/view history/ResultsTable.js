import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const GradCamStyle = { fontSize: "x-large" };

export default function Demo(props) {
  const mode = props.mode ?? "edit";
  const [columns, setColumn] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    console.log(props);
    if (!data) {
      let temp = props.classes.map((item, i) => {
        return {
          key: i,
          class: item.finding,
          confidence: item.confidence.toFixed(4),
          gradCam: props.gradCamList.includes(item.finding),
        };
      });
      temp.sort((a, b) => b.confidence - a.confidence);
      console.log(temp);
      setData(temp ?? []);
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

  const rowSelection = {
    type: "checkbox",
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
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
          {props.note}
        </label>
      )}
      {mode === "edit" && (
        <TextArea
          className="input-text"
          defaultValue={props.note}
          style={{ width: "600px", fontSize: "medium" }}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      )}
      <div style={{display:"flex", justifyContent: "space-between", marginTop:"20px"}}>
        {mode === "view" && (
          <Button
            className="primary-btn"
          >
            Back
          </Button>
        )}
        {mode === "edit" && (
          <Button className="primary-btn">
            Cancel
          </Button>
        )}
        {mode === "edit" && (
          <Button className="primary-btn">
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
