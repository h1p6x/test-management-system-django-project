import "./App.css";
import AppFooter from "./components/AppFooter/AppFooter";
import AppHeader from "./components/AppHeader/AppHeader";
import SideMenu from "./components/SideMenu/SideMenu";
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/Loginpage";
import PrivateRoute from "./utils/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import React from "react";
import Projects from "./pages/Projects";
import TestSuits from "./pages/TestSuits";
import TestCases from "./pages/TestCases";
import TestRuns from "./pages/TestRuns";
import GetProjectsInfoByid from "./utils/GetProjectsInfoByid";
import GetSuitInfoById from "./utils/GetSuitInfoById";
import GetTestRunsResult from "./utils/GetTestRunsResult";
import GetCaseInfoById from "./utils/GetCaseInfoById";
import GetTestRunResultForTestCase from "./utils/GetTestRunResultForTestCase";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <Dashboard></Dashboard>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <Projects></Projects>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects/:projectId"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                {/*<Projects></Projects>*/}
                                <GetProjectsInfoByid></GetProjectsInfoByid>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects/:projectId/testsuits/:testSuitId"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <GetSuitInfoById></GetSuitInfoById>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects/:projectId/testsuits/:testSuitId/testcase/:testCaseId"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <GetCaseInfoById></GetCaseInfoById>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects/:projectId/testruns/:testRunId"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <GetTestRunsResult></GetTestRunsResult>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects/:projectId/testruns/:testRunId/testrunresult/:testCaseId"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <GetTestRunResultForTestCase></GetTestRunResultForTestCase>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/testsuits"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <TestSuits></TestSuits>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/testcases"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <TestCases></TestCases>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/testruns"
                    element={
                        <PrivateRoute>
                            <AppHeader/>
                            <div className="SideMenuAndPageContent">
                                <SideMenu></SideMenu>
                                <TestRuns></TestRuns>
                            </div>
                            <AppFooter/>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;