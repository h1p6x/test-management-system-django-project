import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout, Space, Table, Tag, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {getTestCase, getTestRuns} from "../API/API";

const {Content} = Layout;

function TestRuns(props) {

    let {authTokens} = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [testCase, setTestCase] = useState([
        {value: '', label: ''}
    ]);

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
            console.log(testCase)
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
                    <Breadcrumb.Item>Существующие тестовые запуски</Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Название тестового запуска",
                            dataIndex: "name",
                            ellipsis: true,
                        },
                        {
                            title: "Описание",
                            dataIndex: "description",
                            ellipsis: true,
                        },
                        {
                            title: "Проект, к которому привязан тестовый запуск",
                            dataIndex: "testProject",
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
                    dataSource={dataSource}
                    pagination={{
                        pageSize: 5,
                    }}
                ></Table>
            </div>
        </Space>
    );
}

export default TestRuns;