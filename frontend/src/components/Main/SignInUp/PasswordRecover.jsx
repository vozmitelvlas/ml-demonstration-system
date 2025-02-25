import React from "react";
import styles from "./SignIn.module.css"

export default function PasswordRecover() {
    return (
        <div className={styles.signInUp}>
            <form className={styles.container}>
                <div className={`${styles.inData} naked-input`}>
                    <h2>Восстановление пароля</h2>
                    <div className={styles.row}>
                        <div className={styles.inputDiv}>
                            <label>Введите почту</label>
                            <div>
                                <input type="email" placeholder="example@mail.ru" required/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.button}>
                            <div>
                                <button type="submit">Восстановить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}