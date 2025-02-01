import React from 'react';
import "./Input.css"

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
                   onMouseOut
               }) => {
    let classes = ["text-field__input "].concat(classNames || []).join(" ");
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
        />
    );
}

export default Input;