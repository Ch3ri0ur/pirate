import { Slider, InputNumber, Row, Col, Divider } from 'antd';
import React, { useState } from 'react';

interface Props {
    value: number;
    min: number;
    max: number;
    name: string;
    // setValue: React.Dispatch<React.SetStateAction<number>>;
    children?: React.ReactChild;
}

const CustomSlider: React.FC<Props> = (props: Props) => {
    const [inputValue, setInputValue] = useState<number>(props.value);
    const onChange = (value: number | string | undefined | [number, number]) => {
        if (!(value as number)) {
            return;
        }
        // props.setValue(Number(value));
        setInputValue(Number(value));
    };
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
            <Divider orientation="left">{props.name}</Divider>
            <Row>
                <Col span={3}>
                    <p>Min:</p>
                </Col>
                <Col span={3}>
                    <InputNumber
                        min={0}
                        max={inputMax}
                        style={{ margin: '0 16px' }}
                        step={0.01}
                        value={inputMin}
                        onChange={onChangeMin}
                    />
                </Col>
                <Col span={3}>
                    <p>Value:</p>
                </Col>
                <Col span={3}>
                    <InputNumber
                        min={inputMin}
                        max={inputMax}
                        style={{ margin: '0 16px' }}
                        step={0.01}
                        value={inputValue}
                        onChange={onChange}
                    />
                </Col>
                <Col span={3}>
                    <p>Max:</p>
                </Col>
                <Col span={3}>
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

            <Row>
                <Col span={18}>
                    <Slider min={inputMin} max={inputMax} onChange={onChange} value={inputValue} step={0.01} />
                </Col>
            </Row>
        </>
    );
};

export default CustomSlider;
