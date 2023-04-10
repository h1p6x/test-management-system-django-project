import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout, Space, Table, Tag, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {getTestCase} from "../API/API";

const {Content} = Layout;

function TestCases(props) {

    let {authTokens} = useContext(AuthContext)

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        setLoading(true);
        getTestCase({authTokens}).then((res) => {
            setDataSource(res.results);
            setLoading(false);
        });

    }, []);
    const {
        token: {colorBgContainer},
    } = theme.useToken();


    return (
        <Space size={20} direction="vertical" style={{
            padding: 24,
            minHeight: 360,
            width: '100%',
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
                    loading={loading}
                    columns={[
                        {
                            title: "Название тест-кейса",
                            dataIndex: "title",
                            ellipsis: true,
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
                                } else if (priority == 'Highest') {
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
                        },
                    ]}
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </div>
        </Space>
    );
}

export default TestCases;