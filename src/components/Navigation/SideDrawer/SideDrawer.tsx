import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';

interface Props {
    children?: React.ReactChild;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideDrawer: React.FC<Props> = (props: Props) => {
    const SideDrawerClasses = [classes.SideDrawer, props.show ? classes.Open : classes.Close];
    return (
        <>
            <Backdrop show={props.show} setShow={props.setShow}></Backdrop>
            <div className={SideDrawerClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo></Logo>
                </div>
                <nav>
                    <NavigationItems></NavigationItems>
                </nav>
            </div>
        </>
    );
};

export default SideDrawer;
