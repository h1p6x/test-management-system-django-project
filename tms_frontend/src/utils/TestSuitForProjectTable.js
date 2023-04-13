import React from 'react';
import {Link} from "react-router-dom";
import {Table} from "antd";

function TestSuitForProjectTable(props) {
    const {testSuit, loading} = props;
    const sortedTestSuit = [...testSuit].sort((a, b) => b.id - a.id);

    return (
        <div>
            <Table
                columns={[
                    {
                        title: "Название Тест-сьюта",
                        dataIndex: "name",
                        ellipsis: true,
                        render: (text, {id}) => {
                            return (
                                <Link to={`./testsuits/${id}`} style={{textDecoration: "none"}}>
                                    {text}
                                </Link>
                            );
                        }
                    },
                    {
                        title: "Описание",
                        dataIndex: "description",
                        ellipsis: true,
                    },
                    {
                        title: "Именование проекта, к которому привязан Тест-сьют",
                        dataIndex: "project",
                    },
                ]}
                loading={loading}
                dataSource={sortedTestSuit}
                pagination={{pageSize: 3}}
            ></Table>
        </div>
    );
}

export default TestSuitForProjectTable;