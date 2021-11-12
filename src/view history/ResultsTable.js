import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const GradCamStyle = { fontSize: "x-large" };

export default function Demo(props) {
  const mode = props.mode;
  const status = props.status;
  const [columns, setColumn] = useState();
  const [data, setData] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
      //console.log((filtered_data.reduce((, item)=>{return item.selected ? [...defaultSelectedRowKeys,item.key]:defaultSelectedRowKeys},[])))
      setSelectedRowKeys(defaultSelectedRowKeys);
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
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowKeys(selectedRowKeys);
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {mode === "view" && <Button className="primary-btn">Back</Button>}
        {mode === "edit" && <Button className="primary-btn">Cancel</Button>}
        {mode === "edit" && <Button className="primary-btn">Save</Button>}
      </div>
    </div>
  );
}
