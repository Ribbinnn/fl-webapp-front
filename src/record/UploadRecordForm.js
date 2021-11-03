import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Button, Input, Table, Modal } from "antd";
import { CloudDownloadOutlined, WarningOutlined } from '@ant-design/icons';
import XLSX from "xlsx";
import { uploadVitalsRecord, downloadTemplate } from "../api/vitals";

const UploadRecordForm = forwardRef((props, ref) => {

    const required_field = ["entry_id", "hn", "gender", "age"]; // required in every project

    const [uploadedRecordName, setUploadedRecordName] = useState({with_ext: null, without_ext: null});
    const [uploadedRecord ,setUploadedRecord] = useState({with_key: null, without_key: null});
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

    const [visible,setVisible] = useState(false)
    const showModal = () => {
        setVisible(true)
    };

    const handleCancel = () => {
        setVisible(false)
    };

    useImperativeHandle(ref, () => ({
        uploadRecord: () => {
            if (uploadedRecord.without_key !== null) {
                uploadVitalsRecord(
                    props.project.ProjectName,
                    (JSON.parse(sessionStorage.getItem('user'))).id,
                    uploadedRecordName.without_ext,
                    uploadedRecord.without_key
                )
                .then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                // alert("Please upload record.")
                showModal();
            }
        },
        uploadedRecord: uploadedRecord.without_key,
    }));

    async function handleUploadedFile(event) {
        // add additional required field of each project
        for (const i in props.project.Requirement) {
            if (!required_field.includes(props.project.Requirement[i]["name"])) {
                required_field.push(props.project.Requirement[i]["name"]);
            }
        }
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
            setUploadedRecord({with_key: null, without_key: null});
        } else {
            setMissingField(null);
            setUploadedRecordName({
                with_ext: event.target.files[0].name, 
                without_ext: event.target.files[0].name.split(".")[0]});
            // create columns for table
            let column_list = (uploaded_field).map((column) => ({
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
            setColumns(column_list);
            // convert file to json
            const data = XLSX.utils.sheet_to_json(target_workbook);
            // add key to each row
            const data_with_key = JSON.parse(JSON.stringify(data));
            for (const i in data_with_key) {
                data_with_key[i]["key"] = (parseInt(i)+1).toString();
            }
            setUploadedRecord({with_key: data_with_key, without_key: data});
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
                    {uploadedRecord.with_key ? uploadedRecordName.with_ext : null}
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
            {uploadedRecord.with_key && 
                <div>
                    <label style={{display: "block"}}>Preview</label>
                    <label>Record name:</label>
                    <Input 
                        className="input-text" 
                        style={{maxWidth: "300px", marginLeft: "10px", marginBottom: "10px"}}
                        value={uploadedRecordName.without_ext}
                        onChange={(event) => {
                            setUploadedRecordName({...uploadedRecordName, without_ext: event.target.value});
                        }} />
                </div>}
            {uploadedRecord.with_key &&
                <Table 
                    columns={columns} 
                    dataSource={uploadedRecord.with_key} 
                    pagination={false} 
                    size="small"
                    className="three-rows-table"
                />}
            <Modal
                visible={visible}
                title={null}
                onCancel={handleCancel}
                footer={null}>
                    Please upload record.
            </Modal>
        </div>
    );
});

export default UploadRecordForm;