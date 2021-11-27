import React, { useState, useEffect } from "react";
import { Table, Tooltip, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs"
import ImageModal from "../component/ImageModal";

const LoadingIcon = (
    <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

function SelectXRayImage(props) {

    const [loaded, setLoaded] = useState(false);

    const fields = ["Patient Name", "Accession No", "Patient ID", "Proc Description", 
        "Modality", "Study Date Time", "Image Count", "Procedure Code", "Primary location"];
    const [columns, setColumns] = useState(null);
    const [data, setData] = useState(null);

    const rowSelection = {
        type: "radio",
        selectedRowKeys: props.accessionNoIndex,
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            props.setAccessionNoIndex(selectedRowKeys);
            props.setAccessionNo(selectedRows[0]["Accession No"]);
        },
    };

    useEffect(() => {
        getPatientData(props.HN)
        .then((res) => {
            console.log(res);
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
            for (const i in res.data) {
                res.data[i]["key"] = (parseInt(i)+1).toString();
                res.data[i]["Study Date Time"] = new Date(res.data[i]["Study Date Time"]).toLocaleString();
            }
            setData(res.data);
            setLoaded(true);
        }).catch((err) => {
            console.log(err);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div>
            <label style={{marginBottom: "8px"}}>Select X-Ray Image</label>
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
            {loaded && 
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    pagination={false} 
                    rowSelection={rowSelection}
                    size="small"
                    className="seven-rows-table"
                />}
        </div>
    );
}

export default SelectXRayImage;