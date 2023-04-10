import React, {useContext, useState} from 'react';
import {ProjectsInfo} from "./Dashboard";
import {Button, Form, Input, Layout, message, Modal, Space, theme} from "antd";
import {createProject} from "../API/API";
import AuthContext from "../context/AuthContext";

const {Content} = Layout;

function Projects(props) {
    let {authTokens} = useContext(AuthContext)

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState([]);
    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = (e) => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const submitForm = () => {
        createProject({authTokens, projectName}).then((response) => {
            if (response.status == 201) {
                messageApi.open({
                    type: 'success',
                    content: 'Проект успешно добавлен'
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Произошла непредвиденная ошибка'
                });
            }
        });
        setProjectName(['']);
        form.resetFields();
        setIsModalOpen(false);
    };


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
                <Button type="primary" onClick={showModal} style={{float: 'right'}}>
                    Добавить проект
                </Button>
                {contextHolder}
                <Modal title="Введите название проекта" open={isModalOpen} onOk={form.submit} onCancel={handleCancel}>
                    <Form
                        form={form}
                        onFinish={submitForm}
                    >
                        <Form.Item name={'value'}>
                            <Input
                                placeholder='Имя проекта'
                                maxLength={100}
                                allowClear
                                onChange={event => setProjectName(event.target.value)}
                            ></Input>
                        </Form.Item>
                    </Form>
                </Modal>
                <ProjectsInfo></ProjectsInfo>
            </div>
        </Space>
    );
}

export default Projects;