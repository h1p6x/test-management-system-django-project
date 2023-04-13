import React, {useContext, useEffect, useRef, useState} from "react";
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, theme} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import {useParams} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {createTestCase, getProjects, getTestCaseForSuit, getTestCasePriority, getTestSuitForProject} from "../API/API";
import Highlighter from 'react-highlight-words';
import TestCaseForTestSuitTable from "./TestCaseForTestSuitTable";

function GetSuitInfoById() {
    let {authTokens} = useContext(AuthContext)
    const {projectId, testSuitId} = useParams();
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [testSuit, setTestSuit] = useState([]);
    const [testCaseCreate, setTestCaseCreate] = useState([
        {title: '', priority: '', estimate: '', precondition: '', steps: '', expected_result: ''}
    ]);
    const projectIdInt = +projectId;
    const testSuitIdInt = +testSuitId;

    const [testProject, setTestProject] = useState({
        id: '', status: '', name: ''
    });
    const [messageApi, contextHolder] = message.useMessage();
    const [testCaseForm] = Form.useForm();
    const [isModalCaseOpen, setIsModalCaseOpen] = useState(false);
    const {TextArea} = Input;
    const [prioritySelect, setPrioritySelect] = useState([
        {value: '', label: ''}
    ])

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Искать`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Искать
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters) &&
                            handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Сбросить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const showCaseModal = async () => {
        setIsModalCaseOpen(true);
    };

    const caseHandleCancel = async (e) => {
        testCaseForm.resetFields();
        setIsModalCaseOpen(false);
    };

    const submitCaseForm = async () => {
        createTestCase({authTokens, testCaseCreate, projectId, testSuitId}).then((response) => {
            if (response.status === 201) {
                messageApi.success('Тест-кейс успешно добавлен');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                messageApi.error('Произошла непредвиденная ошибка');
            }
        });
        setTestCaseCreate({
            title: '', priority: '', estimate: '',
            precondition: '', steps: '', expected_result: ''
        });
        testCaseForm.resetFields();
        setIsModalCaseOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    testCaseRes,
                    testSuitRes,
                    priorityRes,
                    testProjectsRes,
                ] = await Promise.all([
                    getTestCaseForSuit({authTokens, projectId, testSuitId}),
                    getTestSuitForProject({authTokens, projectId}),
                    getTestCasePriority({authTokens}),
                    getProjects({authTokens})
                ]);
                const newPriority = priorityRes.results.map((object) => {
                    return {value: object.name, label: object.name}
                });
                setDataSource(testCaseRes);
                setTestSuit(testSuitRes);
                setPrioritySelect(newPriority);

                if (testProjectsRes.results.length === 0) {
                    console.log('testProject.results');
                } else {
                    const testProject = testProjectsRes.results.find((project) => project.id === projectIdInt);
                    setTestProject({
                        id: testProject.id,
                        status: testProject.status,
                        name: testProject.name
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId, authTokens, testSuitId]);

    const testSuitFindById = testSuit.find(testSuit => testSuit.id === testSuitIdInt);

    return (
        <div>
            <Space size={20} direction="vertical" style={{
                padding: 24,
                minHeight: 360,
                width: '100%',
                paddingTop: '50px',
                paddingLeft: '200px',
                backgroundColor: colorBgContainer
            }}>
                <div style={{marginLeft: '20px'}}>
                    <Breadcrumb
                        style={{marginTop: '20px', marginBottom: '20px'}}
                    >
                        {/*<Breadcrumb.Item>{dataSource.map((object) => (*/}
                        {/*    object.testSuit*/}
                        {/*)).slice(0, 1)}</Breadcrumb.Item>*/}
                        {testSuitFindById && testSuitFindById.name ? (
                            <Breadcrumb.Item>
                                {testSuitFindById.name}
                            </Breadcrumb.Item>
                        ) : null}
                        <Breadcrumb.Item>Тест-кейсы</Breadcrumb.Item>
                    </Breadcrumb>
                    <Button type="primary" onClick={showCaseModal} style={{
                        float: 'right', display: testProject.status ===
                        'Open' ? 'block' : 'none', marginBottom: '30px'
                    }}>
                        Добавить тест-кейс
                    </Button>
                    <Modal title="Создание нового тест-кейса" open={isModalCaseOpen} onOk={testCaseForm.submit}
                           onCancel={caseHandleCancel}
                           okText="Добавить"
                           cancelText="Отмена"
                           cancelButtonProps={{ style: { float: 'right', marginLeft: "5px"} }}
                    >
                        <Form
                            form={testCaseForm}
                            onFinish={submitCaseForm}
                        >
                            <Form.Item name={'name'} rules={[{
                                required: true,
                                message: 'Пожалуйста, введите название'
                            }]}>
                                <Input
                                    placeholder='Название тест-кейса'
                                    maxLength={255}
                                    style={{
                                        marginTop: 5,
                                    }}
                                    allowClear
                                    onChange={event => setTestCaseCreate({
                                        ...testCaseCreate,
                                        title: event.target.value
                                    })}
                                ></Input>
                            </Form.Item>
                            <Form.Item name={'priority'} rules={[{
                                required: true,
                                message: 'Пожалуйста, выберите приоритет'
                            }]}>
                                <Select
                                    allowClear
                                    style={{
                                        width: '100%',
                                    }}
                                    placeholder="Пожалуйста, выберите приоритет тест-кейса"
                                    onChange={event => setTestCaseCreate({
                                        ...testCaseCreate,
                                        priority: event
                                    })}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={prioritySelect}
                                />
                            </Form.Item>
                            <Form.Item name={'estimate'} rules={[{
                                required: true,
                                message: 'Пожалуйста, укажите оценку трудозатрат'
                            }]}>
                                <TextArea
                                    showCount
                                    maxLength={200}
                                    style={{
                                        height: 90,
                                        resize: 'none',
                                    }}
                                    onChange={event => setTestCaseCreate({
                                        ...testCaseCreate,
                                        estimate: event.target.value
                                    })}
                                    placeholder="Укажите оценку трудозатрат"
                                />
                            </Form.Item>
                            <Form.Item name={'precondition'} rules={[{
                                required: true,
                                message: 'Пожалуйста, укажите предусловие'
                            }]}>
                                <TextArea
                                    showCount
                                    maxLength={500}
                                    style={{
                                        height: 100,
                                        resize: 'none',
                                    }}
                                    onChange={event => setTestCaseCreate({
                                        ...testCaseCreate,
                                        precondition: event.target.value
                                    })}
                                    placeholder="Укажите предусловие для тест-кейса"
                                />
                            </Form.Item>
                            <Form.Item name={'steps'} rules={[{
                                required: true,
                                message: 'Пожалуйста, укажите шаги тест-кейса'
                            }]}>
                                <TextArea
                                    showCount
                                    maxLength={500}
                                    style={{
                                        height: 100,
                                        resize: 'none',
                                    }}
                                    onChange={event => setTestCaseCreate({
                                        ...testCaseCreate,
                                        steps: event.target.value
                                    })}
                                    placeholder="Укажите шаги прохождения тест-кейса"
                                />
                            </Form.Item>
                            <Form.Item name={'expected_result'} rules={[{
                                required: true,
                                message: 'Пожалуйста, укажите ожидаемый результат'
                            }]}>
                                <TextArea
                                    showCount
                                    maxLength={500}
                                    style={{
                                        height: 100,
                                        resize: 'none',
                                    }}
                                    onChange={event => setTestCaseCreate({
                                        ...testCaseCreate,
                                        expected_result: event.target.value
                                    })}
                                    placeholder="Укажите ожидаемый результат"
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    {contextHolder}
                    <TestCaseForTestSuitTable dataSource={dataSource} loading={loading}
                                              getColumnSearchProps={getColumnSearchProps}>

                    </TestCaseForTestSuitTable>
                </div>
            </Space>
        </div>
    );
}

export default GetSuitInfoById;