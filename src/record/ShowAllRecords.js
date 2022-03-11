import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useContext } from "react";
import { getAllRecords, deleteRecordRow, updateRecordRow } from "../api/vitals";
import {
  Table,
  Button,
  Input,
  Form,
  Popconfirm,
  Tooltip,
  Spin,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Contexts from "../utils/Contexts";

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

const ShowAllRecords = forwardRef((props, ref) => {
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const recordId = useRef("");
  const [loaded, setLoaded] = useState(false);

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const currentData = useRef([]);
  const [mergedColumns, setMergeColumns] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  useImperativeHandle(ref, () => ({
    editingKey: editingKey,
  }));

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input className="input-text smaller" />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    if (currentActivity.enablePageChange) setCurrentActivity({ ...currentActivity, enablePageChange: false });
  };
  const cancel = () => {
    setEditingKey("");
    setCurrentActivity({ ...currentActivity, enablePageChange: true });
  };
  const save = async (key) => {
    try {
      setLoaded(false);
      const row = await form.validateFields();
      for (const i in row) {
        if (row[i] === "" || row[i] === null) {
          throw new Error(
            `Invalid record input: ${Object.keys(row).find(key => row[key] === row[i])} is missing`)
        }
      }
      const newData = [...currentData.current];
      const index = newData.findIndex((item) => key === item.key);
      const update_data = { ...newData[index], ...row };
      delete update_data["key"];
      for (const i in update_data) {
        if (!isNaN(update_data[i])) {
          update_data[i] = parseInt(update_data[i]);
        }
      }
      update_data["measured_time"] = new Date(update_data["measured_time"]);
      update_data["updated_time"] = new Date(update_data["updated_time"]);
      updateRecordRow(props.project.projectId, recordId.current, [update_data])
        .then((res) => {
          // console.log(res);
          setEditingKey("");
          if (!currentActivity.enablePageChange)
            setCurrentActivity({ ...currentActivity, enablePageChange: true });
        })
        .catch((err) => {
          console.log(err.response);
          Modal.error({ content: err.response.data.error });
          setEditingKey("");
        });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      Modal.error({ content: errInfo.message });
      if (!currentActivity.enablePageChange) setCurrentActivity({ ...currentActivity, enablePageChange: true });
      setEditingKey("");
    }
  };
  const deleteRow = (key) => {
    setLoaded(false);
    const newData = [...currentData.current];
    const index = newData.findIndex((item) => key === item.key);
    deleteRecordRow(recordId.current, newData[index].entry_id)
      .then((res) => {
        // console.log(res);
        setEditingKey("delete");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllRecords(props.record.vitals_proj_id)
      .then((res) => {
        // console.log(res);
        // create columns
        let column_list = Object.keys(res.data[0].records[0]).map((column) => ({
          title:
            column === "hn"
              ? column.toUpperCase()
              : column.charAt(0).toUpperCase() +
                column.slice(1).split("_").join(" "),
          dataIndex: column,
          key: column,
          align: "center",
          ellipsis: {
            showTitle: false,
          },
          render:
            column === "measured_time" || column === "updated_time"
              ? (column) => (
                  <Tooltip placement="topLeft" title={column}>
                    {column}
                  </Tooltip>
                )
              : null,
          editable:
            column === "hn" ||
            column === "entry_id" ||
            column === "measured_time" ||
            column === "updated_time"
              ? false
              : true,
        }));
        column_list.push({
          title: "Action",
          key: "action",
          dataIndex: "action",
          render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
              <div className="center-div">
                <Popconfirm
                  title="Save this row?"
                  onConfirm={() => save(record.key)}
                  okButtonProps={{ className: "primary-btn popconfirm" }}
                  cancelButtonProps={{ style: { display: "none" } }}
                >
                  <SaveOutlined className="clickable-icon" />
                </Popconfirm>
                <CloseOutlined
                  className="clickable-icon"
                  style={{ marginLeft: "8px" }}
                  onClick={() => cancel()}
                />
              </div>
            ) : (
              <div className="center-div">
                <EditOutlined
                  className="clickable-icon"
                  onClick={() => edit(record)}
                />
                <Popconfirm
                  title="Delete this row?"
                  onConfirm={() => deleteRow(record.key)}
                  okButtonProps={{ className: "primary-btn popconfirm" }}
                  cancelButtonProps={{ style: { display: "none" } }}
                >
                  <DeleteOutlined
                    className="clickable-icon"
                    style={{ marginLeft: "8px" }}
                  />
                </Popconfirm>
              </div>
            );
          },
          align: "center",
        });
        // create merged columns from columns for editable table
        const merged_column_list = column_list.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record) => ({
              record,
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
            }),
          };
        });
        setMergeColumns(merged_column_list);
        // add key to each row & change date-time
        for (const i in res.data[0].records) {
          res.data[0].records[i]["key"] = (parseInt(i) + 1).toString();
          res.data[0].records[i]["measured_time"] = new Date(
            res.data[0].records[i]["measured_time"]
          ).toLocaleString("sv-SE");
          res.data[0].records[i]["updated_time"] = new Date(
            res.data[0].records[i]["updated_time"]
          ).toLocaleString("sv-SE");
        }
        setData(res.data[0].records);
        currentData.current = res.data[0].records;
        // set record_id
        props.setRecordId(res.data[0]._id);
        recordId.current = res.data[0]._id;
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingKey]);

  return (
    <div className="show-all-records-content">
      <div className="show-all-records-grid">
        <label style={{ color: "#de5c8e", display: "block" }}>
          Record Name: {props.record.rec_name}
        </label>
        <label style={{ display: "block" }}>
          Project: {props.project.projectName}
        </label>
        <label>Uploaded Time: {props.record.updated}</label>
      </div>
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
        <div style={{ maxWidth: "100%" }}>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={mergedColumns}
              dataSource={data}
              size="small"
              style={{ marginTop: "30px" }}
            />
          </Form>
          <Button
            className="primary-btn smaller"
            style={{ float: "right", marginTop: "30px" }}
            onClick={props.next}
          >
            Delete all records
          </Button>
        </div>
      )}
    </div>
  );
});

export default ShowAllRecords;
