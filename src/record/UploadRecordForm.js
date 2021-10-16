import React, { useState } from "react";
import { Button, Input, Table } from "antd";
import { CloudDownloadOutlined } from '@ant-design/icons';

function UploadRecordForm() {

    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState("");

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
                    // maybe generate from field list (json to csv)
                }}>
                    Download Template
                    <CloudDownloadOutlined style={{marginLeft: "5px"}} />
            </a>
            <div style={{margin: "8px 0 20px 30px"}}>
                <Button 
                    type="primary" 
                    className="primary-btn smaller" 
                    onClick={() => {
                        document.getElementById("input-file").click();
                    }}>
                        Upload
                        <input 
                            type="file" 
                            id="input-file" 
                            accept=".xlsx, .csv" 
                            hidden 
                            onChange={(event) => {
                                // console.log(event.target.files[0]);
                                setUploadedFile(event.target.files[0]);
                                const name = event.target.files[0].name.split(".");
                                setUploadedFileName(name[0]);
                                /* call upload file api */
                            }} />
                </Button>
                <label style={{marginLeft: "20px"}}>
                    {uploadedFile ? uploadedFile.name : null}
                </label>
                <label id="smaller-label" style={{display: "block", color: "#de5c8e", margin: "8px 0 0 10px"}}>
                    *accepted file type: .xlsx, .csv
                </label>
            </div>
            {uploadedFile && 
                <div>
                    <label style={{display: "block", marginBottom: "5px"}}>Preview</label>
                    <label>Record name:</label>
                    <Input 
                        className="input-text" 
                        style={{width: "300px", marginLeft: "10px", marginBottom: "10px"}}
                        value={uploadedFileName}
                        onChange={(event) => {
                            setUploadedFileName(event.target.value)
                        }} />
                </div>}
            {uploadedFile &&
                <Table 
                    columns={columns} 
                    dataSource={uploadedRecords} 
                    pagination={false} 
                    size="small"
                />}
        </div>
    );
}

export default UploadRecordForm;