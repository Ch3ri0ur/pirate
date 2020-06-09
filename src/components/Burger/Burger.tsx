import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import { Ingredients } from './../../types';

interface Props {
    ingredients: Ingredients;
}

const Burger: React.FC<Props> = (props: Props) => {
    let transformedIngredients = (Object.keys(props.ingredients) as Array<keyof Ingredients>)
        .map((igKey) => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            });
        })
        .reduce((p, c) => p.concat(c), []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = [<p key="test">Please add some ingredients</p>];
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default Burger;
