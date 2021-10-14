import React, { useState } from "react";
import { Button, Form, Input, Select, DatePicker } from "antd";
const { Option } = Select;

function MyRecord () {
    const [Project, setProject] = useState("none");
    const itemList = /* []call api get all project* */[
        {
          ProjectName: "COVID-19",
          Task: "2D Classfication",
          Classes: ["normal", "COVID-19"],
          Description: "COVID-19 Evaluation from CXR and vital signs",
          Requirement: ["Pulse rate", "Blood Pressure", "Temperature"],
        },
        {
          ProjectName: "Pylon",
          Task: "2D Classfication",
          Classes: ["normal", "Tubercolosis"],
          Description: "P'Plot Model",
          Requirement: [],
        },
      ]; 

    function handleChange(value) {
        setProject(itemList[value])
    }

    function onChange(value) {

    }

    return (
        <div className="content">
            <Form layout="inline">
                
                <Form.Item label="File Name" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <Input className="input-text" />
                </Form.Item>
                <Form.Item label="Project" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>                
                    <Select onChange={handleChange}>
                        {itemList.map((item, i) => (
                        <Option key={i} value={i}>
                            {item.ProjectName}
                        </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="From" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <DatePicker className="date-picker" onChange={onChange} />
                </Form.Item>
                <Form.Item label="To" style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                    <DatePicker onChange={onChange} />
                </Form.Item>
            </Form>
        </div>
    )
}

export default MyRecord