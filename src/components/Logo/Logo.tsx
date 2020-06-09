import React from 'react';

import BurgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';

const Logo: React.FC = () => {
    return (
        <div className={classes.Logo}>
            <img src={BurgerLogo} alt="MyBurger"></img>
        </div>
    );
};

export default Logo;
