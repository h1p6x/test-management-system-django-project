import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Button, Card, Layout, Popconfirm, Space, Statistic, Table, Tag, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {closeProject, getProjects, getSuits, getTestCase, getTestRuns} from "../API/API";

import {FormOutlined, FundProjectionScreenOutlined, PlayCircleOutlined, SnippetsOutlined,} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {transform} from "../utils/TimeTranscform"

import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const {Header, Footer, Sider, Content} = Layout;

export const ProjectsInfo = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    let {authTokens} = useContext(AuthContext)

    useEffect(() => {
        setLoading(true);
        getProjects({authTokens}).then((res) => {
            res.results = transform(res)
            setDataSource(res.results);
            setLoading(false);
        });
    }, []);

    const projectclose = ({id}) => {
        closeProject({authTokens, id}).then(response => response.json())
    };

    return (
        <>
            <Breadcrumb
                style={{
                    margin: '20px 0',
                }}
            >
                <Breadcrumb.Item></Breadcrumb.Item>
                <Breadcrumb.Item>Существующие проекты</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                columns={[
                    {
                        title: "Название проекта",
                        dataIndex: "name",
                        render: (text, {id}) => {
                            return (
                                <Link to={`/projects/${id}`} style={{textDecoration: "none"}}>
                                    {text}
                                </Link>
                            );
                        }
                    },
                    {
                        title: 'Статус',
                        dataIndex: 'status',
                        key: 'status',
                        render: (_, {status}) => {
                            let color;
                            (status === 'Открыт') ? color = 'green' : color = 'volcano';
                            return (
                                <Tag color={color} key={status}>
                                    {status.toUpperCase()}
                                </Tag>
                            );
                        }
                    },
                    {
                        title: "Дата создания",
                        dataIndex: "creation_date",
                    },
                    {
                        title: "Дата последнего редактирования",
                        dataIndex: "modification_date",
                    },
                    {
                        title: "Изменение статуса проекта",
                        dataIndex: ' ',
                        render: (_, {id, status}) =>
                            dataSource.length >= 1 && (status === 'Открыт') ? (
                                <Popconfirm title="Уверены, что хотите закрыть проект?"
                                            onConfirm={() => projectclose({id})}>
                                    <Button>Закрыть проект</Button>
                                </Popconfirm>
                            ) : <a>Проект выполнен</a>,
                    },
                ]}
                loading={loading}
                dataSource={dataSource}
                pagination={{pageSize: 5}}
            ></Table>
        </>
    );
}

function Dashboard(props) {

    let {authTokens} = useContext(AuthContext)
    const [projectsCount, setProjectCount] = useState(0)
    const [suitsCount, setSuitsCount] = useState(0)
    const [casesCount, setCasesCount] = useState(0)
    const [runsCount, setRunsCount] = useState(0)

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    useEffect(() => {
        getProjects({authTokens}).then((res) => {
            setProjectCount(res['results'].length);
        });
        getSuits({authTokens}).then((res) => {
            setSuitsCount(res['results'].length);
        });
        getTestCase({authTokens}).then((res) => {
            setCasesCount(res['results'].length);
        });
        getTestRuns({authTokens}).then((res) => {
            setRunsCount(res['results'].length);
        });
    }, []);

    const DashboardCard = ({title, value, icon, linkTo}) => {
        return (
            <Link to={linkTo} style={{textDecoration: "none"}}>
                <Card>
                    <Space direction="horizontal">
                        {icon}
                        <Statistic title={title} value={value}/>
                    </Space>
                </Card>
            </Link>
        )
    }

    const DashboardChart = () => {
        const [runsResultData, setRunsResultData] = useState({
            labels: [],
            datasets: [],
        });

        useEffect(() => {
                getTestRuns({authTokens}).then((res) => {
                    const labels = [...new Set(res.results.slice(-6).map(({testProject}) => testProject))]
                    // const labels = [...new Set(res.results.map(({testProject}) => testProject))]
                    const data = labels.map((project) => {
                        const filteredResults = res.results.filter(r => r.testProject === project);
                        return filteredResults.length;
                    });
                    const dataSource = {
                        labels,
                        datasets: [
                            {
                                label: 'Количество тестовых запусков',
                                data: data,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    };

                    setRunsResultData(dataSource);
                });
            }, []
        )
        ;

        return (
            <Card style={{width: 500, height: 500, display: "flow"}}>
                <Pie data={runsResultData}/>
            </Card>
        )
            ;
    }


    return (
        <div style={{width: '100wh'}}>
            <Space size={20} direction="vertical" style={{
                //margin: ' 0 16px',
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
                    <Breadcrumb.Item></Breadcrumb.Item>
                    <Breadcrumb.Item>Главная страница</Breadcrumb.Item>
                </Breadcrumb>
                <Space direction="horizontal" style={{
                    // padding: 24,
                    // minHeight: 360,
                }}>
                    <DashboardCard
                        icon={
                            <FundProjectionScreenOutlined
                                style={{
                                    color: "green",
                                    backgroundColor: "rgba(0,255,0,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={"Проекты"}
                        value={projectsCount}
                        linkTo={"/projects"}
                    />
                    <DashboardCard
                        icon={
                            <SnippetsOutlined
                                style={{
                                    color: "purple",
                                    backgroundColor: "rgba(0,0,255,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={"Тест-сьюты"}
                        value={suitsCount}
                        linkTo={"/testsuits"}
                    />
                    <DashboardCard
                        icon={
                            <FormOutlined
                                style={{
                                    color: "red",
                                    backgroundColor: "rgba(255,0,0,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={"Тест-кейсы"}
                        value={casesCount}
                        linkTo={"/testcases"}
                    />
                    <DashboardCard
                        icon={
                            <PlayCircleOutlined
                                style={{
                                    color: "blue",
                                    backgroundColor: "rgba(0,255,255,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={"Тестовые запуски"}
                        value={runsCount}
                        linkTo={"/testruns"}
                    />
                </Space>
                <Space>
                    <ProjectsInfo/>
                    <DashboardChart></DashboardChart>
                </Space>
            </Space>
        </div>
    );
}

export default Dashboard;