import React, {useState} from 'react';
import {Pagination, Table, Tag} from "antd";
import {Link} from "react-router-dom";

function TestCaseForTestSuitTable(props) {
    const {dataSource, loading, getColumnSearchProps} = props;
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const sortedTestCase = [...dataSource].sort((a, b) => b.id - a.id);

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Table
                columns={[
                    {
                        title: "Название тест-кейса",
                        dataIndex: "title",
                        ellipsis: true,
                        ...getColumnSearchProps('title'),
                        render: (text, {id}) => {
                            return (
                                <Link to={`./testcase/${id}`} style={{textDecoration: "none"}}>
                                    {text}
                                </Link>
                            );
                        }
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
                        ...getColumnSearchProps('steps'),
                    },
                    {
                        title: "Ожидаемый результат",
                        dataIndex: "expected_result",
                        ellipsis: true,
                    },
                ]}
                loading={loading}
                dataSource={sortedTestCase.slice(
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
                    total={sortedTestCase.length}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}

export default TestCaseForTestSuitTable;