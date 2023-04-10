import React from 'react';
import {UserOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import {Link} from "react-router-dom";
import {Avatar, Layout} from 'antd';

const {Header} = Layout;

function AppHeader(props) {
    return (
        <div>
            <Header style={{
                height: 50,
                paddingInline: 50,
                lineHeight: '64px'
            }}>
                <Avatar style={{float: 'right'}} size="large" icon={<UserOutlined/>}>
                </Avatar>
                <Title style={{color: 'white'}} level={3}>
                    <Link to="/" style={{color: 'white'}}>TMS</Link>
                </Title>
            </Header>
        </div>
    );
}

export default AppHeader;