import React from 'react';
import styles from "./DataHeader.module.css"

export default function DataHeader({children, firstButton, secondButton, setActiveBut, activeBut}) {
    let handleClick = (event) => {
        if (event.target instanceof HTMLButtonElement){
            setActiveBut(event.target.name)
        }
    }

    return (
        <div className={styles.header}>
            <h1>{children}</h1>
            <div onClick={handleClick} className={styles.buttons}>
                <div>
                    <button name="first" className={activeBut === 'first' ? styles.newColor : ""}>{firstButton}</button>
                    <hr className={activeBut === 'first' ? styles.newColor : ""}/>
                </div>
                <div>
                    <button name="second" className={activeBut === 'second' ? styles.newColor : ""}>{secondButton}</button>
                    <hr className={activeBut === 'second' ? styles.newColor : ""}/>
                </div>
            </div>
        </div>
    )
}