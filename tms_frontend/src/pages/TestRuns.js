import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout, Pagination, Space, Table, Tag, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {getProjects, getSuits, getTestCase, getTestRuns} from "../API/API";
import {Link} from "react-router-dom";

const {Content} = Layout;

function TestRuns(props) {

    let {authTokens} = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const sortedTestRuns = [...dataSource].sort((a, b) => b.id - a.id);
    const [testCase, setTestCase] = useState([
        {value: '', label: ''}
    ]);
    const [projectIds, setProjectIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setLoading(true);
        getTestRuns({authTokens}).then((res) => {
            setDataSource(res.results);
            setLoading(false);
        });
        getTestCase({authTokens}).then((res) => {
            const newTestCase = res.results.map((object) => {
                return {value: object.id, label: object.title}
            });
            setTestCase([...newTestCase]);
        });


    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [testRunsRes, projectsRes, testCaseRes] =
                    await Promise.all([
                        getTestRuns({authTokens}),
                        getProjects({authTokens}),
                        getTestCase({authTokens})
                    ]);
                const runs = testRunsRes.results;
                const projects = projectsRes.results;

                const newTestCase = testCaseRes.results.map((object) => {
                    return {value: object.id, label: object.title}
                });
                setTestCase([...newTestCase]);

                setDataSource(runs);

                const filteredProjects = projects.filter(project => {
                    return runs.find(data => project.name === data.testProject);
                });

                const filteredProjectIds = filteredProjects.map(project => {
                    return {
                        value: project.id,
                        label: project.name
                    };
                });

                setProjectIds(filteredProjectIds);
                setLoading(false);
            } catch (error) {
                console.error("Ошибка", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const renderTestRunName = (text, record) => {
        const filteredProjects = projectIds.filter(project => project.label === record.testProject);
        if (filteredProjects.length > 0) {
            return (
                <Link style={{textDecoration: "none"}}
                      to={`/projects/${filteredProjects[0].value}/testruns/${record.id}`}>
                    {text}
                </Link>
            );
        }
        return '';
    };

    const renderTestProjectName = (text, record) => {
        const filteredProjects = projectIds.filter(project => project.label === record.testProject);
        if (filteredProjects.length > 0) {
            return (
                <Link style={{textDecoration: "none"}}
                      to={`/projects/${filteredProjects[0].value}`}>
                    {text}
                </Link>
            );
        }
        return '';
    };

    return (
        <Space size={20} direction="vertical" style={{
            padding: 24,
            minHeight: 360,
            width: '100%',
            paddingTop: '50px',
            paddingLeft: '200px',
            backgroundColor: colorBgContainer
        }}>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '20px 0',
                    }}
                >
                    <Breadcrumb.Item></Breadcrumb.Item>
                    <Breadcrumb.Item>Существующие тестовые запуски</Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    columns={[
                        {
                            title: "Название тестового запуска",
                            dataIndex: "name",
                            ellipsis: true,
                            render: renderTestRunName
                        },
                        {
                            title: "Описание",
                            dataIndex: "description",
                            ellipsis: true,
                        },
                        {
                            title: "Проект, к которому привязан тестовый запуск",
                            dataIndex: "testProject",
                            render: renderTestProjectName
                        },
                        {
                            title: "Прикрепленные к тестовуму запуски тест-кейсы",
                            dataIndex: "testcases",
                            render: (_, {testcases}) => (
                                <>
                                    {testcases.map((tag) => {
                                        let color = tag.length > 5 ? 'geekblue' : 'green';
                                        return testCase
                                            .filter(value => value.value === tag)
                                            .map(value => (
                                                <Tag color={color} key={value.value}>
                                                    {value.label}
                                                </Tag>
                                            ));
                                    })}
                                </>
                            ),

                        }

                    ]}
                    loading={loading}
                    dataSource={sortedTestRuns.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                    )}
                    pagination={false}
                    size="large"
                    style={{minHeight: "600px", overflowY: "scroll"}}
                ></Table>
                <div style={{ marginTop: "16px", textAlign: "right" }}>
                    <Pagination
                        current={currentPage}
                        total={sortedTestRuns.length}
                        pageSize={pageSize}
                        onChange={handlePaginationChange}
                    />
                </div>
            </div>
        </Space>
    );
}

export default TestRuns;