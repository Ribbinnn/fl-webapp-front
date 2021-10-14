import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./layout/NavBar";
import Header from "./layout/Header";
import UploadRecord from "./record/UploadRecord"
import Diagnosis from "./diagnosis/Diagnosis"
import MyRecord from "./record/MyRecord";

import "./layout/LayOut.css";

function Routes() {
  const ViewHistory = () => <h1>This is view history component</h1>;
  return (
    <BrowserRouter>
      <div className={/*if login*/ true ? "layout-ctn" : "layout-ctn-nobg"}>
        {/*if login*/ true && <Header />}
        <div style={{ display: "flex", flexDirection: "row", height: "100%"}}>
          {/*if login*/ true && <NavBar />}
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/record/upload" exact>
              <UploadRecord/>
            </Route>
            <Route path="/record/myrecord" exact>
              <MyRecord />
            </Route>
            <Route path="/diagnosis" exact>
              <Diagnosis/>
            </Route>
            <Route path="/viewhistory" exact>
              {ViewHistory}
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Routes;
