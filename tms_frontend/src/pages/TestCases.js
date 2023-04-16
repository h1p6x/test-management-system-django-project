import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout, Pagination, Space, Table, Tag, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {getProjects, getSuits, getTestCase} from "../API/API";
import {Link} from "react-router-dom";
import data from "bootstrap/js/src/dom/data";

const {Content} = Layout;

function TestCases(props) {

    let {authTokens} = useContext(AuthContext)

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const sortedTestCase = [...dataSource].sort((a, b) => b.id - a.id);
    const [suitIds, setSuitIds] = useState([]);
    const [projectIds, setProjectIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    // useEffect(() => {
    //     setLoading(true);
    //     getTestCase({authTokens}).then((res) => {
    //         setDataSource(res.results);
    //         setLoading(false);
    //     });
    //
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //
    //             const [casesRes, projectsRes, suitsRes] =
    //                 await Promise.all([
    //                     getTestCase({authTokens}),
    //                     getProjects({authTokens}),
    //                     getSuits({authTokens})
    //                 ]);
    //             const cases = casesRes.results;
    //             const suits = suitsRes.results;
    //             const projects = projectsRes.results;
    //
    //             setDataSource(cases);
    //
    //             const filteredSuits = suits.filter(suit => {
    //                 return cases.find(data => suit.name === data.testSuit);
    //             });
    //
    //             const filteredSuitsIds = filteredSuits.map(suit => {
    //                 return {
    //                     value: suit.id,
    //                     label: suit.name
    //                 };
    //             });
    //
    //             setSuitIds(filteredSuitsIds);
    //
    //             const filteredProjects = projects.filter(project => {
    //                 return suits.find(data => project.name === data.project);
    //             });
    //
    //             const filteredProjectIds = filteredProjects.map(project => {
    //                 return {
    //                     value: project.id,
    //                     label: project.name
    //                 };
    //             });
    //
    //             setProjectIds(filteredProjectIds);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Ошибка", error);
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [casesRes, projectsRes, suitsRes] = await Promise.all([
                    getTestCase({ authTokens }),
                    getProjects({ authTokens }),
                    getSuits({ authTokens })
                ]);
                const cases = casesRes.results;
                const suits = suitsRes.results;
                const projects = projectsRes.results;

                setDataSource(cases);

                const filteredSuits = suits.filter(suit => {
                    return cases.find(data => suit.name === data.testSuit);
                });

                const filteredSuitsIds = filteredSuits.map(suit => {
                    return {
                        value: suit.id,
                        label: suit.name,
                        project: suit.project // Добавляем свойство project в объект filteredSuits
                    };
                });

                setSuitIds(filteredSuitsIds);

                const filteredProjects = projects.filter(project => {
                    return suits.find(data => project.name === data.project);
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


    const renderTestCaseName = (text, record) => {
        const filteredSuits = suitIds.filter(suit => suit.label === record.testSuit);
        const filteredProjects = projectIds.filter(project => project.label === filteredSuits[0]?.project);
        if (filteredSuits.length > 0 && filteredProjects.length > 0) {
            return (
                <Link
                    style={{ textDecoration: "none" }}
                    to={`/projects/${filteredProjects[0]?.value}/testsuits/${filteredSuits[0]?.value}/testcase/${record.id}`}
                >
                    {text}
                </Link>
            );
        }
        return "";
    };

    const renderTestSuitName = (text, record) => {
        const filteredSuits = suitIds.filter(suit => suit.label === record.testSuit);
        const filteredProjects = projectIds.filter(project => project.label === filteredSuits[0]?.project);
        if (filteredSuits.length > 0 && filteredProjects.length > 0) {
            return (
                <Link
                    style={{ textDecoration: "none" }}
                    to={`/projects/${filteredProjects[0]?.value}/testsuits/${filteredSuits[0]?.value}`}
                >
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
                    <Breadcrumb.Item>Существующие тест-кейсы</Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    columns={[
                        {
                            title: "Название тест-кейса",
                            dataIndex: "title",
                            ellipsis: true,
                            render: renderTestCaseName
                        },
                        {
                            title: "Приоритет",
                            dataIndex: "priority",
                            render: (_, {priority}) => {
                                let color;
                                if (priority === 'Lowest') {
                                    color = 'blue';
                                } else if (priority === 'Low') {
                                    color = 'geekblue';
                                } else if (priority === 'Medium') {
                                    color = 'orange';
                                } else if (priority === 'High') {
                                    color = 'volcano';
                                } else if (priority === 'Highest') {
                                    color = 'red';
                                }
                                return (
                                    <Tag color={color} key={priority}>
                                        {priority.toUpperCase()}
                                    </Tag>
                                );
                            }
                        },
                        {
                            title: "Оценка трудозатрат",
                            dataIndex: "estimate",
                            ellipsis: true,
                        },
                        {
                            title: "Предусловие",
                            dataIndex: "precondition",
                            ellipsis: true,
                        },
                        {
                            title: "Шаги",
                            dataIndex: "steps",
                            ellipsis: true,
                        },
                        {
                            title: "Ожидаемый результат",
                            dataIndex: "expected_result",
                            ellipsis: true,
                        },
                        {
                            title: "Тест-сьют к которому привязан тест-кейс",
                            dataIndex: "testSuit",
                            render: renderTestSuitName
                        },
                    ]}
                    loading={loading}
                    dataSource={sortedTestCase.slice(
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
                        total={sortedTestCase.length}
                        pageSize={pageSize}
                        onChange={handlePaginationChange}
                    />
                </div>
            </div>
        </Space>
    );
}

export default TestCases;