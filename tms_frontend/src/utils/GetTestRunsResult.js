import React, {useContext, useEffect, useState} from 'react';
import AuthContext from "../context/AuthContext";
import {Breadcrumb, Space, theme} from "antd";
import {getRunResultForTestCase, getTestCaseForProject, getTestRunsTestCaseForTestRun} from "../API/API";
import {useParams} from "react-router-dom";
import TestRunResultForTestRunTable from "./TestRunResultForTestRunTable";

function GetTestRunsResult(props) {

    let {authTokens} = useContext(AuthContext);
    const [testRunTestCase, setTestRunTestCase] = useState([]);
    const [testCaseForProject, setTestCaseForProject] = useState([
        {value: '', label: '', priority: ''}
    ]);
    const [testRunResultFromTestCase, setTestRunResultFromTestCase] = useState([
        {value: '', status: '', user: '', comment: '', trrDate: ''}
    ]);
    const [loading, setLoading] = useState(false);
    const {projectId, testRunId} = useParams();

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [testRunRes, testCaseRes] = await Promise.all([
                    getTestRunsTestCaseForTestRun({authTokens, projectId, testRunId}),
                    getTestCaseForProject({authTokens, projectId})
                ]);
                setTestRunTestCase(testRunRes);
                const newTestCase = testCaseRes.results.map((object) => {
                    return {value: object.id, label: object.title, priority: object.priority}
                });
                setTestCaseForProject([...newTestCase]);
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
            setLoading(false);
        }
        fetchData();
    }, [authTokens, projectId, testRunId]);

    useEffect(() => {
        const updateTestRunResultFromTestCase = async () => {
            if (testRunTestCase.length > 0) {
                const promises = testRunTestCase.map(async (item) => {
                    const res = await getRunResultForTestCase({
                        authTokens,
                        projectId,
                        testRunId,
                        testRunTestCase: item.testCase
                    });
                    return res.map((object) => {
                        return {
                            value: object.testrunTestcase,
                            status: object.status,
                            user: object.user,
                            comment: object.comment,
                            trrDate: object.trrDate
                        };
                    });
                });

                try {
                    const results = await Promise.all(promises);
                    const mergedResults = results.flat();
                    setTestRunResultFromTestCase(mergedResults);
                } catch (error) {
                    console.error("An error occurred while fetching data:", error);
                }
            }
        }

        updateTestRunResultFromTestCase();

    }, [testRunTestCase]);

    return (
        <div>
            <Space size={20} direction="vertical" style={{
                padding: 24,
                minHeight: 360,
                width: '100%',
                backgroundColor: colorBgContainer
            }}>
                <Breadcrumb
                    style={{
                        margin: '20px 0',
                    }}
                >
                    <Breadcrumb.Item>Результаты тестового запуска для каждого прикрепленного
                        тест-кейса</Breadcrumb.Item>
                </Breadcrumb>
                <TestRunResultForTestRunTable testRunTestCase={testRunTestCase} loading={loading}
                                              testCaseForProject={testCaseForProject}
                                              testRunResultFromTestCase={testRunResultFromTestCase}>
                </TestRunResultForTestRunTable>
            </Space>
        </div>
    );
}

export default GetTestRunsResult;