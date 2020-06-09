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
    let uplot1: uPlot;
    useEffect(() => {
        if (canvasMain.current) {
            uplot1 = new uPlot(props.opts, props.data, canvasMain.current);
        }
        // return (test) => {
        //     test.destroy();
        // };
    }, []);

    useEffect(() => {
        uplot1.setData(props.data);
        return () => {
            // renderPlot = () => {};
            // cancelAnimationFrame(id);
        };
    }, [props.data]);

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
