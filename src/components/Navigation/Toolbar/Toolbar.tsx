import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toolbar: React.FC<Props> = (props: Props) => {
    return (
        <header className={classes.Toolbar}>
            <div onClick={() => props.setShow(true)} className={classes.DrawerToggle}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div style={{ height: '80%' }}>
                <Logo />
            </div>
            <nav className={classes.DesktopOnly}>
                <NavigationItems />
            </nav>
        </header>
    );
};

export default Toolbar;
