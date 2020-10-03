import { Slider, InputNumber, Row, Col, Divider } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    key?: string;
    startvalue: number;
    min: number;
    max: number;
    name: string;
    index: string;
    // setValue: React.Dispatch<React.SetStateAction<number>>;
    children?: React.ReactChild;
}

// TODO add name/value/max/min etc kind of like in mysliderwrapper and style better

const CustomSlider: React.FC<Props> = (props: Props) => {
    // const [inputValue, setInputValue] = useState<number>(props.value);
    // const onChange = (value: number | string | undefined | [number, number]) => {
    //     if (!(value as number)) {
    //         return;
    //     }
    //     // props.setValue(Number(value));
    const [slidy, setSlidy] = useState(props.startvalue);
    const targetUrl = useStore<string>('ProjectTargetURL')[0];

    const [debouncedFunction, cancel] = useDebouncedCallback(
        // to memoize debouncedFunction we use useCallback hook.
        // In this case all linters work correctly
        useCallback((value: number) => {
            const body = {
                [props.index]: value,
            };

            fetch(targetUrl + '/ctrl', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(body),
            })
                .then((response) => {
                    return response.status;
                })
                .then((result) => {
                    console.log('Success:', result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }, []),

        700,
        // The maximum time func is allowed to be delayed before it's invoked:
        { maxWait: 1000 },
    );

    useEffect(() => {
        debouncedFunction(slidy);
    }, [slidy]);

    return (
        <>
            {/* <Divider orientation="center">{props.name}</Divider> */}
            <Row justify="space-between" align="middle">
                <Col xs={24} lg={12} xl={8}>
                    <div>
                        Min: {props.min} - Value: {slidy} - Max: {props.max} - Name: {props.name}
                    </div>
                </Col>
                <Col xs={24} lg={12} xl={16}>
                    <Slider
                        min={props.min}
                        max={props.max}
                        onChange={(v: number) => {
                            if (typeof v === 'number') {
                                setSlidy(v);
                            }
                        }}
                        value={slidy}
                        step={(props.max - props.min) / 1000}
                    />
                </Col>
            </Row>
        </>
    );
};

export default CustomSlider;
