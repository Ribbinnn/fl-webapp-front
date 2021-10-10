import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import Header from "./Header";
import UploadRecord from "./UploadRecord"
import Diagnosis from "./Diagnosis"

import "./LayOut.css";

function Routes() {
  const MyRecord = () => <h1>This is my record component</h1>;
  const Upload = () => <h1>This is upload record component</h1>;
  const ViewHistory = () => <h1>This is view history component</h1>;
  return (
    <BrowserRouter>
      <div className={/*if login*/ false ? "layout-ctn" : "layout-ctn-nobg"}>
        {/*if login*/ false && <Header />}
        <div style={{ display: "flex", flexDirection: "row", height: "100%"}}>
          {/*if login*/ false && <NavBar />}
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/record/upload" exact>
              <UploadRecord/>
            </Route>
            <Route path="/record/myrecord" exact>
              {MyRecord}
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
