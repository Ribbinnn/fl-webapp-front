import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./layout/NavBar";
import Header from "./layout/Header";
import UploadRecord from "./record/UploadRecord"
import Diagnosis from "./diagnosis/Diagnosis"

import "./layout/LayOut.css";

function Routes() {
  const MyRecord = () => <h1>This is my record component</h1>;
  const ViewHistory = () => <h1>This is view history component</h1>;
  //const auth = localStorage.getItem('auth') === 'true' ? true : false;

  // if already login, redirect to home. if not, show login page
  return (
    <BrowserRouter>
      <div className={localStorage.getItem('auth') === 'true' ? "layout-ctn" : "layout-ctn-nobg"}>
        {localStorage.getItem('auth') === 'true' && <Header />}
        <div style={{ display: "flex", flexDirection: "row", height: "100%"}}>
          {localStorage.getItem('auth') === 'true' && <NavBar />}
          <Switch>
            <Route path="/" exact render={()=>(localStorage.getItem('auth') === 'true'?<Home/>:<Redirect to='/login'/>)}/>
            <Route path="/record/upload" exact render={()=>(localStorage.getItem('auth') === 'true'?<UploadRecord/>:<Redirect to='/login'/>)}/>
            <Route path="/record/myrecord" exactrender={()=>(localStorage.getItem('auth') === 'true'?MyRecord:<Redirect to='/login'/>)}/>
            <Route path="/diagnosis" exact render={()=>(localStorage.getItem('auth') === 'true'?<Diagnosis/>:<Redirect to='/login'/>)}/>
            <Route path="/viewhistory" exact render={()=>(localStorage.getItem('auth') === 'true'?ViewHistory:<Redirect to='/login'/>)}/>
            <Route path="/login" render={()=>(localStorage.getItem('auth') === 'true'?<Redirect to='/'/>:<Login/>)}/>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Routes;
