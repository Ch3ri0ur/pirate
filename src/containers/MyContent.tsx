import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Layout, Menu } from 'antd';
import CustomSlider from '../components/Slider/MySliderWrapper';
import ChartCombo, { pirateConfig } from '../components/Chart/ChartCombo';
import SliderInput from '../components/Slider/SliderInput';
import VideoStream from '../components/Janus/VideoStream';
import useFetch from '../util/useFetch';

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

    console.log(data);
    console.log(loading);
    console.log(error);

    return (
        <Content style={{ margin: '0 16px' }}>
            {loading ? <p>Loading</p> : <ChartCombo config={data} />}
            <VideoStream></VideoStream>
            {/* <CustomSlider min={0} max={10} name="P-Value"></CustomSlider>
            <CustomSlider min={0} max={10} name="I-Value"></CustomSlider>
            <CustomSlider min={0} max={10} name="D-Value"></CustomSlider>
            <SliderInput
                disabled={false}
                readOnly={false}
                min={0}
                max={100}
                onChange={(e) => console.log(e.value)}
            ></SliderInput> */}
        </Content>
    );
};

export default MyContent;
