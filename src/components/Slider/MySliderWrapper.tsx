import React, { useState } from 'react';
import { InputNumber, Row, Col, Divider } from 'antd';
import Slider from './Slider';

// createStore('');

interface Props {
    min: number;
    max: number;
    name: string;
    startvalue?: number;
}

const MySliderWrapper: React.FC<Props> = (props: Props) => {
    const [inputMin, setInputMin] = useState<number>(props.min);
    const onChangeMin = (value: number | string | undefined) => {
        if (isNaN(value as number)) {
            return;
        }
        setInputMin(Number(value));
    };
    const [inputMax, setInputMax] = useState<number>(props.max);
    const onChangeMax = (value: number | string | undefined) => {
        if (isNaN(value as number)) {
            return;
        }
        setInputMax(Number(value));
    };
    return (
        <>
            <Divider orientation="center">{props.name}</Divider>
            <Row justify="space-between" align="middle">
                <Col>
                    <div>Min:</div>
                </Col>
                <Col>
                    <InputNumber
                        min={0}
                        max={inputMax}
                        style={{ margin: '0 16px' }}
                        step={0.01}
                        value={inputMin}
                        onChange={onChangeMin}
                    />
                </Col>
                <Col span={12}>
                    <Slider min={inputMin} max={inputMax} startvalue={props.startvalue} name={props.name}></Slider>
                </Col>
                <Col>
                    <div>Max:</div>
                </Col>
                <Col>
                    <InputNumber
                        min={inputMin}
                        max={100000}
                        style={{ margin: '0 16px' }}
                        step={0.01}
                        value={inputMax}
                        onChange={onChangeMax}
                    />
                </Col>
            </Row>
        </>
    );
};

export default MySliderWrapper;
