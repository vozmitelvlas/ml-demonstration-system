import styles from "./AlarmMsg.module.css";
import React from "react";

export const AlarmMsg = ({logo, alarm}) => (
    <div className={styles.alarmContainer}>
        {alarm &&
            <b className={styles.alarm}>
                <a className="a-img"><img src={logo}/></a>
                {alarm}
            </b>
        }
    </div>
)