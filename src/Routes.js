import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./layout/NavBar";
import Header from "./layout/Header";
import UploadRecord from "./record/UploadRecord"
import Diagnosis from "./diagnosis/Diagnosis"
import MyRecord from "./record/MyRecord";
import { updateToken } from "./api";

import "./layout/LayOut.css";

function Routes() {
  const ViewHistory = () => <div className="content"><h1>This is view history component</h1></div>;

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
      <div className={auth ? "layout-ctn" : "layout-ctn-nobg"}>
        {auth && <Header />}
        <div style={{ display: "flex", flexDirection: "row", height: "100%"}}>
          {auth && <NavBar />}
          <Switch>
            <Route path="/" exact render={()=>(auth?<Home/>:<Redirect to='/login'/>)}/>
            <Route path="/record/upload" exact render={()=>(auth?<UploadRecord/>:<Redirect to='/login'/>)}/>
            <Route path="/record/myrecord" exact render={()=>(auth?<MyRecord/>:<Redirect to='/login'/>)}/>
            <Route path="/diagnosis" exact render={()=>(auth?<Diagnosis/>:<Redirect to='/login'/>)}/>
            <Route path="/viewhistory" exact render={()=>(auth?<ViewHistory/>:<Redirect to='/login'/>)}/>
            <Route path="/login" render={()=>(auth?<Redirect to='/'/>:<Login/>)}/>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Routes;
