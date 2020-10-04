import React, { useEffect, useRef } from 'react';
import { useStore } from 'react-hookstore';
import { pirateConfig } from '../SettingsModal/SettingsModal';
import CustomSlider from './Slider';

interface Props {
    children?: React.ReactChild;
    config: pirateConfig;
}

// TODO handle strings / char securely and enable return

const SliderList: React.FC<Props> = (props: Props) => {
    const targetUrl = useStore<string>('ProjectTargetURL')[0];
    const uuid = useStore<string>('clientUUID')[0];
    const sliderCallbackRef = useRef<{ [key: string]: (value: number) => void }>({});
    console.log('in sliderlist', props.config);
    let listOfSliders = Object.entries(props.config?.arduinosend_config).map(([k, v]) => {
        console.log('test', k, v);
        // TODO check if string/char / bool and handle accordingly
        return (
            <CustomSlider
                key={v.name}
                index={k}
                min={v.min}
                max={v.max}
                name={v.name}
                value={v.default}
                newValueCallbackRef={sliderCallbackRef}
            >
                {v.name}
            </CustomSlider>
        );
    });
    useEffect(() => {
        listOfSliders = Object.entries(props.config?.arduinosend_config).map(([k, v]) => {
            console.log('test', k, v);
            return (
                <CustomSlider
                    key={v.name}
                    index={k}
                    min={v.min}
                    max={v.max}
                    name={v.name}
                    value={v.default}
                    newValueCallbackRef={sliderCallbackRef}
                >
                    {v.name}
                </CustomSlider>
            );
        });
        return () => {};
    }, [props.config]);
    console.log(listOfSliders);
    useEffect(() => {
        console.log(`Opening Stream at: ${targetUrl}/configUpdates`);
        const eventSource = new EventSource(targetUrl + '/configUpdates');
        eventSource.addEventListener('message', function configUpdate(e) {
            const data = JSON.parse(e.data);
            console.log('want to update');
            console.log(data);
            if (data.uuid !== uuid) {
                console.log(
                    'calling callback if ',
                    sliderCallbackRef.current,
                    data.data.id,
                    sliderCallbackRef.current[parseInt(data.data.id)],
                );
                if (sliderCallbackRef.current && sliderCallbackRef.current[data.data.id])
                    sliderCallbackRef.current[data.data.id](data.data.value);
                // TODO mutate the arduinosend_config securely with new default value
                // props.config.arduinosend_config[data.data];
            }
        });
        return () => {
            console.log('Closing SSE EnventSource');
            console.log(eventSource);
            eventSource.close();
        };
    }, []);
    return <>{listOfSliders}</>;
};

export default SliderList;
