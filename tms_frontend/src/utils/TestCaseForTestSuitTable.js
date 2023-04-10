import React from 'react';
import {Table, Tag} from "antd";
import {Link} from "react-router-dom";

function TestCaseForTestSuitTable(props) {
    const {dataSource, loading, getColumnSearchProps} = props;

    return (
        <div>
            <Table
                loading={loading}
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
                        ...getColumnSearchProps('steps'),
                    },
                    {
                        title: "Ожидаемый результат",
                        dataIndex: "expected_result",
                        ellipsis: true,
                    },
                ]}
                dataSource={dataSource}
                pagination={{
                    pageSize: 5,
                }}
            ></Table>
        </div>
    );
}

export default TestCaseForTestSuitTable;