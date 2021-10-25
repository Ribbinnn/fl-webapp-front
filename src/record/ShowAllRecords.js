import React, { useEffect, useState } from "react";
import { getAllRecords } from "../api/vitals";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function ShowAllRecords(props) {
    const [records, setRecords] = useState(null);
    const [columns, setColumns] = useState(null);
    useEffect(() => {
        getAllRecords(props.record.vitals_proj_id)
        .then((res) => {
            console.log(res);
            let column_list = (Object.keys(res.data[0].records[0])).map((column) => ({
                title: column === "hn" ? 
                    column.toUpperCase() : 
                    column.charAt(0).toUpperCase() + column.slice(1).split("_").join(" "),
                dataIndex: column,
                key: column,
                align: "center",
                ellipsis: {
                    showTitle: true,
                },
            }));
            column_list.push({
                title: "Action",
                key: "action",
                render: () => (
                    <div className="center-div">
                        <EditOutlined />
                        <DeleteOutlined style={{marginLeft: "8px"}} />
                    </div>
                ),
                align: "center",
            })
            setColumns(column_list);
            for (const i in res.data[0].records) {
                res.data[0].records[i]["key"] = (parseInt(i)+1).toString();
            }
            setRecords(res.data[0].records);
        }).catch((err) => {
            console.log(err);
        })
    }, []);
    return(
        <div className="show-all-records-content">
            <div className="show-all-records-grid">
                <label style={{color: "#de5c8e", display: "block"}}>
                    Record Name: {props.record.rec_name}
                </label>
                <label style={{display: "block"}}>
                    Project: {props.record.proj_name}
                </label>
                <label>
                    Uploaded Time: {props.record.updated}
                </label>
            </div>
            <div style={{maxWidth: "800px"}}>
                <Table 
                    columns={columns} 
                    dataSource={records} 
                    pagination={false} 
                    size="small"
                    className="seven-rows-table"
                    style={{marginTop: "30px"}}
                />
                <Button
                    className="primary-btn smaller"
                    style={{float: "right", marginTop: "30px"}}
                    >
                        Delete all records
                </Button>
            </div>
        </div>
    );
}

export default ShowAllRecords;