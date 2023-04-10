import React, {useContext, useEffect, useState} from 'react';
import AuthContext from "../context/AuthContext";
import {useNavigate, useParams} from "react-router-dom";
import {Breadcrumb, Button, Form, Input, message, Popconfirm, Select, Space, theme} from "antd";
import {deleteTestCase, editTestCase, getProjects, getTestCaseDetail, getTestCasePriority} from "../API/API";

function GetCaseInfoById(props) {

    let {authTokens} = useContext(AuthContext)
    const {projectId, testSuitId, testCaseId} = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const [testCaseEdit, setTestCaseEdit] = useState(
        {title: '', priority: '', estimate: '', precondition: '', steps: '', expected_result: ''}
    );
    const [testCaseDetail, setTestCaseDetail] = useState({
        title: '',
        priority: '',
        estimate: '',
        precondition: '',
        steps: '',
        expected_result: ''
    });
    const navigate = useNavigate();
    const projectIdInt = +projectId;
    const [loading, setLoading] = useState(false);
    const [prioritySelect, setPrioritySelect] = useState([
        {value: '', label: ''}
    ]);
    const [testProject, setTestProject] = useState({
        id: '', status: '', name: ''
    });
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const {TextArea} = Input;
    const [testCaseEditForm] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    console.log('projectId', projectId, 'testSuitId', testSuitId, 'testCaseId', testCaseId);

    const submitCaseForm = async () => {
        editTestCase({
            authTokens, projectId, testSuitId,
            testCaseId, testCaseDetail
        }).then((response) => {
            if (response.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Тест-кейс успешно отредактирован'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Произошла непредвиденная ошибка'
                });
            }
        });
    };

    const testCaseDeleting = async () => {
        try {
            const response = await deleteTestCase({
                authTokens, projectId,
                testSuitId, testCaseId
            });
            if (response.status === 204) {
                message.success('Тест-кейс успешно удален'); // Используем message.success() для отображения сообщения об успешном удалении
                navigate(`/projects/${projectId}/testsuits/${testSuitId}`);
            } else {
                message.error('Произошла непредвиденная ошибка'); // Используем message.error() для отображения сообщения об ошибке
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    priorityRes,
                    detailRes,
                    testProjectsRes,
                ] = await Promise.all([
                    getTestCasePriority({authTokens}),
                    getTestCaseDetail({authTokens, projectId, testSuitId, testCaseId}),
                    getProjects({authTokens})
                ]);
                const newPriority = priorityRes.results.map((object) => {
                    return {value: object.name, label: object.name};
                });


                setTestCaseDetail({
                    title: detailRes[0].title,
                    priority: detailRes[0].priority,
                    estimate: detailRes[0].estimate,
                    precondition: detailRes[0].precondition,
                    steps: detailRes[0].steps,
                    expected_result: detailRes[0].expected_result
                });
                setPrioritySelect(newPriority);
                setLoading(false);

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
    }, [projectId, authTokens, testSuitId, testCaseId]);

    const handleTitleChange = (e) => {
        const updatedTestCaseDetail = {...testCaseDetail};
        updatedTestCaseDetail.title = e.target.value;
        setTestCaseDetail(updatedTestCaseDetail);
    };

    const handlePriorityChange = (e) => {
        const updatedTestCaseDetail = {...testCaseDetail};
        updatedTestCaseDetail.priority = e;
        setTestCaseDetail(updatedTestCaseDetail);
    };

    const handleEstimateChange = (e) => {
        const updatedTestCaseDetail = {...testCaseDetail};
        updatedTestCaseDetail.estimate = e.target.value;
        setTestCaseDetail(updatedTestCaseDetail);
    };

    const handlePreconditionChange = (e) => {
        const updatedTestCaseDetail = {...testCaseDetail};
        updatedTestCaseDetail.precondition = e.target.value;
        setTestCaseDetail(updatedTestCaseDetail);
    };

    const handleStepsChange = (e) => {
        const updatedTestCaseDetail = {...testCaseDetail};
        updatedTestCaseDetail.steps = e.target.value;
        setTestCaseDetail(updatedTestCaseDetail);
    };

    const handleExpectedResultChange = (e) => {
        const updatedTestCaseDetail = {...testCaseDetail};
        updatedTestCaseDetail.expected_result = e.target.value;
        setTestCaseDetail(updatedTestCaseDetail);
    };


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
                    <Breadcrumb.Item>Тест-кейсы</Breadcrumb.Item>
                    <Breadcrumb.Item>{testCaseDetail.title}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{
                    display: testProject.status ===
                    'Open' ? 'block' : 'none', justifyContent: 'space-between', float: 'right'
                }}>
                    {isEditing ? (
                        <Button type="primary" style={{marginRight: '10px'}} onClick={() => {
                            setIsEditing(false);
                            submitCaseForm();
                        }}>
                            Сохранить изменения
                        </Button>
                    ) : (
                        <Button type="dashed" danger
                                style={{marginRight: '10px', borderColor: 'orange', color: 'orange'}}
                                onClick={() => setIsEditing(true)}>
                            Редактировать тест-кейс
                        </Button>
                    )}
                    <Popconfirm title="Уверены, что хотите удалить тест-кейс?"
                                onConfirm={() => testCaseDeleting()}>
                        <Button type="primary" danger>
                            Удалить тест-кейс
                        </Button>
                    </Popconfirm>
                </div>
                {contextHolder}
                <Form
                    form={testCaseEditForm}
                >
                    <Input
                        placeholder='Название тест-кейса'
                        maxLength={255}
                        style={{
                            marginTop: 5,
                            width: '100%',
                        }}
                        allowClear
                        disabled={!isEditing}
                        value={testCaseDetail.title}
                        onChange={handleTitleChange}
                    />
                    <Select
                        allowClear
                        style={{
                            marginTop: 30,
                            width: '100%',
                        }}
                        placeholder="Пожалуйста, выберите приоритет тест-кейса"
                        disabled={!isEditing}
                        value={testCaseDetail.priority}
                        onChange={handlePriorityChange}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={prioritySelect}
                    />
                    <TextArea
                        showCount
                        maxLength={200}
                        style={{
                            height: 90,
                            marginTop: 30,
                            resize: 'none',
                            width: '100%',
                        }}
                        disabled={!isEditing}
                        value={testCaseDetail.estimate}
                        onChange={handleEstimateChange}
                        placeholder="Укажите оценку трудозатрат"
                    />
                    <TextArea
                        showCount
                        maxLength={500}
                        style={{
                            height: 100,
                            marginTop: 30,
                            resize: 'none',
                        }}
                        disabled={!isEditing}
                        value={testCaseDetail.precondition}
                        onChange={handlePreconditionChange}
                        placeholder="Укажите предусловие для тест-кейса"
                    />
                    <TextArea
                        showCount
                        maxLength={500}
                        style={{
                            height: 100,
                            marginTop: 30,
                            resize: 'none',
                            width: '100%',
                        }}
                        disabled={!isEditing}
                        value={testCaseDetail.steps}
                        onChange={handleStepsChange}
                        placeholder="Укажите шаги прохождения тест-кейса"
                    />
                    <TextArea
                        showCount
                        maxLength={500}
                        style={{
                            height: 100,
                            marginTop: 30,
                            resize: 'none',
                            width: '100%',
                        }}
                        disabled={!isEditing}
                        value={testCaseDetail.expected_result}
                        onChange={handleExpectedResultChange}
                        placeholder="Укажите ожидаемый результат"
                    />
                </Form>
                {contextHolder}
            </Space>
        </div>
    );
}

export default GetCaseInfoById;