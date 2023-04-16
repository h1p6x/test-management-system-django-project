import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout, Pagination, Space, Table, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {getProjects, getSuits} from "../API/API";
import {Link} from "react-router-dom";

const {Content} = Layout;

function TestSuits(props) {
    let {authTokens} = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const sortedTestSuits = [...dataSource].sort((a, b) => b.id - a.id);
    const [projectIds, setProjectIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    // useEffect(() => {
    //     setLoading(true);
    //     getSuits({authTokens}).then((res) => {
    //         setDataSource(res.results);
    //         setLoading(false);
    //     });
    //     getProjects({authTokens}).then((res) => {
    //         getProjects({authTokens}).then((res) => {
    //             const projects = res.results;
    //             console.log(projects);
    //             setLoading(false);
    //         });
    //     });
    //
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //
    //             const suitsRes = await getSuits({authTokens});
    //             setDataSource(suitsRes.results);
    //
    //             const projectsRes = await getProjects({authTokens});
    //             const projects = projectsRes.results;
    //
    //             const filteredProjects = projects.filter(project => {
    //                 return dataSource.find(data => project.name === data.project);
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

                const [suitsRes, projectsRes] =
                    await Promise.all([
                        getSuits({authTokens}),
                        getProjects({authTokens})
                    ]);
                const suits = suitsRes.results;
                const projects = projectsRes.results;

                setDataSource(suits);

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

    const renderTestSuitName = (text, record) => {
        const filteredProjects = projectIds.filter(project => project.label === record.project);
        if (filteredProjects.length > 0) {
            return (
                <Link style={{textDecoration: "none"}}
                      to={`/projects/${filteredProjects[0].value}/testsuits/${record.id}`}>
                    {text}
                </Link>
            );
        }
        return '';
    };

    const renderTestProjectName = (text, record) => {
        const filteredProjects = projectIds.filter(project => project.label === record.project);
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
                    <Breadcrumb.Item>Существующие тест-сьюты</Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    columns={[
                        {
                            title: "Название тест-сьюта",
                            dataIndex: "name",
                            ellipsis: true,
                            render: renderTestSuitName,
                        },
                        {
                            title: "Описание",
                            dataIndex: "description",
                            ellipsis: true,
                        },
                        {
                            title: "Проект, к которому привязан Тест-сьют",
                            dataIndex: "project",
                            render: renderTestProjectName,
                        }

                    ]}
                    loading={loading}
                    dataSource={sortedTestSuits.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                    )}
                    pagination={false}
                    size="large"
                    style={{minHeight: "400px", overflowY: "scroll"}}
                ></Table>
                <div style={{ marginTop: "16px", textAlign: "right" }}>
                    <Pagination
                        current={currentPage}
                        total={sortedTestSuits.length}
                        pageSize={pageSize}
                        onChange={handlePaginationChange}
                    />
                </div>
            </div>
        </Space>
    );
}

export default TestSuits;