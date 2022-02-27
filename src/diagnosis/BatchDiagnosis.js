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

export default function BatchDiagnosis(props) {
  const [selectedTime, setSelectedTime] = useState({
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
  });

  const onChangePicker = (props) => (value) => {
    let format = "";
    if (props === "fromTime" || props === "toTime") format = "HH:mm";
    if (props === "fromDate" || props === "toDate") format = "YYYY-MM-DD";
    console.log(format, value);
    setSelectedTime({
        ...selectedTime,
        [props]: value.format(format)
    })
  }

  useEffect(()=>{
      var current = moment();
      setSelectedTime({
        fromDate: current.clone().subtract(1,"hours").format("YYYY-MM-DD"),
        fromTime: current.clone().subtract(1,"hours").format("HH-mm"),
        toDate: current.format("YYYY-MM-DD"),
        toTime: current.format("HH-mm"),
      });
  },[])

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
            value={moment(selectedTime.fromDate, "YYYY-MM-DD")}
            allowClear={false}
            style={{ width: "200px" }}
          />
          <TimePicker
            format="HH:mm"
            popupClassName="batch-diag-timepicker"
            allowClear={false}
            value={moment(selectedTime.fromTime, "HH:mm")}
            style={{ width: "100px", marginLeft: "5px" }}
            onSelect={onChangePicker("fromTime")}
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
            value={moment(selectedTime.toDate, "YYYY-MM-DD")}
            allowClear={false}
            style={{ width: "200px" }}
          />
          <TimePicker
            format="HH:mm"
            value={moment(selectedTime.toTime, "HH:mm")}
            popupClassName="batch-diag-timepicker"
            allowClear={false}
            style={{ width: "100px", marginLeft: "5px" }}
            onSelect={onChangePicker("toTime")}
          />
        </Form.Item>
        <Form.Item style={{ marginLeft: "20px" }}>
          <Button
            className="primary-btn smaller"
            style={{ marginTop: "32px" }}
            // onClick={() => {
            //     setLoaded(false);
            //     getPatientData(
            //         props.HN,
            //         props.searchAccNo === null ? "" : props.searchAccNo,
            //         props.fromDate === null ? "" : props.fromDate,
            //         props.toDate === null ? "" : props.toDate)
            //     .then((res) => {
            //         console.log(res);
            //         if (Object.keys(res.data).length === 0) {
            //             setTableData([]);
            //             props.setPacsTableData([]);
            //             props.setAccessionNoIndex([]);
            //             props.setAccessionNo(null);
            //             setLoaded(true);
            //         } else {
            //             const data = prepareTable(res.data);
            //             setTableData(data);
            //             props.setPacsTableData(data);
            //             props.setAccessionNoIndex([]);
            //             props.setAccessionNo(null);
            //             setLoaded(true);
            //         }
            //     }).catch((err) => {
            //         console.log(err.response);
            //     })
            // }}
          >
            Search
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
