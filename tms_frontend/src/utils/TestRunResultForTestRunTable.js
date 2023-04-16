import React, {useState} from 'react';
import {Pagination, Space, Table, Tag, theme} from "antd";
import {Link} from "react-router-dom";

function TestRunResultForTestRunTable(props) {
    const {testRunTestCase, loading, testCaseForProject, testRunResultFromTestCase} = props;
    const sortedTestRunTestCase = [...testRunTestCase].sort((a, b) => b.id - a.id);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };


    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <Space size={20} direction="vertical" style={{
            minHeight: 360,
            width: '100%',
            backgroundColor: colorBgContainer
        }}>
            <Table
                columns={[
                    {
                        title: "Название Тест-кейса",
                        dataIndex: "testCase",
                        ellipsis: true,
                        render: (_, {testCase}) => {
                            return testCaseForProject
                                .filter(value => value.value === testCase)
                                .map(value => (
                                    <div key={value.value}>
                                        <Link to={`./testrunresult/${value.value}`} style={{textDecoration: "none"}}>
                                            {value.label}
                                        </Link>
                                    </div>
                                ));
                        },
                    },
                    {
                        title: "Приоритет",
                        dataIndex: "",
                        render: (_, {testCase}) => {
                            let priority = '';
                            let color = '';
                            testCaseForProject
                                .filter(value => value.value === testCase)
                                .forEach(value => {
                                    priority = value.priority;
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
                                });
                            return (
                                <Tag color={color} key={priority} style={{width: '100%', textAlign: 'center'}}>
                                    {priority.toUpperCase()}
                                </Tag>
                            );
                        },

                    },
                    {
                        title: "Статус тест-кейса в рамках тестового запуска",
                        dataIndex: "id",
                        render: (_, {id}) => {
                            const testRun = testRunResultFromTestCase.find(value => value.value === id);
                            if (!testRun) {
                                return <Tag color='silver' style={{width: '100%', textAlign: 'center'}}>
                                    Ни разу не запускался
                                </Tag>;
                            }
                            const color = testRun.status === 'Passed' ? 'green' : 'red';
                            return (
                                <Tag color={color} key={testRun.value} style={{width: '100%', textAlign: 'center'}}>
                                    {testRun.status}
                                </Tag>
                            );
                        }

                    }
                ]}
                loading={loading}
                dataSource={sortedTestRunTestCase.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                )}
                pagination={false}
                size="large"
                style={{ minHeight: "400px", overflowY: "scroll" }}
            ></Table>
            <div style={{ marginTop: "16px", textAlign: "right" }}>
                <Pagination
                    current={currentPage}
                    total={sortedTestRunTestCase.length}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                />
            </div>
        </Space>
    );
}

export default TestRunResultForTestRunTable;