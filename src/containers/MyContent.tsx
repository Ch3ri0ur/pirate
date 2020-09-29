import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Layout, Button, Menu, Modal } from 'antd';
import { Store } from 'antd/lib/form/interface';
import CustomSlider from '../components/Slider/MySliderWrapper';
import ChartCombo, { pirateConfig } from '../components/Chart/ChartCombo';
import SliderInput from '../components/Slider/SliderInput';
import VideoStream from '../components/Janus/VideoStream';
import SettingsModal from '../components/SettingsModal/SettingsModal';
import useFetch from '../util/useFetch';
import { createStore, useStore } from 'react-hookstore';

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

    const { data, loading, error } = useFetch<pirateConfig>({ url: 'https://wappler.me/getconfig' });

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
    return (
        <Content style={{ margin: '0 16px' }}>
            {loading ? <p>Loading</p> : <ChartCombo config={data} />}
            <VideoStream></VideoStream>
            {/* <CustomSlider min={0} max={10} name="P-Value"></CustomSlider>
            <CustomSlider min={0} max={10} name="I-Value"></CustomSlider>
            <CustomSlider min={0} max={10} name="D-Value"></CustomSlider>
            */}
            <Button
                type="primary"
                onClick={() => {
                    setModalVisible(true);
                }}
            >
                New Collection
            </Button>
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
