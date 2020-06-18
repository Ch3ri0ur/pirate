import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Layout from './components/Layout/Layout';
// import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import { Layout, Menu } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import UChart from './components/Chart/Chart';
import { useDebouncedCallback } from 'use-debounce';

import uPlot from 'uplot';
import io from 'socket.io-client';
import CustomSlider from './components/Slider/Slider';
// import throttle from './util/throttle';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const opts: uPlot.Options = {
    title: 'Fixed length / sliding data slices',
    width: 800,
    height: 600,
    series: [
        {},
        {
            label: 'Distance',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(1) + ' cm'),
            stroke: 'red',
        },
        {
            label: 'Distance/2',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(1) + ' cm'),
            stroke: 'blue',
        },
        {
            label: 'Distance + 5',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'green',
        },
        {
            label: 'Distance - 5',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'yellow',
        },
    ],
    axes: [
        {},
        {
            scale: 'cm',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + ' cm'),
        },
        {
            side: 1,
            scale: 'mb',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
            grid: { show: false },
        },
    ],
};

const socket = io('http://raspberrypi:3000');

const App: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [pValue, setPValue] = useState(0.5);
    const [iValue, setIValue] = useState(0.5);
    const [dValue, setDValue] = useState(0.5);
    const [datar, setDatar] = useState<(number | null)[][]>([[], [], [], [], []]);
    // const throttledSettings = useRef(throttle(, 1000));
    // const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    // eslint-disable-next-line
    // const [data, setData] = useState<uPlot.AlignedData>([]);
    // const socketRef = useRef<SocketIOClient.Socket>(io('http://raspberrypi:3000'));
    // const [response, setResponse] = useState(false);
    // const [endPoint, setEndPoint] = useState('http://raspberrypi:3000');

    useEffect(() => {
        socket.on('connect', function () {
            console.log('connected');
        });
        socket.on('measurements', function (data: string) {
            // console.log(data);
            const splitData = data.split(',').map((elm) => parseFloat(elm));
            // console.log(splitData);

            setDatar((dat) => {
                const t = dat.map((elm, idx) => {
                    let dataToAdd: null | number = splitData[idx];
                    if (idx > 0) {
                        if (dataToAdd > 500) {
                            dataToAdd = null;
                        }
                    } else {
                        dataToAdd = splitData[idx] / 1000;
                    }
                    const ely = elm.slice(-100);

                    return [...ely, dataToAdd];
                });
                // console.log(t);
                return t;
            });
            // console.log(datar);
        });
        socket.on('disconnect', function () {
            console.log('disconnected');
        });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    const [debouncedFunction, cancel] = useDebouncedCallback(
        // to memoize debouncedFunction we use useCallback hook.
        // In this case all linters work correctly
        useCallback((pValue1: number, iValue1: number, dValue1: number) => {
            socket.emit('settings', [pValue1, iValue1, dValue1]);
        }, []),
        700,
        // The maximum time func is allowed to be delayed before it's invoked:
        { maxWait: 1000 },
    );

    useEffect(() => {
        debouncedFunction(pValue, iValue, dValue);
    }, [pValue, iValue, dValue]);

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
                        {datar ? <UChart opts={opts} data={datar} /> : <p>Sorry no data found.</p>}
                    </div>
                    <CustomSlider value={pValue} setValue={setPValue} min={0} max={10} name="P-Value"></CustomSlider>
                    <CustomSlider value={iValue} setValue={setIValue} min={0} max={10} name="I-Value"></CustomSlider>
                    <CustomSlider value={dValue} setValue={setDValue} min={0} max={10} name="D-Value"></CustomSlider>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
};

// {/* <BurgerBuilder></BurgerBuilder> */}

export default App;
