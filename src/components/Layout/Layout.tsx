import React, { useState } from 'react';
import classes from './Layout.module.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

interface Props {
    children: React.ReactChild;
}

const Layout: React.FC<Props> = (props: Props) => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);
    return (
        <>
            <Toolbar show={showSideDrawer} setShow={setShowSideDrawer}></Toolbar>
            <SideDrawer show={showSideDrawer} setShow={setShowSideDrawer}></SideDrawer>
            <main className={classes.Content}>{props.children}</main>
        </>
    );
};
export default Layout;
