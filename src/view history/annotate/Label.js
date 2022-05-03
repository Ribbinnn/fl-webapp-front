import React, { useState, useEffect, useRef } from "react";
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook";
import { Select, Divider, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function Label(props) {
  const [labelList, setLabelList] = useState(props.labelList);
  const [name, setName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const selectRef = useRef(null);

  useHotkeys("shift+f", () => {
    // but without timeout,
    // the hotkey will be sent to select input
    setTimeout(() => {
      selectRef.current.focus();
    }, 20);
  });

  useHotkeys(
    "enter",
    () => {
      if (!dropdownOpen) {
        document.getElementById("select-label-ok-button").click();
      }
    },
    {
      filter: () => true,
    },
    []
  );

  useEffect(() => {
    if (props.labelList.length > 0) {
      props.setSelectedLabel(props.labelList[0]);
    }
    setTimeout(() => {
      selectRef.current.focus();
    }, 20);
  }, []);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = () => {
    // console.log("addItem");
    if (name !== "") {
      props.setLabelList([...labelList, name]);
      setLabelList([...labelList, name]);
    }
    setName("");
  };

  function handleChange(value) {
    props.setSelectedLabel(value);
    // console.log("Label: ", value);
  }

  return (
    <Select
      showSearch
      defaultOpen
      ref={selectRef}
      onDropdownVisibleChange={(open) => {
        setDropdownOpen(open);
        // console.log("onDropdownVisibleChange")
      }}
      onChange={handleChange}
      // onSelect={() => {
        // setDropdownOpen(false);
        // selectRef.current.blur();
      // }}
      style={{ width: 300 }}
      className="label-selector"
      defaultValue={props.defaultLabel ?? labelList[0] ?? ""}
      dropdownStyle={{ zIndex: 9999 }}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onInputKeyDown={(evt)=>{
        // console.log(evt)
        if (evt.code ===  "Escape"){
          selectRef.current.blur();
          setDropdownOpen(false);
          document.getElementById("select-label-cancel-button").click();
        }
        if (evt.code === "Enter" && !dropdownOpen){
          selectRef.current.blur();
          document.getElementById("select-label-ok-button").click();
        }
      }}
      /* dropdownRender={(menu) => (
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
      )} */
    >
      {labelList.map((item) => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  );
}
