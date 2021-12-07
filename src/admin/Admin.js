import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

function Admin() { // check admin role
    const history = useHistory();
    const { mode } = useParams();
    const [current, setCurrent] = useState("");
    const renderComponent = () => {
        switch(mode) {
            case "createuser":
                return <label>create user</label>;
            case "edituser":
                return <label>edit user</label>;
            case "deleteuser":
                return <label>delete user</label>;
            case "createproject":
                return <label>create project</label>;
            case "editproject":
                return <label>edit project</label>;
            case "manageuser":
                return <label>manage user</label>;
            case "deleteproject":
                return <label>delete project</label>;
            default:
                return null;
        }
    }
    return(
        <div className="content">
            <Menu
                onClick={(e) => setCurrent(e.key)}
                selectedKeys={[mode ? current : ""]}
                mode="horizontal"
            >
                <SubMenu
                    key="user"
                    icon={<UserOutlined />}
                    title="User Setting"
                >
                    <Menu.Item key="createuser" onClick={() => history.push("/admin/createuser")}>Create User</Menu.Item>
                    <Menu.Item key="edituser" onClick={() => history.push("/admin/edituser")}>Edit User</Menu.Item>
                    <Menu.Item key="deleteuser" onClick={() => history.push("/admin/deleteuser")}>Delete User</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="project"
                    icon={<SettingOutlined />}
                    title="Project Setting"
                >
                    <Menu.Item key="createproject" onClick={() => history.push("/admin/createproject")}>Create Project</Menu.Item>
                    <Menu.Item key="editproject" onClick={() => history.push("/admin/editproject")}>Edit Project</Menu.Item>
                    <Menu.Item key="manageuser" onClick={() => history.push("/admin/manageuser")}>Manage User</Menu.Item>
                    <Menu.Item key="deleteproject" onClick={() => history.push("/admin/deleteproject")}>Delete Project</Menu.Item>
                </SubMenu>
            </Menu>
            <div style={{padding: "25px 20px 20px 20px"}}>
                {renderComponent()}
            </div>
        </div>
    );
}

export default Admin;