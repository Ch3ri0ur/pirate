import React, { useEffect, useRef } from 'react';
import uPlot from 'uplot';

type Prop = {
    opts: uPlot.Options;
    data: uPlot.AlignedData; // | ((self: uPlot, init: Function) => void);
};
const UChart: React.FC<Prop> = (props: Prop) => {
    //
    //const [freq, setFreq] = useState(0.001);
    //const [amp, setAmp] = useState(0.5);

    // let chart: HTMLCanvasElement;

    const canvasMain = useRef<HTMLDivElement>(null);
    const refy = useRef<uPlot>();
    useEffect(() => {
        if (canvasMain.current) {
            if (props.data.length !== 0) {
                refy.current = new uPlot(props.opts, props.data, canvasMain.current);
                console.log(refy.current);
            }
        }
        return () => {
            refy.current?.destroy();
        };
    }, [props.opts]);
    useEffect(() => {
        if (canvasMain.current) {
            if (props.data.length !== 0) {
                refy.current?.setData(props.data);
            }
        }
        // return (test) => {
        //     test.destroy();
        // };
    }, [props.data]);

    useEffect(() => {
        refy?.current?.setData(props.data);
        return () => {
            // renderPlot = () => {};
            // cancelAnimationFrame(id);
        };
    }, [props.data, refy]);

    const canvasStyle = {
        width: '100%',
        height: '70vh',
    };

    return (
        <div>
            <div style={canvasStyle} ref={canvasMain} />
        </div>
    );
};

export default UChart;
