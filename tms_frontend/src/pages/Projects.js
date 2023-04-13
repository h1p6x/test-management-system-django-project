import React, {useContext, useEffect, useState} from 'react';
import {ProjectsInfo} from "./Dashboard";
import {Button, Form, Input, Layout, message, Modal, Space, theme} from "antd";
import {createProject} from "../API/API";
import AuthContext from "../context/AuthContext";

const {Content} = Layout;

// function Projects(props) {
//     let {authTokens} = useContext(AuthContext)
//
//     const {
//         token: {colorBgContainer},
//     } = theme.useToken();
//
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [projectName, setProjectName] = useState([]);
//     const [form] = Form.useForm();
//
//     const [messageApi, contextHolder] = message.useMessage();
//
//     const showModal = () => {
//         setIsModalOpen(true);
//     };
//
//     const handleCancel = (e) => {
//         form.resetFields();
//         setIsModalOpen(false);
//     };
//
//     const submitForm = () => {
//         createProject({authTokens, projectName}).then((response) => {
//             if (response.status == 201) {
//                 messageApi.open({
//                     type: 'success',
//                     content: 'Проект успешно добавлен'
//                 });
//                 setProjects([...projects, projectName]);
//                 form.resetFields();
//                 setIsModalOpen(false);
//             } else {
//                 messageApi.open({
//                     type: 'error',
//                     content: 'Произошла непредвиденная ошибка'
//                 });
//             }
//         });
//         setProjectName(['']);
//         form.resetFields();
//         setIsModalOpen(false);
//     };
//
//
//     return (
//         <div style={{width: '100vw'}}>
//             <Space size={20} direction="vertical" style={{
//                 padding: 24,
//                 minHeight: 360,
//                 width: '100%',
//                 paddingTop: '50px',
//                 paddingLeft: '200px',
//                 backgroundColor: colorBgContainer
//             }}>
//                 <div
//                     style={{
//                         padding: 24,
//                         minHeight: 360,
//                         background: colorBgContainer
//                     }}
//                 >
//                     <Button type="primary" onClick={showModal} style={{float: 'right'}}>
//                         Добавить проект
//                     </Button>
//                     {contextHolder}
//                     <Modal title="Введите название проекта" open={isModalOpen} onOk={form.submit}
//                            onCancel={handleCancel}>
//                         <Form
//                             form={form}
//                             onFinish={submitForm}
//                         >
//                             <Form.Item name={'value'}>
//                                 <Input
//                                     placeholder='Имя проекта'
//                                     maxLength={100}
//                                     allowClear
//                                     onChange={event => setProjectName(event.target.value)}
//                                 ></Input>
//                             </Form.Item>
//                         </Form>
//                     </Modal>
//                     <ProjectsInfo></ProjectsInfo>
//                 </div>
//             </Space>
//         </div>
//     );
// }

function Projects(props) {
    const { authTokens } = useContext(AuthContext);
    const { token: { colorBgContainer } } = theme.useToken();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const submitForm = () => {
        createProject({ authTokens, projectName }).then((response) => {
            if (response.status === 201) {
                messageApi.open({
                    type: 'success',
                    content: 'Проект успешно добавлен'
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Произошла непредвиденная ошибка'
                });
            }
        });
        setProjectName('');
        form.resetFields();
        setIsModalOpen(false);
    };


    return (
        <div style={{width: '100vw'}}>
            <Space size={20} direction="vertical" style={{
                padding: 24,
                minHeight: 360,
                width: '100%',
                paddingTop: '50px',
                paddingLeft: '200px',
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
                    <Modal title="Введите название проекта" open={isModalOpen} onOk={form.submit}
                           onCancel={handleCancel}
                           okText="Добавить"
                           cancelText="Отмена"
                           cancelButtonProps={{ style: { float: 'right', marginLeft: "5px"} }}
                    >
                        <Form
                            form={form}
                            onFinish={submitForm}
                        >
                            <Form.Item name={'value'} rules={[{
                                required: true,
                                message: 'Пожалуйста, укажите название проекта'
                            }]}>
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
        </div>
    );
}

export default Projects;