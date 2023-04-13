import React, {useContext, useEffect, useState} from 'react';
import {Layout, Menu, Popconfirm} from "antd";
import {
    AppstoreOutlined,
    CopyOutlined,
    FormOutlined,
    LogoutOutlined,
    PlaySquareOutlined,
    ProjectOutlined
} from "@ant-design/icons";
import AuthContext from "../../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";

const {Sider} = Layout;

function SideMenu(props) {

    const {authTokens, logoutUser} = useContext(AuthContext)
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState("/");

    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);


    const navigate = useNavigate();

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            <div style={{position: 'fixed', top: 0, left: 0, zIndex: 99, height: '100vh', paddingTop: '50px'}}>
                <Menu
                    theme="dark"
                    className="SideMenuVertical"
                    defaultSelectedKeys={['Dashboard']}
                    mode="inline"
                    selectedKeys={[selectedKeys]}
                >
                    <Menu.Item key='/' icon={<AppstoreOutlined/>} onClick={(item) => {
                        navigate(item.key)
                    }}>
                        Главная страница
                    </Menu.Item>
                    <Menu.Item key='/projects' icon={<ProjectOutlined/>} onClick={(item) => {
                        navigate(item.key)
                    }}>
                        Проекты
                    </Menu.Item>
                    <Menu.Item key='/testsuits' icon={<CopyOutlined/>} onClick={(item) => {
                        navigate(item.key)
                    }}>
                        Тест-сьюты
                    </Menu.Item>
                    <Menu.Item key='/testcases' icon={<FormOutlined/>} onClick={(item) => {
                        navigate(item.key)
                    }}>
                        Тест-кейсы
                    </Menu.Item>
                    <Menu.Item key='/testruns' icon={<PlaySquareOutlined/>} onClick={(item) => {
                        navigate(item.key)
                    }}>
                        Тестовые запуски
                    </Menu.Item>
                    <Menu.Item key='/login' icon={<LogoutOutlined/>}>
                        <Popconfirm title="Уверены, что хотите выйти?"
                                    okText="Выйти"
                                    cancelText="Отмена"
                                    trigger="click"
                                    cancelButtonProps={{ style: { float: 'right' } }}
                                    onConfirm={authTokens ? (logoutUser) :
                                        (item) => {
                                            navigate(item.key)
                                        }}
                                    >
                                <span style={{ width: '100%', height: '100%', display: 'block' }}>
                                    Выйти
                                </span>
                        </Popconfirm>
                    </Menu.Item>
                </Menu>
            </div>
        </div>
    );
}

export default SideMenu;