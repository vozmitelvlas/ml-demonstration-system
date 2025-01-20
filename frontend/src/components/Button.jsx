import React from 'react';
import "./Button.css"


const Button = ({ children, onClick, type, classNames }) => {
    let classes = ["search_button", "text-class"].concat(classNames || []).join(" ");
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