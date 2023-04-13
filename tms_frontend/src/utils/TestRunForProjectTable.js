import React from 'react';
import {Table, Tag} from "antd";
import {Link} from "react-router-dom";

function TestRunForProjectTable(props) {
    const {testCase, testRun, loading} = props;
    const sortedTestRun = [...testRun].sort((a, b) => b.id - a.id);

    return (
        <div>
            <Table
                columns={[
                    {
                        title: "Название тестового запуска",
                        dataIndex: "name",
                        ellipsis: true,
                        render: (text, {id}) => {
                            return (
                                <Link to={`./testruns/${id}`} style={{textDecoration: "none"}}>
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
                loading={loading}
                dataSource={sortedTestRun}
                pagination={{pageSize: 3}}
            ></Table>
        </div>
    );
}

export default TestRunForProjectTable;