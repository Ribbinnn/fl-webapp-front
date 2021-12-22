import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Select, Spin } from "antd";
import { getAllUsers } from "../api/admin";
import { LoadingOutlined } from '@ant-design/icons';

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

export default function ManageUser(props) {
  const [loaded, setLoaded] = useState(false);
  const [keyword, setKeyword] = useState();

  useEffect(() => {
    setLoaded(false);
    setLoaded(true);
    //load all project to select
  }, [])
  return (
    <div>
      <label style={{ fontWeight: "bold" }}>
        {"Manage User"}
      </label>
      {!loaded && (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <Spin indicator={LoadingIcon} />
          <br />
          <br />
          <span style={{ fontSize: "medium", color: "#de5c8e" }}>
            Loading ...
          </span>
        </div>
      )}
      {loaded && (
        <div style={{ marginTop: "30px" }}>
          <div>
            <div>
              <label> Project Name </label>
            </div>
            <Select
              className="search-component wider"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(i, j) => {
                console.log(j);
                setKeyword(j);
                console.log("selected ---> ", i);
              }}
              style={{ width: "243px" }}
            >
            </Select>
          </div>
          <div style={{ marginTop: "30px" }}>
            <label> Users </label>
            <ManageUserTable />
          </div>
        </div>
      )}
    </div>
  )
}

function ManageUserTable(props) {
  const [loaded, setLoaded] = useState(false);
  const [columns, setColumn] = useState();
  const [data, setData] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [defaultRowKeys, setDefaultRowKeys] = useState([]);
  const [keyword, setKeyword] = useState();

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows,
        selectedKeys
      );
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedKeys);
      //console.log(selectedKeys.sort(), defaultRowKeys.sort());
    },
  };

  useEffect(() => {
    setLoaded(false);
    setColumn(
      [
        {
          title: "Username",
          dataIndex: "username",
          key: "username",
          sorter: {
            compare: (a, b) => (a.username).localeCompare(b.username),
          },
        },
        {
          title: "First Name",
          dataIndex: "first_name",
          key: "first_name",
          sorter: {
            compare: (a, b) => (a.first_name).localeCompare(b.first_name),
          },
        },
        {
          title: "Last Name",
          dataIndex: "last_name",
          key: "last_name",
          sorter: {
            compare: (a, b) => (a.last_name).localeCompare(b.last_name),
          },
        },
        {
          title: "Role",
          dataIndex: "role",
          key: "role",
          sorter: {
            compare: (a, b) => (a.role).localeCompare(b.role),
          },
        }
      ]
    )
    getAllUsers().then((res) => {
      res = res.filter(i => i.role !== 'admin')
      res = res.map((item, i) => {
        item.key = i;
        return item
      })
      setData(res)
      setLoaded(true);
    }).catch((err) => {
      console.log(err.response)
      setLoaded(true);
    });
  }, [])
  return (
    <div>
      {!loaded && (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <Spin indicator={LoadingIcon} />
          <br />
          <br />
          <span style={{ fontSize: "medium", color: "#de5c8e" }}>
            Loading ...
          </span>
        </div>
      )}
      {loaded && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Table
              className="report-table"
              rowSelection={{
                ...rowSelection,
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
              style={{ width: '48%' }}
            />
            <Table
              columns={columns}
              dataSource={selectedRows}
              pagination={false}
              size="small"
              style={{ width: '48%' }}
              className="four-rows-table"
            />
          </div>
          <Button
            className="primary-btn"
            style={{marginTop: "30px"}}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  )
}