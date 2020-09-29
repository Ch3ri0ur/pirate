import React, { useEffect, useState, useRef } from 'react';
import uPlot from 'uplot';
import { createStore, useStore } from 'react-hookstore';

const canvasStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

let opts: uPlot.Options = {
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

type stream_item = {
    [ids: string]: number | string;
};

export type clientsend_config_type = {
    [ids: string]: { name: string; type: string };
};
export type arduinosend_config_type = {
    [ids: string]: { name: string; type: string; default: number; max: number; min: number };
};

export type pirateConfig = {
    clientsend_config: clientsend_config_type;
    arduinosend_config: arduinosend_config_type;
};

interface Props {
    config: pirateConfig | undefined;
    children?: React.ReactChild;
}

let globalChartData: (null | number)[][]; // = [[0], [0], [0], [0], [0]];

let chartDataMaxPoints = 100;

const ChartCombo: React.FC<Props> = (props: Props) => {
    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const [chartDataMaxPointsRef, setChartDataMaxPoints] = useStore<number>('chartDataMaxPoints');
    const [graphShowList, setGraphShowList] = useStore<string[]>('graphShowList');
    const referenceToCanvasElement = useRef<HTMLDivElement>(null);
    const referenceToPlot = useRef<uPlot>();

    useEffect(() => {
        chartDataMaxPoints = chartDataMaxPointsRef;
        console.log('changing global');
    }, [chartDataMaxPointsRef]);
    console.log('this is me: ', chartDataMaxPoints);
    useEffect(() => {
        console.log('configuseEffect');
        const series = [{}];
        const chartDataSkeleton: [(number | null)[]] = [[0]];
        const showList: string[] = [];
        if (props.config) {
            for (const [id, value] of Object.entries(props.config?.clientsend_config)) {
                series.push({
                    label: value.name,
                    show: true,
                    scale: 'cm',
                    spanGaps: true,
                    value: (u: any, v: any) => (v == null ? '-' : v.toFixed(1) + ' cm'),
                    stroke: 'red',
                });
                chartDataSkeleton.push([0]);
                showList.push(value.name);
            }
            setGraphShowList(showList);
            globalChartData = chartDataSkeleton;
            const tempOpts: uPlot.Options = Object.assign(opts); // not sure if copy is deep or only refs are copied
            tempOpts.series = series;
            opts = tempOpts;
            //globalChartData
        }
        return () => {};
    }, [props.config]);

    useEffect(() => {
        opts.series.forEach((v, k) => {
            if (v?.label) {
                console.log('showing series');
                console.log(k, v, referenceToPlot.current, graphShowList);
                if (graphShowList.includes(v.label)) {
                    if (referenceToPlot.current) {
                        // console.log('showing');
                        referenceToPlot.current.setSeries(k, { show: true });
                    }
                } else {
                    if (referenceToPlot.current) {
                        // console.log('hiding');
                        referenceToPlot.current.setSeries(k, { show: false });
                    }
                }
            }
        });

        return () => {};
    }, [graphShowList]);

    useEffect(() => {
        console.log('element build use effect');
        if (referenceToCanvasElement.current) {
            if (opts && globalChartData) {
                console.log('building uplot with ');
                console.log(opts);
                console.log(globalChartData);
                referenceToPlot.current = new uPlot(opts, globalChartData, referenceToCanvasElement.current);
                console.log(referenceToPlot.current);
            }
        }
        return () => {
            console.log('DESTROYED CHART!!1!');
            referenceToPlot.current?.destroy();
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

    useEffect(() => {
        console.log('I WAS IN THE USEEFFECT');
        const eventSource = new EventSource(targetUrl + '/stream');
        console.log(eventSource);
        eventSource.addEventListener('message', function eventy(e) {
            const data = JSON.parse(e.data);
            // console.log(data);
            if (globalChartData[0][0] === 0) {
                const chartDataSkeleton: [number[]] = [[]];
                if (props.config) {
                    for (const [id, value] of Object.entries(props.config?.clientsend_config)) {
                        chartDataSkeleton.push([]);
                    }
                }
                globalChartData = chartDataSkeleton;
            }

            for (const [ts, dat] of Object.entries<stream_item>(data)) {
                globalChartData[0].push(parseInt(ts) / 1000);
                // console.log(dat);

                if (props.config?.clientsend_config && dat) {
                    for (const id in Object.keys(props.config?.clientsend_config)) {
                        // console.log(id);
                        const sid = String(id);
                        if (typeof dat === 'object' && dat) {
                            if (sid in dat) {
                                const value = dat[sid];
                                if (typeof value === 'number') {
                                    if (value < 50) {
                                        globalChartData[Number(id) + 1].push(value); // little verbose
                                    } else {
                                        globalChartData[Number(id) + 1].push(null);
                                    }
                                } else {
                                    globalChartData[Number(id) + 1].push(null);
                                }
                            } else {
                                globalChartData[Number(id) + 1].push(null);
                            }
                        }
                    }
                }
            }
            globalChartData = globalChartData.map((v) => v.splice(-chartDataMaxPoints));
            referenceToPlot?.current?.setData(globalChartData);

            // const t = globalChartData.map((elm, idx) => {
            //     let dataToAdd: null | number = splitData[idx];
            //     if (idx > 0) {
            //         if (dataToAdd !== null && dataToAdd > 500) {
            //             dataToAdd = null;
            //         }
            //     } else {
            //         dataToAdd = splitData[idx] / 1000;
            //     }
            //     const ely = elm.slice(-100);
            //     return [...ely, dataToAdd];
            // });
            // referenceToPlot?.current?.setData(t);
            // globalChartData = t;

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
