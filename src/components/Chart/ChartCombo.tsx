import React, { useEffect, useState, useRef } from 'react';
import uPlot from 'uplot';
import { createStore, useStore } from 'react-hookstore';

const canvasStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

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
            label: 'P',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'blue',
        },
        {
            label: 'I',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'green',
        },
        {
            label: 'D',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'yellow',
        },
        {
            label: 'Control',
            scale: 'cm',
            value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
            stroke: 'cyan',
        },
    ],
    axes: [
        {},
        {
            scale: 'cm',
            values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + ' cm'),
        },
        // {
        //     side: 1,
        //     scale: 'mb',
        //     values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
        //     grid: { show: false },
        // },
    ],
};

interface Props {
    children?: React.ReactChild;
}

let globalChartData: (null | number)[][] = [[0], [0], [0], [0], [0]];

const ChartCombo: React.FC<Props> = (props: Props) => {
    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const referenceToCanvasElement = useRef<HTMLDivElement>(null);
    const referenceToPlot = useRef<uPlot>();
    useEffect(() => {
        if (referenceToCanvasElement.current) {
            if (globalChartData.length !== 0) {
                referenceToPlot.current = new uPlot(opts, globalChartData, referenceToCanvasElement.current);
                console.log(referenceToPlot.current);
            }
        }
        return () => {
            referenceToPlot.current?.destroy();
            console.log('DESTROYED CHART!!1!');
        };
    }, [opts, referenceToPlot]);

    useEffect(() => {
        const resizeListener = () => {
            // change width from the state object
            if (referenceToCanvasElement.current) {
                const rectlist = referenceToCanvasElement.current.getClientRects();
                const conserveHeight = referenceToPlot.current?.height;
                let height = rectlist[0].height;
                if (conserveHeight) {
                    height = conserveHeight;
                }
                const width = rectlist[0].width;
                console.log(width, height);
                referenceToPlot.current?.setSize({ width: width, height: height });
            }
        };
        resizeListener();
        // set resize listener
        window.addEventListener('resize', resizeListener);

        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        };
    }, [referenceToCanvasElement]);

    // useEffect(() => {
    //     referenceToPlot?.current?.setData(props.data);
    // }, [props.data, referenceToPlot]);

    useEffect(() => {
        console.log('I WAS IN THE USEEFFECT');
        const eventSource = new EventSource(targetUrl + '/stream');
        console.log(eventSource);
        eventSource.addEventListener('message', function eventy(e) {
            const data = JSON.parse(e.data);
            // console.log(data);
            const splitData = data.split(',').map((elm: any) => parseFloat(elm));
            // console.log(splitData);

            const t = globalChartData.map((elm, idx) => {
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
            referenceToPlot?.current?.setData(t);
            globalChartData = t;

            // console.log(datar);
        });
        return () => {
            console.log('Closing SSE EnventSource');
            console.log(eventSource);
            eventSource.close();
        };
    }, []);

    return <div style={canvasStyle} ref={referenceToCanvasElement} />;
};

export default ChartCombo;
