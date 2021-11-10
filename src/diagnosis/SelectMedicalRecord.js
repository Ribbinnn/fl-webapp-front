import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Input, Form, Table } from "antd";
import { getAllRecordsByHN } from "../api/vitals"

const SelectMedicalRecord = forwardRef((props, ref) => {

    const [hasRecord, setHasRecord] = useState();
    const [requirementForm] = Form.useForm();
    const [requirementInput, setRequirementInput] = useState(null);

    useImperativeHandle(ref, () => ({
        setMedicalRecord: async () => {
            try {
                const data = await requirementForm.validateFields();
                // props.setMedRec(data + other fields?);
                await props.setCurrent(props.current + 1);
            } catch (errInfo) {
                console.log('Validate Failed:', errInfo);
            }
        },
    }));

    useEffect(() => {
        getAllRecordsByHN(props.HN)
        .then((res) => {
            console.log(res);
            if (res.data.length !== 0) {
                setHasRecord(true);
            } else {
                setHasRecord(false);
                let requirement_input = (props.project.Requirement).map((field) => 
                    <Form.Item
                        name={field.name}
                        key={field.name}
                        label={field.name.charAt(0).toUpperCase() + field.name.slice(1).split("_").join(" ")}
                        style={{marginBottom: "5px"}}
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <Input className="input-text" style={{width: "300px"}} />
                    </Form.Item>
                );
                setRequirementInput(requirement_input);
            }
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    return(
        <div>
            <label style={{marginBottom: "10px"}}>Medical Records</label>
            {hasRecord ?
                <div>
                    <label>table</label>
                </div> :
                <div style={{marginLeft: "40px"}}>
                    <label style={{marginBottom: "12px"}}>No record found. Please fill in the boxes below.</label>
                    <Form 
                        form={requirementForm} 
                        layout="vertical" 
                        requiredMark={false}
                        className="smaller-form-label">
                            {requirementInput}
                    </Form>
                </div>}
        </div>
    );
});

export default SelectMedicalRecord;