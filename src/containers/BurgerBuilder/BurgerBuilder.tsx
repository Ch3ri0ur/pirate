import React, { useState } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';

import { Ingredients } from './../../types';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES: Ingredients = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
};
const BASE_PRICE = 4;

const BurgerBuilder: React.FC = () => {
    const [ingredients, setIngredients] = useState<Ingredients>({
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0,
    });

    const [price, setPrice] = useState(BASE_PRICE);
    const [purchasing, setPurchasing] = useState(false);

    const addIngredientHandler = (typy: keyof Ingredients) => {
        const updatedCount = ingredients[typy] + 1;
        const updatedIngredients = { ...ingredients };
        updatedIngredients[typy] = updatedCount;
        setIngredients(updatedIngredients);
        setPrice(price + INGREDIENT_PRICES[typy]);
    };
    const subIngredientHandler = (typy: keyof Ingredients) => {
        if (ingredients[typy]) {
            const updatedCount = ingredients[typy] - 1;
            const updatedIngredients = { ...ingredients };
            updatedIngredients[typy] = updatedCount;
            setIngredients(updatedIngredients);
            setPrice(price - INGREDIENT_PRICES[typy]);
        }
    };

    return (
        <>
            <Modal setShow={setPurchasing} show={purchasing}>
                <OrderSummary setPurchasing={setPurchasing} ingredients={ingredients} price={price} />
            </Modal>

            <Burger ingredients={ingredients}></Burger>
            <BuildControls
                addIngredientHandler={addIngredientHandler}
                subIngredientHandler={subIngredientHandler}
                ingreds={ingredients}
                price={price}
                purchasable={price > BASE_PRICE}
                purchase={setPurchasing}
            ></BuildControls>
        </>
    );
};
export default BurgerBuilder;
