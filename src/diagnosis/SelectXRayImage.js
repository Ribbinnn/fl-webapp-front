import React, { useState, useEffect, useContext } from "react";
import { Table, Tooltip, Spin, Form, DatePicker, Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs"
import ImageModal from "../component/ImageModal";
import * as moment from "moment";
import Contexts from '../utils/Contexts';

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function SelectXRayImage(props) {

    const { globalProject, setGlobalProject } = useContext(Contexts.project);
    const [loaded, setLoaded] = useState(true);

    const fields = ["Patient Name", "Accession No", "Patient ID", "Modality", "Study Date Time", "Procedure Code"];
    const [columns, setColumns] = useState(null);
    const [tableData, setTableData] = useState(null);

    const rowSelection = {
        type: "radio",
        selectedRowKeys: props.accessionNoIndex,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            props.setAccessionNoIndex(selectedRowKeys);
            props.setAccessionNo(selectedRows[0]["Accession No"]);
            props.setMedRec({
                age: selectedRows[0]["Age"],
                gender: selectedRows[0]["Patient Sex"],
                hn: globalProject.projectReq.length === 0 ? selectedRows[0]["Patient ID"] : props.MedRec.hn,
                entry_id: globalProject.projectReq.length === 0 ? 1 : props.MedRec.entry_id,
                measured_time: globalProject.projectReq.length === 0 ? selectedRows[0]["Study Date Time"] : props.MedRec.measured_time,
                ...props.MedRec
            })
        },
    };

    const prepareTable = (data) => {
        // create columns
        let field_list = (fields).map((field) => ({
            title: field,
            dataIndex: field,
            key: field,
            align: "center",
            ellipsis: {
                showTitle: false,
            },
            render: (field) => (
                <Tooltip placement="topLeft" title={field}>
                    {field}
                </Tooltip>
            ),
        }));
        field_list.push({
            title: "Preview",
            key: "preview",
            dataIndex: "preview",
            render: (_, record) => {
                return(
                    <div className="center-div">
                        <ImageModal
                            AccessionNo={record["Accession No"]}
                            // ProcDescription={record["Proc Description"]}
                            StudyDateTime={record["Study Date Time"]} />
                    </div>
                );
            },
            align: "center",
        });
        setColumns(field_list);
        // add key to each row & change date-time
        for (const i in data) {
            data[i]["key"] = (parseInt(i)+1).toString();
            data[i]["Study Date Time"] = new Date(data[i]["Study Date Time"]).toLocaleDateString();
        }
        return data;
    }

    useEffect(() => {
        if (props.pacsTableData) {
            setTableData(prepareTable(props.pacsTableData));
        }
    }, []);

    return(
        <div>
            <label style={{marginBottom: "8px"}}>Select X-Ray Image</label>
            <Form layout="inline" style={{marginBottom: "5px"}}>
                {/* <Form.Item
                    name="acc_no"
                    label="Accession No"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                    <Input
                        className="input-text"
                        defaultValue={props.searchAccNo}
                        onChange={(item) => {
                            props.setSearchAccNo(item.target.value);
                        }}
                        style={{width:"200px"}} />
                </Form.Item> */}
                <Form.Item
                    name="from"
                    label="From"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >   
                    <DatePicker
                        defaultValue={props.fromDate ? moment(props.fromDate) : null}
                        onChange={(date) => {
                            props.setFromDate(date? date.startOf('day').toDate(): null) // Moment Object
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item
                    name="to"
                    label="To"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                    <DatePicker
                        defaultValue={props.toDate ? moment(props.toDate) : null}
                        onChange={(date) => {
                            props.setToDate(date? date.endOf('day').toDate(): null) // Moment Object
                        }}
                        style={{width:"200px"}} />
                </Form.Item>
                <Form.Item style={{marginLeft:"20px"}}>
                    <Button
                        className="primary-btn smaller"
                        style={{marginTop:"32px"}}
                        onClick={() => {
                            setLoaded(false);
                            getPatientData(
                                props.HN, 
                                props.searchAccNo === null ? "" : props.searchAccNo, 
                                props.fromDate === null ? "" : props.fromDate, 
                                props.toDate === null ? "" : props.toDate)
                            .then((res) => {
                                if (Object.keys(res.data).length === 0) {
                                    setTableData([]);
                                    props.setPacsTableData([]);
                                    props.setAccessionNoIndex([]);
                                    props.setAccessionNo(null);
                                    setLoaded(true);
                                } else {
                                    const data = prepareTable(res.data);
                                    setTableData(data);
                                    props.setPacsTableData(data);
                                    props.setAccessionNoIndex([]);
                                    props.setAccessionNo(null);
                                    setLoaded(true);
                                }
                            }).catch((err) => {
                                console.log(err.response);
                            })
                        }}>
                            Search
                    </Button>
                </Form.Item>
            </Form>
            <label style={{fontSize: "medium", color: "#de5c8e", marginBottom: loaded ? "32px" : 0, marginLeft: "20px"}}>
                Press 'Search' button without filling any fields to get all results
            </label>
            {!loaded && (
                <div style={{ textAlign: "center", marginTop: "10%" }}>
                <Spin indicator={LoadingIcon} />
                <br />
                <br />
                <span style={{ fontSize: "medium", color: "#de5c8e" }}>
                    Loading ...
                </span>
                </div>
            )}
            {loaded && tableData && 
                <Table 
                    columns={columns} 
                    dataSource={tableData}
                    rowSelection={rowSelection}
                    size="small"
                    className="with-row-selection"
                />
            }
        </div>
    );
}

export default SelectXRayImage;