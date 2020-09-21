import React, { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import { readFileSync } from 'fs';
const canvasStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
type Prop = {
    opts: uPlot.Options;
    data: uPlot.AlignedData; // | ((self: uPlot, init: Function) => void);
};
const UChart: React.FC<Prop> = (props: Prop) => {
    //
    //const [freq, setFreq] = useState(0.001);
    //const [amp, setAmp] = useState(0.5);

    // let chart: HTMLCanvasElement;

    // useEffect will run on stageCanvasRef value assignment
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
            console.log('DESTROYED CHART!!1!');
        };
    }, [props.opts, refy]);

    useEffect(() => {
        const resizeListener = () => {
            // change width from the state object
            if (canvasMain.current) {
                const rectlist = canvasMain.current.getClientRects();
                const conserveHeight = refy.current?.height;
                let height = rectlist[0].height;
                if (conserveHeight) {
                    height = conserveHeight;
                }
                const width = rectlist[0].width;
                console.log(width, height);
                refy.current?.setSize({ width: width, height: height });
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
    }, [canvasMain]);

    useEffect(() => {
        refy?.current?.setData(props.data);
    }, [props.data, refy]);

    return <div style={canvasStyle} ref={canvasMain} />;
};

// function propsAreEqual(prev: Readonly<React.PropsWithChildren<Prop>>, next: Readonly<React.PropsWithChildren<Prop>>) {
//     return prev.opts === next.opts;
// }

export default UChart;
