import React from 'react';
import classes from './BuildControl.module.css';

interface Props {
    label: string;
    addIngredientHandler: () => void;
    subIngredientHandler: () => void;
    disabled: boolean;
}

const BuildControl: React.FC<Props> = (props: Props) => {
    return (
        <div className={classes.BuildControl}>
            <div className={classes.Label}>{props.label}</div>
            <button disabled={props.disabled} onClick={props.subIngredientHandler} className={classes.Less}>
                Less
            </button>
            <button onClick={props.addIngredientHandler} className={classes.More}>
                More
            </button>
        </div>
    );
};

export default BuildControl;
