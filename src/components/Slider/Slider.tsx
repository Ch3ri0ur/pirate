import { Slider, InputNumber, Row, Col, Divider } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    key?: string;
    value: number;
    min: number;
    max: number;
    name: string;
    index: string;
    newValueCallbackRef: React.MutableRefObject<{
        [key: string]: (value: number) => void;
    }>;
    children?: React.ReactChild;
}

// TODO add name/value/max/min etc kind of like in mysliderwrapper and style better

const CustomSlider: React.FC<Props> = (props: Props) => {
    const [inputValue, setInputValue] = useState(props.value);
    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const uuid = useStore<string>('clientUUID')[0];

    useEffect(() => {
        props.newValueCallbackRef.current[props.index] = (value: number) => {
            console.log('updating');
            if (typeof value === 'number') {
                setInputValue(value);
            }
        };
    }, []);

    useEffect(() => {
        onChange(props.value);
        return () => {};
    }, [props.value]);

    const [debouncedFunction, cancel] = useDebouncedCallback(
        // to memoize debouncedFunction we use useCallback hook.
        // In this case all linters work correctly
        useCallback((value: number) => {
            const body = {
                uuid: uuid,
                data: {
                    [props.index]: value,
                },
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

    const onChange = (value: number | string | undefined) => {
        if (typeof value === 'number') {
            debouncedFunction(value);
            setInputValue(value);
        }
    };

    // useEffect(() => {
    //     debouncedFunction(inputValue);
    // }, [inputValue]);

    return (
        <>
            {/* <Divider orientation="center">{props.name}</Divider> */}
            <Row justify="space-between" align="middle">
                <Col xs={24} lg={12} xl={8}>
                    <div>
                        Min: {props.min} - Value: {inputValue} - Max: {props.max} - Name: {props.name}
                    </div>
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={props.min}
                        max={props.max}
                        style={{ margin: '0 16px' }}
                        value={inputValue}
                        onChange={onChange}
                    />
                </Col>
                <Col xs={24} lg={12} xl={16}>
                    <Slider
                        min={props.min}
                        max={props.max}
                        onChange={onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        step={(props.max - props.min) / 1000}
                    />
                </Col>
            </Row>
        </>
    );
};

export default CustomSlider;
