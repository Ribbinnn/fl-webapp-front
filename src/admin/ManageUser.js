import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Select, Spin } from "antd";
import { getAllUsers, manageUser } from "../api/admin";
import { getAllProjects, getProjectInfoByID } from "../api/project";
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;

const LoadingIcon = (
  <LoadingOutlined style={{ fontSize: 50, color: "#de5c8e" }} spin />
);

export default function ManageUser(props) {
  const [loaded, setLoaded] = useState(false);
  const [projectList, setProjectList] = useState({});
  const [project, setProject] = useState("")
  const [users, setUsers] = useState();
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    setLoaded(false);
    getAllProjects()
      .then((res) => {
        // console.log(res);
        setProjectList(res);
        getAllUsers().then((res) => {
          res = res.filter(i => i.role !== 'admin')
          setUsers(res.map((item, i) => {
            item.key = i;
            return item
          }))
          setLoaded(true);
        }).catch((err) => {
          console.log(err.response)
        });
      }).catch((err) => {
        console.log(err.response);
      });
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
              optionFilterProp="label"
              onChange={(id) => {
                getProjectInfoByID(id).then((res) => {
                  let head = res.data.head.map(item => item._id)
                  res.data.head = head
                  setProject(res.data)
                  setSubmit(false);
                }).catch((err) => {
                  console.log(err)
                })
              }}
            >
              {projectList.map((project, i) => {
                let projectHead = "";
                for (const i in project.head) {
                  if (parseInt(i) + 1 === project.head.length) {
                    projectHead += project.head[i].username;
                  } else {
                    projectHead += project.head[i].username + ", ";
                  }
                }
                return (
                  <Option key={i} value={project["_id"]} label={project.name}>
                    {<div className="select-item-group">
                      <label>{project.name}</label>
                      <br />
                      <label style={{ fontSize: "small" }}>{projectHead}</label>
                    </div>}
                  </Option>
                );
              })}
            </Select>

          </div>
          <div style={{ marginTop: "30px" }}>
            {(project && !submit) && <ManageUserTable project={project} users={users} setSubmit={setSubmit} />}
          </div>
        </div>
      )}
    </div>
  )
}

function ManageUserTable(props) {
  const [selectedRows, setSelectedRows] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedUserKeys, setSelectedUserKeys] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])

  const columns = [
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

  const userTableColumns = [...columns, {
    title: "Note",
    dataIndex: "note",
    key: "note",
    sorter: {
      compare: (a, b) => (a.note).localeCompare(b.note),
    },
  }]

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows,
      //   selectedKeys
      // );
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedKeys);

      const headUsers = props.users.filter(user => props.project.head.includes(user._id));
      setSelectedUsers([...headUsers, ...selectedRows])
      setSelectedUserKeys([...props.project.head, ...selectedKeys])
      //console.log(selectedKeys.sort(), defaultRowKeys.sort());
    },
  };

  useEffect(() => {
    const userList = props.users.filter(user => !props.project.head.includes(user._id))
    userList.map(item => {
      item.note = '-'
      return item
    });
    setAllUsers(userList)

    const defaultSelectedRow = userList.filter(user => props.project.users.includes(user._id));
    setSelectedRows(defaultSelectedRow)
    setSelectedRowKeys(defaultSelectedRow.map(item => item.key))

    const headUsers = props.users.filter(user => props.project.head.includes(user._id));
    headUsers.map(item => {
      item.note = 'head'
      return item
    });
    setSelectedUsers([...headUsers, ...defaultSelectedRow])
    setSelectedUserKeys([...props.project.head, ...defaultSelectedRow.map(item => item._id)])
  }, [props])

  return (
    <div>
      <label> Users </label>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Table
          className="report-table"
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={allUsers}
          pagination={false}
          style={{ width: '48%' }}
        />
        <Table
          columns={userTableColumns}
          dataSource={selectedUsers}
          pagination={false}
          size="small"
          style={{ width: '48%' }}
          className="four-rows-table"
        />
      </div>
      <Button
        className="primary-btn"
        style={{ marginTop: "30px" }}
        onClick={() => {
          const userList = [...props.project.head, ...selectedRows.map(item => item._id)]
          manageUser(props.project._id, userList).then((res => {
            Modal.success({ content: "Manage user successfully." });
          })).catch(err => console.log(err))
          props.setSubmit(true)
        }}
      >
        Submit
      </Button>
    </div>
  )
}