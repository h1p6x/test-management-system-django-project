import React, {useContext, useEffect, useState} from 'react';
import AuthContext from "../context/AuthContext";
import {useParams} from "react-router-dom";
import {Breadcrumb, Button, Form, Input, message, Modal, Select, Space, Table, Tag, theme} from "antd";
import {
    createTestRunResult,
    getProjects,
    getRunResultForTestCase,
    getTestCaseForProject,
    getTestRunStatus,
    getTestRunsTestCaseForTestRun
} from "../API/API";
import TextArea from "antd/es/input/TextArea";

function GetTestRunResultForTestCase(props) {
    let {authTokens} = useContext(AuthContext)
    const {projectId, testRunId, testCaseId} = useParams();
    const testCaseIdInt = +testCaseId;
    const [testRunStatusSelect, setTestRunStatusSelect] = useState([
        {value: '', label: ''}
    ]);
    const [testRunTestCase, setTestRunTestCase] = useState([]);
    const [testRunResultCreate, setTestRunResultCreate] = useState({
        comment: '', status: '', trrDate: new Date().toISOString()
    });
    const [testCaseForProject, setTestCaseForProject] = useState([
        {value: '', label: '', priority: '', estimate: '', precondition: '', steps: '', expected_result: ''}
    ]);

    const [testRunResultFromTestCase, setTestRunResultFromTestCase] =
        useState({
        value: '',
        status: '',
        user: '',
        comment: '',
        trrDate: ''
    });
    const [testProject, setTestProject] = useState({
        id: '', status: '', name: ''
    });
    const projectIdInt = +projectId;
    const [testRunResultFromTestCaseTable, setTestRunResultFromTestCaseTable] = useState([]);
    const [testRunResultForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isModalRunResultOpen, setIsModalRunResultOpen] = useState(false);
    const {TextArea} = Input;
    const [testCaseEditForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    console.log('projectId', projectId, 'testRunId', testRunId, 'testCaseId', testCaseId);

    const showRunResultModal = async () => {
        setIsModalRunResultOpen(true);
    };

    const runResultHandleCancel = async (e) => {
        testRunResultForm.resetFields();
        setIsModalRunResultOpen(false);
    };

    const submitRunResultForm = async () => {
        createTestRunResult({
            authTokens,
            projectId,
            testRunId,
            testCaseId,
            testRunResultCreate
        }).then((response) => {
            if (response.status === 201) {
                messageApi.open({
                    type: 'success',
                    content: 'Результат тестового запуска успешно добавлен'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Произошла непредвиденная ошибка'
                });
            }
        });
        setTestRunResultCreate({status: '', comment: ''});
        testRunResultForm.resetFields();
        setIsModalRunResultOpen(false);
    };

    useEffect(() => {
        const testRunTestcaseForTestCase = async () => {
            try {
                setLoading(true);
                const testRunForTestCase = await getTestRunsTestCaseForTestRun(
                    {
                        authTokens,
                        projectId,
                        testRunId
                    });
                if (testRunForTestCase.length === 0) {
                    console.log('Массив testRunForTestCase пуст');
                } else {
                    let testRunTestCase = testRunForTestCase.find((testRunTestCase) =>
                        (testRunTestCase.testCase === testCaseIdInt));
                    setTestRunTestCase(testRunTestCase);
                    setLoading(false);
                }

            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        const testCaseForProject = async () => {
            try {
                setLoading(true);
                const testCases = await getTestCaseForProject({authTokens, projectId});
                if (testCases.results.length === 0) {
                    console.log('Массив testCases.results пуст');
                } else {
                    let testCase = testCases.results.find((testCase) => (testCase.id === testCaseIdInt));
                    setTestCaseForProject(testCase);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const updateTestRunResultFromTestCase = async () => {
            try {
                setLoading(true);
                const testRunResult = await getRunResultForTestCase(
                    {
                        authTokens,
                        projectId,
                        testRunId,
                        testRunTestCase: testCaseId
                    });
                if (testRunResult.length === 0) {
                    console.log('Массив testCases.results пуст');
                } else {
                    const trrDate = testRunResult[0].trrDate;
                    testRunResult[0].trrDate = new Date(trrDate).toLocaleString();

                    setTestRunResultFromTestCase({
                        value: testRunResult[0].testrunTestcase,
                        status: testRunResult[0].status,
                        user: testRunResult[0].user,
                        comment: testRunResult[0].comment,
                        trrDate: testRunResult[0].trrDate,
                    });
                    setTestRunResultFromTestCaseTable(testRunResult);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            }
        }

        getTestRunStatus({authTokens}).then((res) => {
            const newTestSuit = res.results.map((object) => {
                return {value: object.name, label: object.name}
            });
            setTestRunStatusSelect([...newTestSuit]);
            setLoading(false);
        });

        testCaseForProject();
        testRunTestcaseForTestCase();
        updateTestRunResultFromTestCase();

        const testProjectGet = async () => {
            try {
                setLoading(true);
                const testProjects = await getProjects(
                    {
                        authTokens,
                    });
                if (testProjects.results.length === 0) {
                    console.log('testProject.results');
                } else {
                    let testProject = testProjects.results.find((project) =>
                        (project.id === projectIdInt));
                    setTestProject({
                        id: testProject.id,
                        status: testProject.status,
                        name: testProject.name
                    });
                    setLoading(false);
                }

            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        testProjectGet();

    }, [projectId, testRunId, testCaseId, authTokens]);

    return (
        <div style={{width: '100%'}}>
            <Space
                size={20}
                direction="vertical"
                style={{
                    padding: 24,
                    minHeight: 360,
                    width: "100%",
                    backgroundColor: colorBgContainer,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '20px 0',
                    }}
                >
                    <Breadcrumb.Item>Тест-кейс в рамках тестового запуска</Breadcrumb.Item>
                    <Breadcrumb.Item>{testCaseForProject.title}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{
                    display: testProject.status ===
                    'Open' ? 'block' : 'none', justifyContent: 'space-between', float: 'right'
                }}>
                    {testRunResultFromTestCase.status !== 'Passed' &&
                        testRunResultFromTestCase.status !== 'Failed' &&
                        testRunResultFromTestCase.status === '' && (
                            <Button type="primary" onClick={showRunResultModal}>
                                Добавить результат тестового запуска
                            </Button>
                        )
                    }
                </div>
                <Modal title='Создание результата тествого запуска'
                       open={isModalRunResultOpen}
                       onOk={testRunResultForm.submit}
                       onCancel={runResultHandleCancel}>
                    <Form
                        form={testRunResultForm}
                        onFinish={submitRunResultForm}
                    >
                        <Form.Item name={'status'}>
                            <Select
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Статус прохождения тест-кейса в рамках тестового запуска"
                                onChange={event => setTestRunResultCreate({
                                    ...testRunResultCreate,
                                    status: event
                                })}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={testRunStatusSelect}
                            />
                        </Form.Item>
                        <Form.Item name={'comment'}>
                            <TextArea
                                showCount
                                maxLength={500}
                                style={{
                                    height: 200,
                                    resize: 'none',
                                }}
                                placeholder="Оставьте комментарий, что произошло при прохождении тест-кейса"
                                onChange={event => setTestRunResultCreate({
                                    ...testRunResultCreate,
                                    comment: event.target.value
                                })}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                {contextHolder}
                {['Passed', 'Failed'].includes(testRunResultFromTestCase.status) && (
                    <div>
                        <Table
                            columns={[
                                {
                                    title: "Кто запустил",
                                    dataIndex: "user",
                                },
                                {
                                    title: "Статус тестового запуска",
                                    dataIndex: "status",
                                    render: (_, {status}) => {
                                        const color = status === 'Passed' ? 'green' : 'red';
                                        return (
                                            <Tag color={color} style={{width: '100%', textAlign: 'center'}}>
                                                {status}
                                            </Tag>
                                        );
                                    }
                                },
                                {
                                    title: "Комментарий запускавшего",
                                    dataIndex: "comment",
                                },
                                {
                                    title: "Время запуска",
                                    dataIndex: "trrDate",
                                },
                            ]}
                            loading={loading}
                            dataSource={testRunResultFromTestCaseTable}
                            pagination={false}
                        ></Table>
                    </div>
                )}
                <Form
                    form={testCaseEditForm}
                >
                    <Input
                        placeholder='Название тест-кейса'
                        disabled={true}
                        maxLength={255}
                        style={{
                            marginTop: 5,
                            width: '100%',
                        }}
                        allowClear
                        value={testCaseForProject.title}
                    />
                    <Select
                        allowClear
                        disabled={true}
                        style={{
                            marginTop: 30,
                            width: '100%',
                        }}
                        placeholder="Пожалуйста, выберите приоритет тест-кейса"
                        value={testCaseForProject.priority}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                    <TextArea
                        showCount
                        disabled={true}
                        maxLength={200}
                        style={{
                            height: 90,
                            marginTop: 30,
                            resize: 'none',
                            width: '100%',
                        }}
                        value={testCaseForProject.estimate}
                        placeholder="Укажите оценку трудозатрат"
                    />
                    <TextArea
                        showCount
                        disabled={true}
                        maxLength={500}
                        style={{
                            height: 100,
                            marginTop: 30,
                            resize: 'none',
                        }}
                        value={testCaseForProject.precondition}
                        placeholder="Укажите предусловие для тест-кейса"
                    />
                    <TextArea
                        showCount
                        disabled={true}
                        maxLength={500}
                        style={{
                            height: 100,
                            marginTop: 30,
                            resize: 'none',
                            width: '100%',
                        }}
                        value={testCaseForProject.steps}
                        placeholder="Укажите шаги прохождения тест-кейса"
                    />
                    <TextArea
                        showCount
                        disabled={true}
                        maxLength={500}
                        style={{
                            height: 100,
                            marginTop: 30,
                            resize: 'none',
                            width: '100%',
                        }}
                        value={testCaseForProject.expected_result}
                        placeholder="Укажите ожидаемый результат"
                    />
                </Form>
            </Space>
        </div>
    );
}

export default GetTestRunResultForTestCase;