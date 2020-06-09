import React, { useEffect } from 'react';
import { Button } from 'antd';

import { Ingredients } from './../../../types';

interface Props {
    ingredients: Ingredients;
    price: number;
    setPurchasing: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderSummary: React.FC<Props> = (props: Props) => {
    console.log(Object.entries(props.ingredients));
    useEffect(() => {
        console.log('inside');
        return () => {
            console.log('cleanup');
        };
    });

    return (
        <>
            <h3>Your Order</h3>
            <p>This is a very fine burger consisting of:</p>
            <ul>
                {Object.entries(props.ingredients).map((key: [string, number]) =>
                    key[1] ? (
                        <li key={key[0]}>
                            <span style={{ textTransform: 'capitalize' }}>{key[0]}</span>: {key[1]}
                        </li>
                    ) : null,
                )}
            </ul>
            <p>
                <strong>The prices comes to: {props.price.toFixed(2)}€</strong>
            </p>
            <p>Continue to Checkout?</p>
            <Button type="default" danger style={{ margin: '10px' }} onClick={() => props.setPurchasing(false)}>
                CANCEL
            </Button>
            <Button type="primary" style={{ margin: '10px' }} onClick={() => alert('cool beans')}>
                CONTINUE
            </Button>
        </>
    );
};

export default OrderSummary;
