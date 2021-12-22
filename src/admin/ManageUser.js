import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal } from "antd";
import { getAllUsers } from "../api/admin";

export default function ManageUser(props) {
    const [columns, setColumn] = useState();
    const [data, setData] = useState();
    const [selectedRows, setSelectedRows] = useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [defaultRowKeys, setDefaultRowKeys] = useState([]);

    const rowSelection = {
        type: "checkbox",
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
          /* console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          ); */
          setSelectedRows(selectedRows);
          setSelectedRowKeys(selectedKeys);
          //console.log(selectedKeys.sort(), defaultRowKeys.sort());
          if (selectedKeys.sort() !== defaultRowKeys.sort()) {
            //setBtnGroup("save");
          }
        },
      };

    useEffect(() => {
        setColumn(
            [
                {
                  title: "Username",
                  dataIndex: "username",
                  key: "username",
                  sorter: {
                    compare: (a, b) => a.class.localeCompare(b.class),
                  },
                },
                {
                  title: "First Name",
                  dataIndex: "first_name",
                  key: "first_name",
                  sorter: {
                    compare: (a, b) => a.confidence - b.confidence,
                  },
                },
                {
                    title: "Last Name",
                    dataIndex: "last_name",
                    key: "last_name",
                    sorter: {
                      compare: (a, b) => a.confidence - b.confidence,
                    },
                  },
                  {
                    title: "Role",
                    dataIndex: "role",
                    key: "role",
                    sorter: {
                      compare: (a, b) => a.confidence - b.confidence,
                    },
                  }
              ]
        )
        getAllUsers().then((res)=>setData(res)).catch((err) => console.log(err.response));
        //load all project to select
    }, [])
    return(
        <div>
            {
                <div>
                    <label> Users </label>
        <Table
          className="report-table"
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        </div>
      }
        </div>
    )
}