import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

interface Props {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactChild;
}

const Modal: React.FC<Props> = (props: Props) => {
    return (
        <>
            <Backdrop setShow={props.setShow} show={props.show}></Backdrop>
            <div
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0',
                }}
                className={classes.Modal}
            >
                {props.children}
            </div>
        </>
    );
};

export default React.memo(Modal, (prev: Props, next: Props) => prev.show === next.show);
