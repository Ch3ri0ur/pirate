import React, { useState, useEffect } from 'react';
// import Layout from './components/Layout/Layout';
// import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import { Layout, Menu } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import UChart from './components/Chart/Chart';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// function getData() {
//     return Math.random();
// }

const opts = {
    title: 'Fixed length / sliding data slices',
    width: 1600,
    height: 600,
    series: [
        {},
        {
            label: 'CPU',
            scale: '%',
            value: (u, v) => (v == null ? '-' : v.toFixed(1) + '%'),
            stroke: 'red',
        },
        {
            label: 'RAM',
            scale: '%',
            value: (u, v) => (v == null ? '-' : v.toFixed(1) + '%'),
            stroke: 'blue',
        },
        {
            label: 'TCP Out',
            scale: 'mb',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' MB'),
            stroke: 'green',
        },
    ],
    axes: [
        {},
        {
            scale: '%',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + '%'),
        },
        {
            side: 1,
            scale: 'mb',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
            grid: { show: false },
        },
    ],
};

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [count, setCount] = useState(0);
    // eslint-disable-next-line
    const [data, setData] = useState([
        [0, 1, 2, 3, 4, 5],
        [0, 1, 2, 3, 4, 5],
    ]);

    const tick = () => {
        setCount((county) => {
            console.log(county);
            return county + 1;
        });
    };

    useEffect(() => {
        setData((dat) => {
            if (dat) {
                const firstLength = dat[0]?.y?.length;
                if (!firstLength) {
                    return dat;
                }
                const firsty = dat[0]?.y;
                if (!firsty) {
                    return dat;
                }
                const first: Float32Array = firsty as Float32Array;
                const result = new Float32Array(firstLength);
                const instertArray = [Math.sin((Math.PI / 90) * count)];
                result.set(first.slice(instertArray.length));
                result.set(instertArray, firstLength - instertArray.length);
                return [{ ...dat[0], y: result }];
            } else {
                return dat;
            }
        });
    }, [count]);

    useEffect(() => {
        const timerID = setInterval(() => tick(), 100);

        return () => {
            console.log('stopping timer');
            clearInterval(timerID);
        };
        // eslint-disable-next-line
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(coll) => setCollapsed(coll)}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<PieChartOutlined />}>
                        Option 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined />}>
                        Option 2
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined />} />
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    <h3 style={{ color: 'white', margin: ' 0 20px ' }}>This is the first Project</h3>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb> */}
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <UChart opts={opts} data={data} />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};

// {/* <BurgerBuilder></BurgerBuilder> */}

export default App;
