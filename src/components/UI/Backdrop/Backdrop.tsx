import React from 'react';
import classes from './Backdrop.module.css';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const Backdrop: React.FC<Props> = (props: Props) => {
    return props.show ? <div onClick={() => props.setShow(false)} className={classes.Backdrop}></div> : null;
};

export default Backdrop;
