import React from 'react';
import styles from "./DataHeader.module.css"

export default function DataHeader({children, setActiveBut, activeBut, buttons, names}) {
    const handleClick = (event) => {
        if (event.target instanceof HTMLButtonElement){
            setActiveBut(event.target.name)
        }
    }

    return (
        <div className={styles.header}>
            <h1>{children}</h1>
            <div onClick={handleClick} className={styles.buttons}>
                {buttons.map((button, i) => (
                    <div key={names[i]}>
                        <button name={names[i]} className={activeBut === names[i] ? styles.newColor : ""}>{button}</button>
                        <hr className={activeBut === names[i] ? styles.newColor : ""}/>
                    </div>
                ))}
            </div>
        </div>
    )
}