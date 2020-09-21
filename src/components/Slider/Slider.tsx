import { Slider, InputNumber, Row, Col, Divider } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    startvalue?: number;
    min: number;
    max: number;
    name: string;
    // setValue: React.Dispatch<React.SetStateAction<number>>;
    children?: React.ReactChild;
}

const CustomSlider: React.FC<Props> = (props: Props) => {
    // const [inputValue, setInputValue] = useState<number>(props.value);
    // const onChange = (value: number | string | undefined | [number, number]) => {
    //     if (!(value as number)) {
    //         return;
    //     }
    //     // props.setValue(Number(value));
    const [slidy, setSlidy] = useState(0);
    const targetUrl = useStore<string>('ProjectTargetURL')[0];

    const [debouncedFunction, cancel] = useDebouncedCallback(
        // to memoize debouncedFunction we use useCallback hook.
        // In this case all linters work correctly
        useCallback((value: number) => {
            const body = {
                name: props.name,
                value: value,
            };
            // axios
            //     .post('http://raspberrypi:3000/ctrl', {
            //         body,
            //         config,
            //     })
            //     .then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });

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
            <Slider
                min={0}
                max={100}
                onChange={(v: number) => {
                    if (typeof v === 'number') {
                        setSlidy(v);
                    }
                }}
                value={slidy}
                step={0.01}
            />
        </>
    );
};

export default CustomSlider;
