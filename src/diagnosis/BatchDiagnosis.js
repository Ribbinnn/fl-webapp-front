import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Table, Tooltip, Spin, Form, DatePicker, TimePicker, Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getPatientData } from "../api/pacs"
import ImageModal from "../component/ImageModal";
import * as moment from "moment";
import Contexts from '../utils/Contexts';

export default function BatchDiagnosis(props){
    return (
        <div>
            <label> Select X-Ray Images by Study Date Time </label>
            <Form layout="inline" style={{marginBottom: "5px"}}>
                <Form.Item
                    name="from"
                    label="From"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >   
                    <DatePicker
                        // defaultValue={props.fromDate ? moment(props.fromDate) : null}
                        // onChange={(date) => {
                        //     props.setFromDate(date? date.startOf('day').toDate(): null) // Moment Object
                        // }}
                        style={{width:"200px"}} />
                    <TimePicker style={{width:"130px", marginLeft:"5px"}}/>
                </Form.Item>
                <Form.Item
                    name="to"
                    label="To"
                    style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}
                >
                    <DatePicker
                        // defaultValue={props.toDate ? moment(props.toDate) : null}
                        // onChange={(date) => {
                        //     props.setToDate(date? date.endOf('day').toDate(): null) // Moment Object
                        // }}
                        style={{width:"200px"}} />
                    <TimePicker style={{width:"130px", marginLeft:"5px"}}/>
                </Form.Item>
                <Form.Item style={{marginLeft:"20px"}}>
                    <Button
                        className="primary-btn smaller"
                        style={{marginTop:"32px"}}
                        // onClick={() => {
                        //     setLoaded(false);
                        //     getPatientData(
                        //         props.HN, 
                        //         props.searchAccNo === null ? "" : props.searchAccNo, 
                        //         props.fromDate === null ? "" : props.fromDate, 
                        //         props.toDate === null ? "" : props.toDate)
                        //     .then((res) => {
                        //         console.log(res);
                        //         if (Object.keys(res.data).length === 0) {
                        //             setTableData([]);
                        //             props.setPacsTableData([]);
                        //             props.setAccessionNoIndex([]);
                        //             props.setAccessionNo(null);
                        //             setLoaded(true);
                        //         } else {
                        //             const data = prepareTable(res.data);
                        //             setTableData(data);
                        //             props.setPacsTableData(data);
                        //             props.setAccessionNoIndex([]);
                        //             props.setAccessionNo(null);
                        //             setLoaded(true);
                        //         }
                        //     }).catch((err) => {
                        //         console.log(err.response);
                        //     })
                        // }}
                        >
                            Search
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}