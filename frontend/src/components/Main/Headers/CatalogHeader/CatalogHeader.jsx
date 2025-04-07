import searchLogo from "../../../../assets/search.svg";
import styles from "./CatalogHeader.module.css"
import Button from "../../Buttons/Button.jsx";
import React from "react";

export default function CatalogHeader({title, searchFields = []}) {

    const onSearchClick = () => {
    }
    return (
        <div className={styles.header}>
            <h1>{title}</h1>
            <div className={styles.inputs}>
                {searchFields.map((holder, ind) => (
                    <input type="text" key={ind} placeholder={holder}/>
                ))}
                <div>
                    <p className="text-class">Дата добавления</p>
                    <input type="date"/>
                    <label className="text-class">-</label>
                    <input type="date"/>
                </div>

                <Button onClick={onSearchClick}>
                    <a className="a-img"><img src={searchLogo} alt="search"></img></a>
                    Поиск
                </Button>
            </div>
        </div>
    )
}