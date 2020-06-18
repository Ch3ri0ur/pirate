import React, { useEffect, useState } from 'react';
import UChart from './Chart';
import uPlot from 'uplot';

const opts: uPlot.Options = {
    title: 'Fixed length / sliding data slices',
    width: 800,
    height: 600,
    series: [
        {},
        {
            label: 'Distance',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(1) + ' cm'),
            stroke: 'red',
        },
        {
            label: 'Distance/2',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(1) + ' cm'),
            stroke: 'blue',
        },
        {
            label: 'Distance + 5',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'green',
        },
        {
            label: 'Distance - 5',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'yellow',
        },
    ],
    axes: [
        {},
        {
            scale: 'cm',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + ' cm'),
        },
        {
            side: 1,
            scale: 'mb',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
            grid: { show: false },
        },
    ],
};

interface Props {
    children?: React.ReactChild;
}

const ChartWrapper: React.FC<Props> = (props: Props) => {
    const [datar, setDatar] = useState<(number | null)[][]>([[], [], [], [], []]);

    useEffect(() => {
        console.log('I WAS IN THE USEEFFECT');
        const eventSource = new EventSource('http://raspberrypi:3000/stream');
        console.log(eventSource);
        eventSource.addEventListener('message', function eventy(e) {
            const data = JSON.parse(e.data);
            // console.log(data);
            const splitData = data.split(',').map((elm: any) => parseFloat(elm));
            console.log(splitData);

            setDatar(function doit(dat) {
                const t = dat.map((elm, idx) => {
                    let dataToAdd: null | number = splitData[idx];
                    if (idx > 0) {
                        if (dataToAdd !== null && dataToAdd > 500) {
                            dataToAdd = null;
                        }
                    } else {
                        dataToAdd = splitData[idx] / 1000;
                    }
                    const ely = elm.slice(-100);

                    return [...ely, dataToAdd];
                });
                // console.log(t);
                return t;
            });
            return () => eventSource.close();
            // console.log(datar);
        });
        // socket.on('connect', function () {
        //     console.log('connected');
        // });
        // socket.on('measurements', function test(data: string) {
        //     // console.log(data);
        //     const splitData = data.split(',').map((elm) => parseFloat(elm));
        //     console.log(splitData);

        //     setDatar(function doit(dat) {
        //         const t = dat.map((elm, idx) => {
        //             let dataToAdd: null | number = splitData[idx];
        //             if (idx > 0) {
        //                 if (dataToAdd > 500) {
        //                     dataToAdd = null;
        //                 }
        //             } else {
        //                 dataToAdd = splitData[idx] / 1000;
        //             }
        //             const ely = elm.slice(-100);

        //             return [...ely, dataToAdd];
        //         });
        //         console.log(t);
        //         return t;
        //     });
        //     // console.log(datar);
        // });
        // socket.on('disconnect', function () {
        //     console.log('disconnected');
        // });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);
    return <UChart opts={opts} data={datar} />;
};

export default ChartWrapper;
