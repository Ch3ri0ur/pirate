import React, { useEffect, useState, useRef } from 'react';
import uPlot from 'uplot';
import { createStore, useStore } from 'react-hookstore';
import useAnimationFrame from '../../util/useAnimationFrame';

const canvasStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

// TODO what units on the two scales?
// TODO set scaling better so as to not clip the scales
// TODO imporve timescale and create generic scales/make settable

let opts: uPlot.Options = {
    title: 'Control Graph',
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
            size: 80, //TODO Dynamic maybe?
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
// TODO generics colors or more/wrap id
const colors = ['red', 'blue', 'green', 'cyan', 'black', 'orange', 'purple'];
type stream_item = {
    [ids: string]: number | string;
};
type stream_package = {
    [ts: number]: stream_item;
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
let globalChartDataQueue: stream_package[] = [];
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
                    stroke: colors[parseInt(id)],
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

    // TODO put duplicate in function
    const dataHandler = () => {
        // for (const data of globalChartDataQueue) {
        // console.log(globalChartDataQueue.length);
        if (globalChartDataQueue.length === 0) {
            return;
        } else if (globalChartDataQueue.length < 3) {
            const data = globalChartDataQueue.shift();
            if (data) {
                //console.log(globalChartData);
                if (!globalChartData) {
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
                                        if (value) {
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
            }

            // }
        } else {
            const workload = globalChartDataQueue.slice(0, globalChartDataQueue.length / 2);
            globalChartDataQueue = globalChartDataQueue.slice(globalChartDataQueue.length / 2);
            for (const [id, data] of Object.entries(workload)) {
                if (data) {
                    // console.log(id, data);
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
                                            globalChartData[Number(id) + 1].push(value); // little verbose
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
                }
            }
        }

        // globalChartDataQueue = [];
        globalChartData = globalChartData.map((v) => v.splice(-chartDataMaxPoints));
        referenceToPlot?.current?.setData(globalChartData);
    };

    useEffect(() => {
        console.log(`Opening Stream at: ${targetUrl}/stream`);
        const eventSource = new EventSource(targetUrl + '/stream');
        console.log(eventSource);
        eventSource.addEventListener('message', function eventy(e) {
            const data = JSON.parse(e.data);
            // console.log(data);
            globalChartDataQueue.push(data);
        });
        return () => {
            console.log('Closing SSE EnventSource');
            console.log(eventSource);
            eventSource.close();
        };
    }, []);

    useAnimationFrame((t) => {
        if (globalChartDataQueue.length !== 0) {
            dataHandler();
        }
    });

    // TODO start stop button
    // TODO export datapoints / think of merging timestamps?
    // TODO create similar sized placholder
    return <div style={canvasStyle} ref={referenceToCanvasElement} />;
};

export default ChartCombo;
