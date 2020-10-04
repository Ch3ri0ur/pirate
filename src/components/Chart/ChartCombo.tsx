import React, { useEffect, useState, useRef } from 'react';
import uPlot from 'uplot';
import { createStore, useStore } from 'react-hookstore';
import useAnimationFrame from '../../util/useAnimationFrame';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { isConstructorDeclaration } from 'typescript';

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
        // {
        //     label: 'Distance',
        //     scale: 'cm',
        //     value: (u, v) => (v == null ? '-' : v.toFixed(1) + ' cm'),
        //     stroke: 'red',
        // },
        // {
        //     label: 'P',
        //     scale: 'cm',
        //     value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
        //     stroke: 'blue',
        // },
        // {
        //     label: 'I',
        //     scale: 'cm',
        //     value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
        //     stroke: 'green',
        // },
        // {
        //     label: 'D',
        //     scale: 'cm',
        //     value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
        //     stroke: 'yellow',
        // },
        // {
        //     label: 'Control',
        //     scale: 'cm',
        //     value: (u, v) => (v == null ? '-' : v.toFixed(2) + ' cm'),
        //     stroke: 'cyan',
        // },
    ],
    axes: [
        {},
        // {
        //     size: 80, //TODO Dynamic maybe?
        //     scale: 'cm',
        //     values: (u, vals, space) => vals.map((v) => +v.toFixed(1) + ' cm'),
        // },
        // {
        //     side: 1,
        //     scale: 'mb',
        //     values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ' MB'),
        //     grid: { show: false },
        // },
    ],
};
// TODO generics colors or more/wrap id
const colors = [
    'red',
    'blue',
    'green',
    'cyan',
    'black',
    'orange',
    'purple',
    'AntiqueWhite',
    'Aqua',
    'Brown',
    'Chartreuse',
    'magenta',
];
type stream_item = {
    [ids: string]: number | string;
};
type stream_package = {
    [ts: number]: stream_item;
};

