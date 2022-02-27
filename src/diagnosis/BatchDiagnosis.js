import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Table,
  Tooltip,
  Spin,
  Form,
  DatePicker,
  TimePicker,
  Button,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs";
import ImageModal from "../component/ImageModal";
import * as moment from "moment";
import Contexts from "../utils/Contexts";

//.format("HH-mm").format("YYYY-MM-DD")
export default function BatchDiagnosis(props) {
  const current = moment();
  const [selectedTime, setSelectedTime] = useState({
    fromDate: current.clone().subtract(1, "hours"),
    fromTime: current.clone().subtract(1, "hours"),
    toDate: current,
    toTime: current,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [columns, setColumns] = useState([
    {
        title: "Patient Name",
        dataIndex: "Patient Name",
        key: "name",
      },
      {
        title: "Accession No",
        dataIndex: "Accession No",
        key: "acc_no",
      },
      {
        title: "HN",
        dataIndex: "Patient ID",
        key: "hn",
      },
      {
        title: "Modality",
        dataIndex: "Modality",
        key: "modality",
      },
      {
        title: "Study Date Time",
        dataIndex: "Study Date Time",
        key: "std_dt",
      },
      {
        title: "Procedure Code",
        dataIndex: "Procedure Code",
        key: "proc_code",
      },
      {
        title: "Sex",
        dataIndex: "Patient Sex",
        key: "sex",
      },
      {
        title: "Age",
        dataIndex: "Age",
        key: "age",
      },
      {
        title: "Preview",
        key: "preview",
        render: (text, record) => "eye"
      },
  ]);
  const [pagination, setPagination] = useState({});
  const [selectedPatients, setSelectedPatients] = useState([]);

  const LoadingIcon = (
    <LoadingOutlined
      style={{ fontSize: 30, color: "#de5c8e", marginRight: 5 }}
      spin
    />
  );

  const onChangePicker = (props) => (value) => {
    setSelectedTime({
      ...selectedTime,
      [props]: value,
    });
  };

  const onSearchImages = () => {
    let from = new Date(`${selectedTime.fromDate.format("YYYY-MM-DD")} ${selectedTime.fromTime.format("HH:mm")}`)
    let to = new Date(`${selectedTime.toDate.format("YYYY-MM-DD")} ${selectedTime.toTime.format("HH:mm")}`)
    console.log(from,to)
    setLoading(true);
    getPatientData(
      "",
      "",
      from,
      to
    )
      .then((res) => {
        console.log(res);
        if (Object.keys(res.data).length === 0) res.data = []
        let result = res.data.map((item, i)=>{
            return {
                key: i,
                ...item,
                Age: item.Age ?? moment(item["Study Date Time"]).diff(moment(item["Patient Birthdate"]), 'years'),
            }
        })
        console.log(result)
        setData(result);
        setLoading(false);
        setSelectedPatients([]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //   useEffect(() => {}, []);
  const rowSelection = {
    type: "checkbox",
    onChange: (selectedKeys, selectedRows) => {
        setSelectedPatients(selectedRows);
    },
  };

  return (
    <div>
      <label> Select X-Ray Images by Study Date Time </label>
      <Form layout="inline" style={{ marginTop: "10px" }}>
        <Form.Item
          name="from"
          label="From"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <DatePicker
            onSelect={onChangePicker("fromDate")}
            value={selectedTime.fromDate}
            allowClear={false}
            style={{ width: "200px" }}
            inputReadOnly
          />
          <TimePicker
            format="HH:mm"
            popupClassName="batch-diag-timepicker"
            allowClear={false}
            value={selectedTime.fromTime}
            style={{ width: "100px", marginLeft: "5px" }}
            onSelect={onChangePicker("fromTime")}
            inputReadOnly
          />
        </Form.Item>
        <Form.Item
          name="to"
          label="To"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <DatePicker
            onSelect={onChangePicker("toDate")}
            value={selectedTime.toDate}
            allowClear={false}
            style={{ width: "200px" }}
            inputReadOnly
          />
          <TimePicker
            format="HH:mm"
            value={selectedTime.toTime}
            popupClassName="batch-diag-timepicker"
            allowClear={false}
            style={{ width: "100px", marginLeft: "5px" }}
            onSelect={onChangePicker("toTime")}
            inputReadOnly
          />
        </Form.Item>
        <Form.Item style={{ marginLeft: "20px" }}>
          <Button
            className="primary-btn smaller"
            style={{ marginTop: "32px" }}
            onClick={onSearchImages}
          >
            Search
          </Button>
        </Form.Item>
      </Form>
      <div>
        {loading && (
          <div style={{ textAlign: "center", marginTop: "10%" }}>
            <Spin indicator={LoadingIcon} />
            <br />
            <br />
            <span style={{ fontSize: "medium", color: "#de5c8e" }}>
              Loading ...
            </span>
          </div>
        )}
        {!loading && data && (
          <Table
            className="batch-diag-table"
            rowSelection={{
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            // pagination={false}
          />
        )}
      </div>
    </div>
  );
}
