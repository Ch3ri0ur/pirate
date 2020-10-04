import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Layout, Button, Menu, Modal, Row, Col, Space } from 'antd';
import { Store } from 'antd/lib/form/interface';
import CustomSlider from '../components/Slider/Slider';
import ChartCombo, { pirateConfig } from '../components/Chart/ChartCombo';
import SliderInput from '../components/Slider/SliderInput';
import VideoStream from '../components/Janus/VideoStream';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import useFetch from '../util/useFetch';
import { createStore, useStore } from 'react-hookstore';
import SliderList from '../components/Slider/SliderList';

const { Header, Content, Footer, Sider } = Layout;

interface Props {
    children?: React.ReactChild;
}

const MyContent: React.FC<Props> = (props: Props) => {
    // const [pValue, setPValue] = useState(0.5);
    // const [iValue, setIValue] = useState(0.5);
    // const [dValue, setDValue] = useState(0.5);
    // const throttledSettings = useRef(throttle(, 1000));
    // const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    // eslint-disable-next-line
    // const [data, setData] = useState<uPlot.AlignedData>([]);
    // const socketRef = useRef<SocketIOClient.Socket>(io('http://raspberrypi:3000'));
    // const [response, setResponse] = useState(false);
    // const [endPoint, setEndPoint] = useState('http://raspberrypi:3000');

    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const { data, loading, error } = useFetch<pirateConfig>({ url: targetUrl + '/getconfig' });

    const [modalVisible, setModalVisible] = useState(false);
    console.log(data);
    console.log(loading);
    console.log(error);

    const handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        console.log(e);
        setModalVisible(false);
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        console.log(e);
        setModalVisible(false);
    };
    function onCreate<T>(values: T) {
        console.log('Received values of form: ', values);
        setModalVisible(false);
    }

    // TODO check for bool/ string and handle accordingly

    // TODO later create tests / encapsulate some functionality to enable tests
    // TODO style better
    // TODO create subcomponents
    //
    return (
        <Content style={{ margin: '0 16px' }}>
            <Row>
                <Col span={24}>{loading ? <p>Loading</p> : <ChartCombo config={data} />}</Col>
            </Row>
            <Row>
                <Col xs={24} md={12} xl={16}>
                    <div style={{ margin: 8 }}>
                        {data ? <SliderList config={data}></SliderList> : <p>no configuration data</p>}
                        <Button
                            type="primary"
                            onClick={() => {
                                setModalVisible(true);
                            }}
                        >
                            Config Options
                        </Button>
                    </div>
                </Col>
                <Col xs={24} md={12} xl={8}>
                    <VideoStream></VideoStream>
                </Col>
            </Row>
            <SettingsModal
                visible={modalVisible}
                onCreate={onCreate}
                onCancel={() => {
                    setModalVisible(false);
                }}
                config={data}
            />
        </Content>
    );
};

export default MyContent;
