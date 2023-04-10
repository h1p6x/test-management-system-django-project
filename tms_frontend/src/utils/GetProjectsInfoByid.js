import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {
    createTestRun,
    createTestSuit,
    getProjects,
    getTestCaseForProject,
    getTestCaseForSuit,
    getTestRunsForProject,
    getTestSuitForProject
} from "../API/API";
import AuthContext from "../context/AuthContext";
import {Breadcrumb, Button, Checkbox, Form, Input, message, Modal, Select, Space, theme} from "antd";
import TestRunForProjectTable from "./TestRunForProjectTable";
import TestSuitForProjectTable from "./TestSuitForProjectTable";

const {TextArea} = Input;

function GetProjectsInfoByid() {

    let {authTokens} = useContext(AuthContext)
    const [testSuit, setTestSuit] = useState([]);
    const [testRun, setTestRun] = useState([]);
    const [testCase, setTestCase] = useState([
        {value: '', label: ''}
    ]);
    const [testSuitSelect, setTestSuitSelect] = useState([
        {value: '', label: ''}
    ]);
    const [testSuitCreate, setTestSuitCreate] = useState({name: '', description: ''});
    const [testRunCreate, setTestRunCreate] = useState({
        name: '', description: '', testcases: []
    });
    const [testProject, setTestProject] = useState({
        id: '', status: '', name: ''
    });
    const [loading, setLoading] = useState(false);
    const [isModalRunsOpen, setIsModalRunsOpen] = useState(false);
    const [isModalSuitsOpen, setIsModalSuitsOpen] = useState(false);
    const {projectId} = useParams();
    const projectIdInt = +projectId;
    const [testSuitForm] = Form.useForm();
    const [testRunForm] = Form.useForm();
    const [testCaseEnable, setTestCaseEnable] = useState(false);
    const [testSuitEnable, setTestSuitEnable] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const testSuitCheckbox = () => {
        setTestSuitEnable(!testSuitEnable);
        if (testSuitEnable) {
            setTestCaseEnable(false);
        }
    };

    const testCaseCheckbox = () => {
        setTestCaseEnable(!testCaseEnable);
        if (testCaseEnable) {
            setTestSuitEnable(false);
        }
    };

    const showRunsModal = async () => {
        setIsModalRunsOpen(true);
    };

    const showSuitModal = async () => {
        setIsModalSuitsOpen(true);
    };

    const runsHandleCancel = async (e) => {
        testRunForm.resetFields();
        setIsModalRunsOpen(false);
        setTestCaseEnable(false);
        setTestSuitEnable(false);
    };

    const suitHandleCancel = async (e) => {
        testSuitForm.resetFields();
        setIsModalSuitsOpen(false);
    };

    const submitSuitForm = async () => {
        createTestSuit({authTokens, testSuitCreate, projectId}).then((response) => {
            if (response.status === 201) {
                messageApi.open({
                    type: 'success',
                    content: 'Тест-сьют успешно добавлен'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Произошла непредвиденная ошибка'
                });
            }
        });
        setTestSuitCreate({name: '', description: ''});
        testSuitForm.resetFields();
        setIsModalSuitsOpen(false);
    };

    const submitRunForm = async () => {
        createTestRun({authTokens, testRunCreate, projectId}).then((response) => {
            if (response.status === 201) {
                messageApi.open({
                    type: 'success',
                    content: 'Тестовый запуск успешно добавлен'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Произошла непредвиденная ошибка'
                });
            }
        });
        setTestRunCreate({name: '', description: '', testcases: []});
        testRunForm.resetFields();
        setIsModalRunsOpen(false);
        setTestCaseEnable(false);
        setTestSuitEnable(false);
    };

    const selectChange = async (e) => {
        for (let i = 0; i < e.length; i++) {
            const data = await getTestCaseForSuit({authTokens, projectId, testSuitId: e[i]});
            const testCasesForTestSuit = data.map((object) => (
                object.id
            ));
            setTestRunCreate({...testRunCreate, testcases: testCasesForTestSuit})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    testCaseRes,
                    testSuitRes,
                    testRunRes,
                    testProjectsRes
                ] = await Promise.all([
                    getTestCaseForProject({authTokens, projectId}),
                    getTestSuitForProject({authTokens, projectId}),
                    getTestRunsForProject({authTokens, projectId}),
                    getProjects({authTokens})
                ]);
                console.log(testCaseRes);
                const newTestCase = testCaseRes.results.map((object) => ({
                    value: object.id,
                    label: object.title
                }));

                const newTestSuit = testSuitRes.map((object) => ({
                    value: object.id,
                    label: object.name
                }));

                setTestCase(newTestCase);
                setTestSuit(testSuitRes);
                setTestSuitSelect(newTestSuit);
                setTestRun(testRunRes);

                if (testProjectsRes.results.length === 0) {
                    console.log('testProject.results');
                } else {
                    console.log(testProjectsRes.results)
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
    }, [projectId, authTokens]);


    return (
        <div>
            <Space size={20} direction="vertical" style={{
                padding: 24,
                minHeight: 360,
                width: '100%',
                backgroundColor: colorBgContainer
            }}>
                <Breadcrumb>
                    {/*<Breadcrumb.Item>{testSuit.map((object) => (*/}
                    {/*    object.project*/}
                    {/*)).slice(0, 1)}</Breadcrumb.Item>*/}
                    <Breadcrumb.Item>
                        {testProject.name}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Тест-сьюты</Breadcrumb.Item>
                </Breadcrumb>
                <Button type="primary" onClick={showSuitModal} style={{
                    float: 'right', display: testProject.status ===
                    'Open' ? 'block' : 'none'
                }}>
                    Добавить тест-сьют
                </Button>
                <Modal title='Создание нового тест-сьюта' open={isModalSuitsOpen} onOk={testSuitForm.submit}
                       onCancel={suitHandleCancel}>
                    <Form
                        form={testSuitForm}
                        onFinish={submitSuitForm}
                    >
                        <Form.Item name={'name'}>
                            <Input
                                placeholder='Название тест-сьюта'
                                maxLength={100}
                                style={{
                                    marginTop: 5,
                                }}
                                allowClear
                                onChange={event => setTestSuitCreate({
                                    ...testSuitCreate,
                                    name: event.target.value
                                })}
                            ></Input>
                        </Form.Item>
                        <Form.Item name={'description'}>
                            <TextArea
                                showCount
                                maxLength={100}
                                style={{
                                    height: 120,
                                    resize: 'none',
                                }}
                                placeholder="Описание тест-сьюта"
                                onChange={event => setTestSuitCreate({
                                    ...testSuitCreate,
                                    description: event.target.value
                                })}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                {contextHolder}
                <TestSuitForProjectTable testSuit={testSuit} loading={loading}></TestSuitForProjectTable>
                <Breadcrumb>
                    {/*<Breadcrumb.Item>{testRun.map((object) => (*/}
                    {/*    object.testProject*/}
                    {/*)).slice(0, 1)}</Breadcrumb.Item>*/}
                    <Breadcrumb.Item>
                        {testProject.name}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Тестовые запуски</Breadcrumb.Item>
                </Breadcrumb>
                <Button type="primary" onClick={showRunsModal} style={{
                    float: 'right', display: testProject.status ===
                    'Open' ? 'block' : 'none'
                }}>
                    Добавить тестовый запуск
                </Button>
                <Modal title='Создание нового тестового запуска' open={isModalRunsOpen} onOk={testRunForm.submit}
                       onCancel={runsHandleCancel}>
                    <Form
                        form={testRunForm}
                        onFinish={submitRunForm}
                    >
                        <Form.Item name={'name'}>
                            <Input
                                placeholder='Название тестовго запуска'
                                maxLength={100}
                                style={{
                                    marginTop: 5,
                                }}
                                allowClear
                                onChange={event => setTestRunCreate({
                                    ...testRunCreate,
                                    name: event.target.value
                                })}
                            ></Input>
                        </Form.Item>
                        <Form.Item name={'description'}>
                            <TextArea
                                showCount
                                maxLength={100}
                                style={{
                                    height: 120,
                                    resize: 'none',
                                }}
                                placeholder="Описание тестового запуска"
                                onChange={event => setTestRunCreate({
                                    ...testRunCreate,
                                    description: event.target.value
                                })}
                            />
                        </Form.Item>
                        <Checkbox
                            checked={testCaseEnable}
                            disabled={testSuitEnable}
                            onChange={testCaseCheckbox}
                        >
                            Выбрать тест-кейсы
                        </Checkbox>
                        <Form.Item name={'caseSelect'}>
                            <Select
                                mode="multiple"
                                disabled={!testCaseEnable}
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Пожалуйста, выберите необходимые тест-кейсы"
                                onChange={event => setTestRunCreate({
                                    ...testRunCreate,
                                    testcases: event
                                })}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={testCase}
                            />
                        </Form.Item>
                        <Checkbox
                            checked={testSuitEnable}
                            disabled={testCaseEnable}
                            onChange={testSuitCheckbox}
                        >
                            Выбрать тест-сьюты
                        </Checkbox>
                        <Form.Item name={'suitSelect'}>
                            <Select
                                mode="multiple"
                                disabled={!testSuitEnable}
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Пожалуйста, выберите необходимые тест-сьюты"
                                onChange={selectChange}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={testSuitSelect}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                {contextHolder}
                <TestRunForProjectTable testCase={testCase} testRun={testRun}
                                        loading={loading}></TestRunForProjectTable>
            </Space>
        </div>
    );
}

export default GetProjectsInfoByid;