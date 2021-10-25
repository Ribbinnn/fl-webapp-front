import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button, Input, Table } from "antd";
import { CloudDownloadOutlined, WarningOutlined } from '@ant-design/icons';
import XLSX from "xlsx";
import { uploadVitalsRecord, downloadTemplate } from "../api/vitals";

const UploadRecordForm = forwardRef((props, ref) => {

    const required_field = ["entry_id", "hn", "gender", "age"]; // required in every project

    useEffect(() => {
        // add additional required field of each project
        for (const i in props.project.Requirement) {
            if (!required_field.includes(props.project.Requirement[i]["name"])) {
                required_field.push(props.project.Requirement[i]["name"]);
            }
        }
    }, []);

    const [uploadedRecordName, setUploadedRecordName] = useState({with_ext: null, without_ext: null});
    const [uploadedRecords ,setUploadedRecords] = useState({with_key: null, without_key: null});
    const [columns, setColumns] = useState(null);

    const [missingField, setMissingField] = useState(null);
    const printMissingField = () => {
        var string = ""
        for (const i in missingField) {
            (i === missingField.length - 1 || missingField.length === 1) ? 
                string += missingField[i] + " " : string += missingField[i] + ", ";
        }
        return <label>{string}</label>;
    }

    useImperativeHandle(ref, () => ({
        uploadRecord: () => {
            uploadVitalsRecord(
                props.project.ProjectName,
                (JSON.parse(sessionStorage.getItem('user'))).id,
                uploadedRecordName.without_ext,
                uploadedRecords.without_key
            )
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })
        }
    }));

    async function handleUploadedFile(event) {
        // read file
        const data = await event.target.files[0].arrayBuffer();
        const workbook = XLSX.read(data);
        const target_workbook = workbook.Sheets[workbook.SheetNames[0]];
        // change field name to lowercase
        const uploaded_field = [];
        const last_char = target_workbook["!ref"].split(":")[1].charAt(0).charCodeAt(0);
        var current_char = "A".charCodeAt(0);
        var change_field = "";
        event.target.files[0].name.split(".")[1] === "xlsx" ? change_field = "w" : change_field = "v";
        while (current_char <= last_char) {
            var column_name = target_workbook[String.fromCharCode(current_char) + "1"];
            column_name[change_field] = column_name[change_field].split(" ").join("_").toLowerCase();
            uploaded_field.push(column_name[change_field]);
            current_char++;
        }
        // check if uploaded file has all required fields
        const missing_field = [];
        for (const i in required_field) {
            if (!uploaded_field.includes(required_field[i])) {
                missing_field.push(required_field[i]);
            }
        }
        if (missing_field.length !== 0) {
            setMissingField(missing_field);
            setUploadedRecordName({with_ext: null, without_ext: null});
            setColumns(null);
            setUploadedRecords({with_key: null, without_key: null});
        } else {
            setMissingField(null);
            setUploadedRecordName({
                with_ext: event.target.files[0].name, 
                without_ext: event.target.files[0].name.split(".")[0]});
            // create columns for table
            const columns_set = [];
            for (const i in uploaded_field) {
                var title;
                if (uploaded_field[i] === "hn") {
                    title = uploaded_field[i].toUpperCase();
                } else {
                    title = uploaded_field[i].charAt(0).toUpperCase() + uploaded_field[i].slice(1).split("_").join(" ");
                }
                columns_set.push({
                    title: title,
                    dataIndex: uploaded_field[i],
                    key: uploaded_field[i],
                    align: "center",
                    ellipsis: {
                        showTitle: true
                    },
                });
            }
            setColumns(columns_set);
            // convert file to json
            const data = XLSX.utils.sheet_to_json(target_workbook);
            // add key to each row
            const data_with_key = JSON.parse(JSON.stringify(data));
            for (const i in data_with_key) {
                data_with_key[i]["key"] = (parseInt(i)+1).toString();
            }
            setUploadedRecords({with_key: data_with_key, without_key: data});
        }
    }

    return(
        <div className="upload-record-grid">
            <label style={{display: "block"}}>Medical Records</label>
            <label 
                style={{color: "#de5c8e", display: "flex", alignItems: "center"}}
                className="clickable-label"
                onClick={() => {
                    downloadTemplate(props.project.ProjectName).then((res) => {
                        console.log(res)
                        const url = window.URL.createObjectURL(res)
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `template.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }).catch((e) => {
                        console.log(e)
                    })
                }}>
                    Download Template
                    <CloudDownloadOutlined style={{marginLeft: "5px"}} />
            </label>
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
                                handleUploadedFile(event);
                            }} />
                </Button>
                <label style={{marginLeft: "20px"}}>
                    {uploadedRecords.with_key ? uploadedRecordName.with_ext : null}
                </label>
                <label id="smaller-label" style={{display: "block", color: "#de5c8e", margin: "8px 0 0 10px"}}>
                    *accepted file type: .xlsx, .csv
                </label>
            </div>
            {missingField &&
                <div className="upload-record-grid">
                    <label style={{display: "flex", alignItems: "center"}}>
                        <WarningOutlined style={{marginRight: "5px"}} />
                        Some fields are missing!
                    </label>
                    <label style={{display: "block", marginLeft: "30px", color: "#de5c8e"}}>
                        Missing Field: {printMissingField()}
                    </label>
                    <label>Please upload new file with all required fields.</label>
                </div>}
            {uploadedRecords.with_key && 
                <div>
                    <label style={{display: "block", marginBottom: "5px"}}>Preview</label>
                    <label>Record name:</label>
                    <Input 
                        className="input-text" 
                        style={{maxWidth: "300px", marginLeft: "10px", marginBottom: "10px"}}
                        value={uploadedRecordName.without_ext}
                        onChange={(event) => {
                            setUploadedRecordName({...uploadedRecordName, without_ext: event.target.value});
                        }} />
                </div>}
            {uploadedRecords.with_key &&
                <Table 
                    columns={columns} 
                    dataSource={uploadedRecords.with_key} 
                    pagination={false} 
                    size="small"
                    className="three-rows-table"
                />}
        </div>
    );
});

export default UploadRecordForm;