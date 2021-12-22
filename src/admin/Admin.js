import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import UserForm from "./UserForm";
import ProjectForm from "./ProjectForm";
import DeleteForm from "./DeleteForm";
import ManageUser from "./ManageUser";

const { SubMenu } = Menu;

function Admin() {
    const history = useHistory();
    const { mode } = useParams();
    const [current, setCurrent] = useState(mode ? mode : "");
    const renderComponent = () => {
        switch(mode) {
            case "createuser":
                return <UserForm />;
            case "edituser":
                return <UserForm />;
            case "deleteuser":
                return <DeleteForm mode="user"/>;
            case "createproject":
                return <ProjectForm />;
            case "editproject":
                return <ProjectForm />;
            case "manageuser":
                return <ManageUser/>;
            case "deleteproject":
                return <DeleteForm mode="project"/>;
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
                    <Menu.Item 
                        key="deleteuser" 
                        style={{color: "#E9C869", fontWeight: "bold"}} 
                        onClick={() => history.push("/admin/deleteuser")}
                    >
                        Delete User
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="project"
                    icon={<SettingOutlined />}
                    title="Project Setting"
                >
                    <Menu.Item key="createproject" onClick={() => history.push("/admin/createproject")}>Create Project</Menu.Item>
                    <Menu.Item key="editproject" onClick={() => history.push("/admin/editproject")}>Edit Project</Menu.Item>
                    <Menu.Item key="manageuser" onClick={() => history.push("/admin/manageuser")}>Manage User</Menu.Item>
                    <Menu.Item 
                        key="deleteproject" 
                        style={{color: "#E9C869", fontWeight: "bold"}} 
                        onClick={() => history.push("/admin/deleteproject")}
                    >
                        Delete Project
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <div style={{padding: mode === "createproject" || mode === "editproject" ? "30px 0 0 20px" : "30px 20px"}}>
                {renderComponent()}
            </div>
        </div>
    );
}

export default Admin;