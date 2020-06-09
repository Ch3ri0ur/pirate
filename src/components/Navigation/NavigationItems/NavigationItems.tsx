import React from 'react';
import classes from './NavigationItems.module.css';

interface Props {
    link: string;
    active?: boolean;
    children: React.ReactChild;
}

const NavigationItem: React.FC<Props> = (props: Props) => {
    return (
        <li className={classes.NavigationItem}>
            <a href={props.link} className={props.active ? classes.active : undefined}>
                {props.children}
            </a>
        </li>
    );
};

const NavigationItems: React.FC = () => {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" active>
                Burger Builder
            </NavigationItem>
            <NavigationItem link="/">Checkout</NavigationItem>
        </ul>
    );
};

export default NavigationItems;
