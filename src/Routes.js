import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import NavBar from "./layout/NavBar";
import Header from "./layout/Header";
import UploadRecord from "./record/UploadRecord";
import Diagnosis from "./diagnosis/Diagnosis";
import MyRecord from "./record/MyRecord";
import Report from "./view history/Report";
import ViewHistory from "./view history/ViewHistory";
import Admin from "./admin/Admin";
import Auth from "./Auth";
import PageNotFound from "./PageNotFound";
import { updateToken } from "./api";

import "./layout/LayOut.css";
import Contexts from "./utils/Contexts";
import BatchDiagnosis from "./diagnosis/BatchDiagnosis";

function Routes() {
  const [globalProject, setGlobalProject] = useState({
    projectId: JSON.parse(sessionStorage.getItem("project"))
      ? JSON.parse(sessionStorage.getItem("project")).projectId
      : "",
    projectName: JSON.parse(sessionStorage.getItem("project"))
      ? JSON.parse(sessionStorage.getItem("project")).projectName
      : "No selected project",
    projectReq: JSON.parse(sessionStorage.getItem("project"))
      ? JSON.parse(sessionStorage.getItem("project")).projectReq
      : [],
    projectHead: JSON.parse(sessionStorage.getItem("project"))
      ? JSON.parse(sessionStorage.getItem("project")).projectHead
      : [],
  });

  const [currentActivity, setCurrentActivity] = useState({});

  const value = {
    project: {
      globalProject: globalProject,
      setGlobalProject: setGlobalProject,
    },
    active: {
      currentActivity: currentActivity,
      setCurrentActivity: setCurrentActivity,
    },
  };

  if (localStorage.getItem("auth") === "true") {
    sessionStorage.setItem("token", localStorage.getItem("token"));
    sessionStorage.setItem("user", localStorage.getItem("user"));
    sessionStorage.setItem("auth", true);
    updateToken();
  }

  const auth = sessionStorage.getItem("auth") === "true" ? true : false;

  // if already login, redirect to home. if not, show login page
  return (
    <BrowserRouter>
      <Contexts.Provider value={value}>
        <div className={auth ? "layout-ctn" : "layout-ctn-nobg"}>
          {auth && <Header />}
          <div
            style={{ display: "flex", flexDirection: "row", height: "100%" }}
          >
            {auth && <NavBar />}
            <Switch>
              <Route
                path="/"
                exact
                render={() => (auth ? <Home /> : <Redirect to="/login" />)}
              />
              <Route
                path="/record/upload"
                exact
                render={() =>
                  auth && globalProject.projectId ? (
                    <UploadRecord />
                  ) : !auth ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/record/myrecord"
                exact
                render={() =>
                  auth && globalProject.projectId ? (
                    <MyRecord />
                  ) : !auth ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/diagnosis/individual"
                exact
                render={() =>
                  auth && globalProject.projectId ? (
                    <Diagnosis mode="individual" />
                  ) : !auth ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/diagnosis/batch"
                exact
                render={() =>
                  auth && globalProject.projectId ? (
                    globalProject.projectReq.length ? (
                      <Redirect to="/diagnosis/individual" />
                    ) : (
                      <BatchDiagnosis />
                    )
                  ) : !auth ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/viewhistory"
                exact
                render={() =>
                  auth && globalProject.projectId ? (
                    <ViewHistory />
                  ) : !auth ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/viewhistory/:mode/:rid"
                exact
                render={() =>
                  auth && globalProject.projectId ? (
                    <Report />
                  ) : !auth ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/admin"
                exact
                render={() => (auth ? <Admin /> : <Redirect to="/login" />)}
              />
              <Route
                path="/admin/:mode"
                exact
                render={() => (auth ? <Admin /> : <Redirect to="/login" />)}
              />
              <Route
                path="/login"
                render={() => (auth ? <Redirect to="/" /> : <Login />)}
              />
              <Route path="/auth" render={() => <Auth />} />
              <Route
                render={() => (auth ? <PageNotFound /> : <Redirect to="/" />)}
              />
            </Switch>
          </div>
        </div>
      </Contexts.Provider>
    </BrowserRouter>
  );
}

export default Routes;
