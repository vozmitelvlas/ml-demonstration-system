import React from 'react';
import styles from "./Button.module.css"


const Button = ({ children, onClick, type, classNames }) => {
    let classes = [styles.button].concat(classNames || []).join(" ");
    return (
        <button
            onClick={onClick}
            type={type}
            className={classes}
        >
            {children}
        </button>
    );
};

export default Button;