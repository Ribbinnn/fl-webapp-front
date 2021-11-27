import React, { useState, useEffect } from "react";
import { Select, Divider, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function Label(props) {
    const [labelList,setLabelList] = useState(props.labelList);
  const [name, setName] = useState("");

  useEffect(() => {
    if (props.labelList.length > 0) {
      props.setSelectedLabel(props.labelList[0]);
    }
  }, []);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = () => {
    console.log("addItem");
    if (name !== ""){
        props.setLabelList([...labelList, name])
        setLabelList([...labelList, name])
    };
    setName("")
  };

  function handleChange(value) {
    props.setSelectedLabel(value);
    console.log("Label: ", value);
  }

  return (
    <Select
      onChange={handleChange}
      style={{ width: 300 }}
      className="label-selector"
      defaultValue={labelList[0] ?? ""}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: "4px 0" }} />
          <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
            <Input
              className="select-label"
              style={{ flex: "auto" }}
              value={name}
              onChange={onNameChange}
            />
            <a
            className="add-label-btn"
              onClick={addItem}
            >
              <PlusOutlined /> Add Label
            </a>
          </div>
        </div>
      )}
    >
      {labelList.map((item) => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  );
}
