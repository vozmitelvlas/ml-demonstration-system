import React from 'react';
import styles from "./Input.module.css"

const Input = ({
                   id,
                   name,
                   children,
                   onChange,
                   type,
                   classNames,
                   placeholder,
                   disabled = false,
                   onMouseOver,
                   onMouseOut,
                   onClick,
               }) => {
    let classes = [styles.input].concat(classNames || []).join(" ");
    return (
        <input
            id={id}
            name={name}
            defaultValue={children}
            onChange={onChange}
            type={type}
            className={classes}
            placeholder={placeholder}
            disabled={disabled}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
        />
    );
}

export default Input;