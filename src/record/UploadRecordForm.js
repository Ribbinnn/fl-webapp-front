import React, { useState } from "react";
import { Button, Table } from "antd";
import { CloudDownloadOutlined } from '@ant-design/icons';

function UploadRecordForm() {

    const [filename, setFilename] = useState("filename.xlsx");

    const uploadedRecords = [ // get from uploaded file > map
        {
            key: "1",
            hn: "0001",
            age: 28,
            gender: "F",
            pulse_rate: 77,
            blood_pressure: "120/80",
            temperature: 36.7,
        },
        {
            key: "2",
            hn: "0002",
            age: 35,
            gender: "M",
            pulse_rate: 81,
            blood_pressure: "118/84",
            temperature: 36.3,
        },
        {
            key: "3",
            hn: "0003",
            age: 22,
            gender: "M",
            pulse_rate: 94,
            blood_pressure: "125/82",
            temperature: 37.1,
        },
    ];

    const columns = [ // get from project > map
        {
            title: "HN",
            dataIndex: "hn",
            key: "hn",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Pulse rate",
            dataIndex: "pulse_rate",
            key: "pulse_rate",
        },
        {
            title: "Blood pressure",
            dataIndex: "blood_pressure",
            key: "blood_pressure",
        },
        {
            title: "Temperature",
            dataIndex: "temperature",
            key: "temperature",
        }
    ];

    return(
        <div>
            <label style={{display: "block"}}>Medical Records</label>
            <a 
                style={{color: "#de5c8e", display: "flex", alignItems: "center"}}
                onClick={() => {
                    /* call download template api */
                }}>
                    Download Template
                    <CloudDownloadOutlined style={{marginLeft: "5px"}} />
            </a>
            <Button 
                type="primary" 
                className="primary-btn" 
                onClick={() => {
                    /* call upload file api */
                }}>
                    Upload
            </Button>
            <label>{filename}</label>
            <label id="smaller-label" style={{display: "block", color: "#de5c8e"}}>
                *accepted file type: .xlsx, .csv
            </label>
            {uploadedRecords &&
                <div>
                    <label style={{display: "block"}}>Preview</label>
                    <Table columns={columns} dataSource={uploadedRecords} pagination={{ position: ["none", "none"] }} />
                </div>
            }
        </div>
    );
}

export default UploadRecordForm;