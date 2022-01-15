import React, { useState, useEffect } from "react";
import { Table, Tooltip, Spin, Form, DatePicker, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs"
import ImageModal from "../component/ImageModal";
import * as moment from "moment";

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function SelectXRayImage(props) {

    const [loaded, setLoaded] = useState(true);

    const fields = ["Patient Name", "Accession No", "Patient ID", "Proc Description", 
        "Modality", "Study Date Time", "Image Count", "Procedure Code", "Primary location"];
    const [columns, setColumns] = useState(null);
    const [tableData, setTableData] = useState(null);

    const rowSelection = {
        type: "radio",
        selectedRowKeys: props.accessionNoIndex,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            props.setAccessionNoIndex(selectedRowKeys);
            props.setAccessionNo(selectedRows[0]["Accession No"]);
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
            render: field === "Patient Name" || field === "Proc Description" || field === "Study Date Time" ? field => (
                <Tooltip placement="topLeft" title={field}>
                    {field}
                </Tooltip>
            ) : null,
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
                            ProcDescription={record["Proc Description"]}
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
            data[i]["Study Date Time"] = new Date(data[i]["Study Date Time"]).toLocaleString();
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
            <Form layout="inline" style={{marginBottom: loaded ? "32px" : 0}}>
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
                            getPatientData(props.HN /* ,props.fromDate, props.toDate */)
                            .then((res) => {
                                const data = prepareTable(res.data);
                                setTableData(data);
                                props.setPacsTableData(data);
                                props.setAccessionNoIndex([]);
                                props.setAccessionNo(null);
                                setLoaded(true);
                            }).catch((err) => {
                                console.log(err);
                            })
                        }}>
                            Search
                    </Button>
                </Form.Item>
            </Form>
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
                    pagination={false} 
                    rowSelection={rowSelection}
                    size="small"
                    className="seven-rows-table"
                />
            }
        </div>
    );
}

export default SelectXRayImage;