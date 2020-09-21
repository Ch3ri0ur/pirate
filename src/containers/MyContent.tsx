import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Layout, Menu } from 'antd';
import CustomSlider from '../components/Slider/MySliderWrapper';
import ChartCombo from '../components/Chart/ChartCombo';
import SliderInput from '../components/Slider/SliderInput';
import VideoStream from '../components/Janus/VideoStream';

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

    return (
        <Content style={{ margin: '0 16px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb> <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}> */}

            {true ? <ChartCombo /> : <p>Sorry no data found.</p>}
            <VideoStream></VideoStream>
            <CustomSlider min={0} max={10} name="P-Value"></CustomSlider>
            <CustomSlider min={0} max={10} name="I-Value"></CustomSlider>
            <CustomSlider min={0} max={10} name="D-Value"></CustomSlider>
            <SliderInput
                disabled={false}
                readOnly={false}
                min={0}
                max={100}
                onChange={(e) => console.log(e.value)}
            ></SliderInput>
        </Content>
    );
};

export default MyContent;
