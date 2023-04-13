import React from 'react';
import {UserOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {Link, useNavigate} from "react-router-dom";
import {Avatar, Layout} from 'antd';
const {Header} = Layout;

function AppHeader(props) {

    const navigate = useNavigate();

    const handleNavigate = (url) => {
        navigate(url);
    };

    return (
        <div>
            <Header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 100,
                width: '100%',
                height: 50,
                paddingInline: 50,
                lineHeight: '64px',
            }}>
                <Avatar style={{float: 'right'}} size="large" icon={<UserOutlined/>}>
                </Avatar>
                <Title style={{color: 'white'}} level={3}>
                    <Link to="/" style={{color: 'white'}} onClick={() => handleNavigate('/')}>
                        TMS
                    </Link>
                </Title>
            </Header>
        </div>
    );
}

export default AppHeader;