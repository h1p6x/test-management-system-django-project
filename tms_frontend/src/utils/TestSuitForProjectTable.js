import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {Pagination, Table} from "antd";

function TestSuitForProjectTable(props) {
    const {testSuit, loading} = props;
    const sortedTestSuit = [...testSuit].sort((a, b) => b.id - a.id);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

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
                dataSource={sortedTestSuit.slice(
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
                    total={sortedTestSuit.length}
                    pageSize={pageSize}
                    onChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}

export default TestSuitForProjectTable;