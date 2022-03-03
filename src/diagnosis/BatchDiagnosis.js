import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Table,
  Spin,
  Form,
  DatePicker,
  TimePicker,
  Button,
  Checkbox,
  Steps,
  Modal,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs";
import ImageModal from "../component/ImageModal";
import Completed from "../component/Completed";
import { batchInfer } from "../api/report";
import * as moment from "moment";
import Contexts from "../utils/Contexts";
const { Step } = Steps;

//.format("HH-mm").format("YYYY-MM-DD")
export default function BatchDiagnosis(props) {
  const { globalProject } = useContext(Contexts).project;
  const { currentActivity, setCurrentActivity } = useContext(Contexts).active;
  const current = moment();
  const [selectedTime, setSelectedTime] = useState({
    fromDate: current.clone().subtract(1, "hours"),
    fromTime: current.clone().subtract(1, "hours"),
    toDate: current,
    toTime: current,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [data, setData] = useState();
  const [columns, setColumns] = useState();
  const [selectedPatients, setSelectedPatients] = useState([]);
  const stepsTitle = ["Select X-Ray Images", "Diagnosis Started"];
  const [currentStep, setCurrentStep] = useState(0);

  const btnList = [
    {
      title: "Back to Home",
      destination: "/",
    },
    {
      title: "Create New Diagnosis",
      destination: "/diagnosis/batch",
    },
    ,
    {
      title: "Go to View History",
      destination: "/viewhistory",
    },
  ];

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
    let from = new Date(
      `${selectedTime.fromDate.format(
        "YYYY-MM-DD"
      )} ${selectedTime.fromTime.format("HH:mm")}`
    );
    let to = new Date(
      `${selectedTime.toDate.format("YYYY-MM-DD")} ${selectedTime.toTime.format(
        "HH:mm"
      )}`
    );
    setLoading(true);
    getPatientData("", "", from, to)
      .then((res) => {
        // console.log(res);
        if (Object.keys(res.data).length === 0) res.data = [];
        let result = res.data
          .sort((a, b) => {
            let x = moment(a["Study Date Time"]);
            let y = moment(b["Study Date Time"]);
            return x.diff(y) || a["Patient ID"] - b["Patient ID"];
          })
          .map((item, i) => {
            return {
              key: i,
              ...item,
              Age:
                item.Age ??
                moment(item["Study Date Time"]).diff(
                  moment(item["Patient Birthdate"]),
                  "years"
                ),
            };
          });
        setData(result);
        setLoading(false);
        setSelectedPatients([]);
        setPagination({ page: 1, pageSize: 10 });
        setCurrentActivity({ ...currentActivity, enablePageChange: true });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    setColumns([
      {
        title: "No.",
        dataIndex: "key",
        key: "no",
        render: (text, record, index) =>
          (pagination.page - 1) * pagination.pageSize + index + 1,
      },
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
        render: (text, record) => {
          return (
            <ImageModal
              AccessionNo={record["Accession No"]}
              StudyDateTime={record["Study Date Time"]}
            />
          );
        },
      },
    ]);
  }, [pagination, data]);

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys: selectedPatients,
    onChange: (selectedKeys) => {
      setSelectedPatients(selectedKeys);
      if (selectedKeys.length > 0 && currentActivity.enablePageChange)
        setCurrentActivity({ ...currentActivity, enablePageChange: false });
      if (selectedKeys.length === 0 && !currentActivity.enablePageChange)
        setCurrentActivity({ ...currentActivity, enablePageChange: true });
      //   console.log(selectedKeys);
    },
  };

  const onCheckAll = (e) => {
    setSelectedPatients(
      e.target.checked
        ? Array.from({ length: data.length }, (_, index) => index)
        : []
    );
    //   console.log(e.target.checked)
  };

  const Next = () => {
    if (selectedPatients.length === 0) {
      return Modal.warning({
        title: "No image selected!",
        content: "You have to select at least 1 image to diagnosis.",
      });
    }
    let dicom_info_list = data.reduce((current ,item) => {
        if (selectedPatients.includes(item.key))
        {
            let date = new Date(item["Study Date Time"]);
            return [...current, {
            record: {
                gender: item["Patient Sex"],
                age: item["Age"],
                hn: item["Patient ID"],
                measured_time: date,
                entry_id: 1
            },
            accession_no: item["Accession No"]
        }]}
        return current;
    }, []);

    return Modal.confirm({
        title: `Please confirm diagnosis ${selectedPatients.length} image${selectedPatients.length > 1 ? "s":""}.` ,
        onOk: () => {
            batchInfer(globalProject.projectId, dicom_info_list, JSON.parse(sessionStorage.getItem("user")).id).then((res) => {
                console.log(res);
                setCurrentStep(1);
                // setLoading(false);
                setCurrentActivity({ ...currentActivity, enablePageChange: true });
              })
              .catch((err) => {
                console.log(err.response);
                Modal.error({ content: err.response.data.message });
                // setLoading(false);
              });
        }
    })

    // setCurrentActivity({ ...currentActivity, enablePageChange: true });
  };

  return (
    <div className="content">
      <Steps progressDot current={currentStep}>
        {stepsTitle.map((item) => (
          <Step key={item} title={item} />
        ))}
      </Steps>
      {currentStep === 0 && (
        <div className="steps-content-diagnosis">
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
            <Form.Item>
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
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                {data.length > 0 && (
                  <Row>
                    <Col span={8} style={{ textAlign: "start" }}>
                      {data.length > 20 &&
                        data.length / pagination.pageSize > 1 && (
                          <Checkbox
                            style={{ fontWeight: "normal", fontSize: "large" }}
                            indeterminate={
                              data.length > selectedPatients.length &&
                              selectedPatients.length > 0
                            }
                            onChange={onCheckAll}
                          >
                            {`Select all ${data.length} images`}
                          </Checkbox>
                        )}
                    </Col>
                    <Col span={8}>
                      <label style={{ textAlign: "center" }}>
                        {" "}
                        {`${selectedPatients.length} out of ${data.length} Images Selected`}{" "}
                      </label>
                    </Col>
                  </Row>
                )}
                <Table
                  className="batch-diag-table"
                  rowSelection={{
                    ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={data}
                  pagination={
                    data.length > 20 && {
                      size: "small",
                      hideOnSinglePage: data.length <= 20,
                      onChange(page, pageSize) {
                        setPagination({ page: page, pageSize: pageSize });
                      },
                      showQuickJumper: data.length / pagination.pageSize > 12,
                      showSizeChanger: data.length > 20,
                      pageSizeOptions: ["10", "20", "50", "100"].reduce(
                        (current, item) => {
                          return current.slice(-1) > data.length
                            ? current
                            : [...current, item];
                        },
                        []
                      ),
                      position: ["topRight", "bottomRight"],
                    }
                  }
                  style={{ marginTop: data.length > 20 ? "0px" : "10px" }}
                />
                {data.length > 0 && (
                  <div style={{ textAlign: "end", marginTop: "30px" }}>
                    <Button className="primary-btn" onClick={Next}>
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {currentStep === 1 && (
        <div className="steps-action-1">
          <Completed btnList={btnList} title="Diagnosis Started" />
        </div>
      )}
    </div>
  );
}
