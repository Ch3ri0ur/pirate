import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Layout, Menu } from 'antd';
import CustomSlider from '../components/Slider/Slider';
import ChartWrapper from '../components/Chart/ChartWrapper';

const { Header, Content, Footer, Sider } = Layout;

interface Props {
    children?: React.ReactChild;
}

const MyContent: React.FC<Props> = (props: Props) => {
    const [pValue, setPValue] = useState(0.5);
    const [iValue, setIValue] = useState(0.5);
    const [dValue, setDValue] = useState(0.5);
    // const throttledSettings = useRef(throttle(, 1000));
    // const [socket, setSocket] = useState<SocketIOClient.Socket>(null);
    // eslint-disable-next-line
    // const [data, setData] = useState<uPlot.AlignedData>([]);
    // const socketRef = useRef<SocketIOClient.Socket>(io('http://raspberrypi:3000'));
    // const [response, setResponse] = useState(false);
    // const [endPoint, setEndPoint] = useState('http://raspberrypi:3000');

    const [debouncedFunction, cancel] = useDebouncedCallback(
        // to memoize debouncedFunction we use useCallback hook.
        // In this case all linters work correctly
        // useCallback((pValue1: number, iValue1: number, dValue1: number) => {
        //     socket.emit('settings', [pValue1, iValue1, dValue1]);
        // }, []),
        () => console.log('heyho'),
        700,
        // The maximum time func is allowed to be delayed before it's invoked:
        { maxWait: 1000 },
    );

    return (
        <Content style={{ margin: '0 16px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>User</Breadcrumb.Item>
        <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb> */}
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                {true ? <ChartWrapper /> : <p>Sorry no data found.</p>}
            </div>
            <CustomSlider value={1} min={0} max={10} name="P-Value"></CustomSlider>
            <CustomSlider value={1} min={0} max={10} name="I-Value"></CustomSlider>
            <CustomSlider value={1} min={0} max={10} name="D-Value"></CustomSlider>
        </Content>
    );
};

export default MyContent;
