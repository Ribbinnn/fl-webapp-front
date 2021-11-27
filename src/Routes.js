import React, {useState, useContext} from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./layout/NavBar";
import Header from "./layout/Header";
import UploadRecord from "./record/UploadRecord"
import Diagnosis from "./diagnosis/Diagnosis"
import MyRecord from "./record/MyRecord";
import Report from "./view history/Report";
import ViewHistory from "./view history/ViewHistory";
import Auth from "./Auth";
import { updateToken } from "./api";

import "./layout/LayOut.css";
import ProjectInfo from "./component/ProjectInfo";
import Contexts from "./utils/Contexts";

function Routes() {

  const [globalProject, setGlobalProject] = useState({
    "projectId": JSON.parse(sessionStorage.getItem('project'))?(JSON.parse(sessionStorage.getItem('project'))).projectId:"", 
    "projectName": JSON.parse(sessionStorage.getItem('project'))?JSON.parse(sessionStorage.getItem('project')).projectName:"No selected project",
    "projectReq": JSON.parse(sessionStorage.getItem('project'))?JSON.parse(sessionStorage.getItem('project')).projectReq:[]
  })
  const value = {globalProject, setGlobalProject}

  if (localStorage.getItem('auth') === 'true') {
    sessionStorage.setItem("token", localStorage.getItem('token'));
    sessionStorage.setItem("user", localStorage.getItem('user'));
    sessionStorage.setItem("auth", true);
    updateToken()
  }

  const auth = sessionStorage.getItem('auth') === 'true' ? true : false;

  // if already login, redirect to home. if not, show login page
  return (
    <BrowserRouter>
      <Contexts.project.Provider value={value}>
        <div className={auth ? "layout-ctn" : "layout-ctn-nobg"}>
          {auth && <Header />}
          <div style={{ display: "flex", flexDirection: "row", height: "100%"}}>
            {auth && <NavBar />}
            <Switch>
              <Route path="/" exact render={()=>(auth?<Home/>:<Redirect to='/login'/>)}/>
              <Route path="/record/upload" exact render={()=>(auth&&globalProject.projectId?<UploadRecord/>: !auth?<Redirect to='/login'/>:<Redirect to='/'/>)}/>
              <Route path="/record/myrecord" exact render={()=>(auth&&globalProject.projectId?<MyRecord/>:!auth?<Redirect to='/login'/>:<Redirect to='/'/>)}/>
              <Route path="/diagnosis" exact render={()=>(auth&&globalProject.projectId?<Diagnosis/>:!auth?<Redirect to='/login'/>:<Redirect to='/'/>)}/>
              <Route path="/viewhistory" exact render={()=>(auth&&globalProject.projectId?<ViewHistory/>:!auth?<Redirect to='/login'/>:<Redirect to='/'/>)}/>
              <Route path="/viewhistory/:mode/:rid" exact render={()=>(auth&&globalProject.projectId?<Report/>:!auth?<Redirect to='/login'/>:<Redirect to='/'/>)}/>
              <Route path="/login" render={()=>(auth?<Redirect to='/'/>:<Login/>)}/>
              <Route path="/auth" render={()=>(<Auth />)}/>
            </Switch>
          </div>
        </div>
      </Contexts.project.Provider>
    </BrowserRouter>
  );
}

export default Routes;
