import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Layout from './components/Layout/Layout';

import MemoSider from './components/UI/Sider/MySider';
import MyContent from './containers/MyContent';
import { createStore, useStore } from 'react-hookstore';
import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

createStore('ProjectTargetURL', window.origin);
createStore('chartDataMaxPoints', 100);
createStore<string[]>('graphShowList', []);


const App: React.FC = () => {

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* <MemoSider></MemoSider> */}
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    <h3 style={{ color: 'white', margin: ' 0 20px ' }}>This is the first Project</h3>
                </Header>
                <MyContent></MyContent>
                <Footer style={{ textAlign: 'center' }}>This is a very nice Footer</Footer>
            </Layout>
        </Layout>
    );
};


export default App;
