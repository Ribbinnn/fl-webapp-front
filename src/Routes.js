import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./NavBar";
import Header from "./Header";

import "./LayOut.css";

function Routes() {
  const MyRecord = () => <h1>This is my record component</h1>;
  const Upload = () => <h1>This is upload record component</h1>;
  const Diagnosis = () => <h1>This is diagnosis component</h1>;
  const ViewHistory = () => <h1>This is view history component</h1>;
  return (
    <BrowserRouter>
      <div className="layout-ctn">
        {/*if login*/ true && <Header />}
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/*if login*/ true && <NavBar />}
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/record/upload" exact>
              {Upload}
            </Route>
            <Route path="/record/myrecord" exact>
              {MyRecord}
            </Route>
            <Route path="/diagnosis" exact>
              {Diagnosis}
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
