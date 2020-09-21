import React from 'react';
import classes from './SliderInput.module.css';

interface Props {
    children?: React.ReactChild;
    onChange: (e: React.InputHTMLAttributes<HTMLInputElement>) => void;
    disabled: boolean;
    readOnly: boolean;
    min: number;
    max: number;
}

const SliderInput: React.FC<Props> = (props: Props) => {
    return (
        <input
            className={classes.slider}
            type="range"
            disabled={props.disabled}
            min={props.min}
            max={props.max}
            readOnly={props.readOnly}
            onChange={props.onChange}
        />
    );
};

export default SliderInput;
