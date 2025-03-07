import styles from "./AlarmMsg.module.css";
import React from "react";

export const AlarmMsg = ({logo, children}) => (
    <div className={styles.alarmContainer}>
        {children &&
            <b className={styles.alarm}>
                <a className="a-img"><img src={logo}/></a>
                {children}
            </b>
        }
    </div>
)