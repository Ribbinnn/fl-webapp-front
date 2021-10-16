import React, { useState } from "react";
import { Button, Table } from "antd";
import { CloudDownloadOutlined } from '@ant-design/icons';

function UploadRecordForm() {

    const [filename, setFilename] = useState("filename.xlsx");

    const uploadedRecords = []; // get from uploaded file > map
    for (let i = 1; i <= 50; i++) {
        uploadedRecords.push({
            key: i,
            hn: i,
            age: 28,
            gender: "F",
            pulse_rate: 77,
            blood_pressure: "120/80",
            temperature: 36.7,
        });
      }

    const columns = [ // get from project > map
        {
            title: "HN",
            dataIndex: "hn",
            key: "hn",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        },
        {
            title: "Pulse rate",
            dataIndex: "pulse_rate",
            key: "pulse_rate",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        },
        {
            title: "Blood pressure",
            dataIndex: "blood_pressure",
            key: "blood_pressure",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        },
        {
            title: "Temperature",
            dataIndex: "temperature",
            key: "temperature",
            align: "center",
            ellipsis: {
                showTitle: true
            },
        }
    ];

    return(
        <div className="upload-record-form">
            <label style={{display: "block"}}>Medical Records</label>
            <a 
                style={{color: "#de5c8e", display: "flex", alignItems: "center"}}
                onClick={() => {
                    /* call download template api */
                }}>
                    Download Template
                    <CloudDownloadOutlined style={{marginLeft: "5px"}} />
            </a>
            <div style={{margin: "8px 0 20px 30px"}}>
                <Button 
                    type="primary" 
                    className="primary-btn smaller" 
                    onClick={() => {
                        /* call upload file api */
                    }}>
                        Upload
                </Button>
                <label style={{marginLeft: "20px"}}>{filename}</label>
                <label id="smaller-label" style={{display: "block", color: "#de5c8e", margin: "8px 0 0 10px"}}>
                    *accepted file type: .xlsx, .csv
                </label>
            </div>
            {uploadedRecords &&
                <div>
                    <label style={{display: "block", marginBottom: "20px"}}>Preview</label>
                    <Table 
                        columns={columns} 
                        dataSource={uploadedRecords} 
                        pagination={false} 
                        size="small"
                    />
                </div>}
        </div>
    );
}

export default UploadRecordForm;