export type clientsend_config_type = {
    [ids: string]: { name: string; type: string; scale: string };
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
let globalPauseData: (null | number)[][];
let globalPauseDataString: string;
let globalChartDataQueue: stream_package[] = [];
let graphNames: string[];
let chartDataMaxPoints = 100;
let first = true;

const ChartCombo: React.FC<Props> = (props: Props) => {
    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const [chartDataMaxPointsRef, setChartDataMaxPoints] = useStore<number>('chartDataMaxPoints');
    const [graphShowList, setGraphShowList] = useStore<string[]>('graphShowList');
    const referenceToCanvasElement = useRef<HTMLDivElement>(null);
    const referenceToPlot = useRef<uPlot>();
    const [graphIsRunning, setGraphIsRunning] = useState(true);
    const graphIsRunningRef = useRef(true);

    useEffect(() => {
        graphIsRunningRef.current = graphIsRunning;
    }, [graphIsRunning]);

    useEffect(() => {
        chartDataMaxPoints = chartDataMaxPointsRef;
        console.log('changing global');
    }, [chartDataMaxPointsRef]);
    useEffect(() => {
        console.log('configuseEffect');
        const series = [{}];
        const axes = [{}];
        const knownScales = new Set<string>();
        const chartDataSkeleton: [(number | null)[]] = [[]];
        const showList: string[] = [];
        graphNames = ['Timestamp'];
        if (props.config) {
            for (const [id, value] of Object.entries(props.config?.clientsend_config)) {
                let unit = '';
                const matches = value.scale.match(/\[(.*?)\]/);
                if (matches) {
                    unit = matches[1];
                }
                series.push({
                    label: value.name,
                    show: true,
                    scale: value.scale,
                    spanGaps: true,
                    value: (u: any, v: any) => (v == null ? '-' : v.toFixed(1) + ' ' + unit),
                    stroke: colors[parseInt(id) % colors.length],
                });
                graphNames.push(value.name);
                if (!knownScales.has(value.scale)) {
                    axes.push({
                        side: knownScales.size ? 1 : 3,
                        size: 80, //TODO Dynamic maybe?
                        label: value.scale,
                        scale: value.scale,
                        stroke: colors[parseInt(id) % colors.length],
                        values: (u: any, vals: any, space: any) => vals.map((v: any) => +v.toFixed(1) + ' ' + unit),
                    });
                    knownScales.add(value.scale);
                }
                chartDataSkeleton.push([0]);
                showList.push(value.name);
            }
            setGraphShowList(showList);
            globalChartData = chartDataSkeleton;
            const tempOpts: uPlot.Options = Object.assign(opts); // not sure if copy is deep or only refs are copied
            tempOpts.series = series;
            tempOpts.axes = axes;
            opts = tempOpts;
            //globalChartDatamin
        }
        return () => {};
    }, [props.config]);

    useEffect(() => {
        opts.series.forEach((v, k) => {
            if (v?.label) {
                console.log('showing series');
                console.log(k, v, referenceToPlot.current, graphShowList);
                if (referenceToPlot.current?.setSeries) {
                    referenceToPlot.current.setSeries(k, { show: graphShowList.includes(v.label) });
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
            dealWithQueueData(data, props?.config?.clientsend_config);

            // }
        } else {
            const workload = globalChartDataQueue.slice(0, globalChartDataQueue.length / 2);
            globalChartDataQueue = globalChartDataQueue.slice(globalChartDataQueue.length / 2);
            for (const [id, data] of Object.entries(workload)) {
                dealWithQueueData(data, props?.config?.clientsend_config);
            }
        }
        // globalChartDataQueue = [];
        globalChartData = globalChartData.map((v) => v.splice(-chartDataMaxPoints));
        if (graphIsRunningRef.current) {
            referenceToPlot?.current?.setData(globalChartData);
            first = true;
            globalPauseDataString = '';
        } else {
            if (first) {
                globalPauseDataString = JSON.stringify(globalChartData);
                globalPauseData = JSON.parse(globalPauseDataString);
                referenceToPlot?.current?.setData(globalPauseData);
                first = false;
            }
        }
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
    // TODO create similar sized placeholder
    console.log('Rendering Chart: ' + graphIsRunning);
    return (
        <>
            <div style={canvasStyle} ref={referenceToCanvasElement} />
            {graphIsRunning ? (
                <Button onClick={() => setGraphIsRunning(false)}>Stop</Button>
            ) : (
                <Space>
                    <Button onClick={() => setGraphIsRunning(true)}>Start</Button>
                    <Button type="primary" icon={<DownloadOutlined />} onClick={exportToJson}>
                        Download
                    </Button>
                </Space>
            )}
        </>
    );
};

export default ChartCombo;

function dealWithQueueData(data: stream_package | undefined, clientsend_config: clientsend_config_type | undefined) {
    if (data && clientsend_config && globalChartData) {
        //console.log(globalChartData );
        for (const [ts, dat] of Object.entries<stream_item>(data)) {
            globalChartData[0].push(parseInt(ts) / 1000);
            // console.log(dat);
            if (clientsend_config && dat) {
                for (const id in Object.keys(clientsend_config)) {
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

const exportToJson = () => {
    let downloadJSONString = globalPauseDataString;

    const items = globalPauseData;
    const replacer = (value: any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = graphNames;
    const tanspose = (m: any) => m[0].map((x: any, i: any) => m.map((x: any) => replacer(x[i])));

    const array = tanspose(globalPauseData);

    array.unshift(header);

    const joinedarray = array.map((subarray: any) => subarray.join(','));
    const csv = joinedarray.join('\n');
    // const csv = items.map((row) => header.map((fieldName: any) => JSON.stringify(row[fieldName], replacer)).join(','));
    // csv.unshift(header.join(','));
    // const csvstring = csv.join('\r\n');

    // console.log(csvstring);

    // const list = JSON.parse(downloadJSONString);
    // const mappedObject: { [key: string]: [] } = {};
    // if (list.length === graphNames.length) {
    //     list.forEach(function (sublist: any, index: number, array: any) {
    //         mappedObject[graphNames[index]] = sublist;
    //     });
    //     downloadJSONString = JSON.stringify(mappedObject);
    // }

    const filename = 'export.csv';
    const contentType = 'data:text/csv;charset=utf-8;';
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        const blob = new Blob([decodeURIComponent(encodeURI(csv))], { type: contentType });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        const a = document.createElement('a');
        a.download = filename;
        a.href = 'data:' + contentType + ',' + encodeURIComponent(csv);
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
