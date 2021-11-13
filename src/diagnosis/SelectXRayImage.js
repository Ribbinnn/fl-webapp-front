import React, { useState, useEffect } from "react";
import { Table, Tooltip } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { getPatientData } from "../api/pacs"
// import ImageModal from "../component";

function SelectXRayImage(props) {

    const fields = ["Patient Name", "Accession No", "Patient ID", "Proc Description", 
        "Modality", "Study Date Time", "Image Count", "Procedure Code", "Primary location"];
    const [columns, setColumns] = useState(null);
    const [data, setData] = useState(null);

    const rowSelection = {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows[0]);
            // props.setAccessionNo(...);
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
                            <EyeOutlined
                                className="clickable-icon"
                                onClick={() => console.log("preview")} />
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
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    return(
        <div>
            <label style={{marginBottom: "8px"}}>Select X-Ray Image</label>
            <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false} 
                rowSelection={rowSelection}
                size="small"
                className="seven-rows-table"
            />
        </div>
    );
}

export default SelectXRayImage;