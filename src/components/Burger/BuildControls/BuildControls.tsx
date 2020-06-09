import React, { Dispatch } from 'react';
import classes from './BuildControls.module.css';
import BuildControl from './BuildControl';
import { Ingredients } from './../../../types';

const controls = [
    { label: 'Salad', type: 'salad' as keyof Ingredients },
    { label: 'Bacon', type: 'bacon' as keyof Ingredients },
    { label: 'Cheese', type: 'cheese' as keyof Ingredients },
    { label: 'Meat', type: 'meat' as keyof Ingredients },
];

interface Props {
    addIngredientHandler: (typy: keyof Ingredients) => void;
    subIngredientHandler: (typy: keyof Ingredients) => void;
    ingreds: Ingredients;
    price: number;
    purchasable: boolean;
    purchase: Dispatch<React.SetStateAction<boolean>>;
}

const BuildControls: React.FC<Props> = (props: Props) => {
    return (
        <div className={classes.BuildControls}>
            <p>
                Price is: <strong>{props.price.toFixed(2)}€</strong>
            </p>
            {controls.map((ctrl) => (
                <BuildControl
                    disabled={props.ingreds[ctrl.type] === 0}
                    subIngredientHandler={() => props.subIngredientHandler(ctrl.type)}
                    addIngredientHandler={() => props.addIngredientHandler(ctrl.type)}
                    key={ctrl.label}
                    label={ctrl.label}
                ></BuildControl>
            ))}
            <button disabled={!props.purchasable} className={classes.OrderButton} onClick={() => props.purchase(true)}>
                ORDER NOW
            </button>
        </div>
    );
};

export default BuildControls;
