import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Layout, Space, Table, theme} from "antd";
import AuthContext from "../context/AuthContext";
import {getSuits} from "../API/API";

const {Content} = Layout;

function TestSuits(props) {
    let {authTokens} = useContext(AuthContext)
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const myObject = dataSource.find(obj => console.log(obj.project));

    useEffect(() => {
        setLoading(true);
        getSuits({authTokens}).then((res) => {
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
                    <Breadcrumb.Item>Существующие тест-сьюты</Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    loading={loading}
                    columns={[
                        {
                            title: "Название тест-сьюта",
                            dataIndex: "name",
                            ellipsis: true,
                        },
                        {
                            title: "Описание",
                            dataIndex: "description",
                            ellipsis: true,
                        },
                        {
                            title: "Проект, к которому привязан Тест-сьют",
                            dataIndex: "project",
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

export default TestSuits;