import searchLogo from "../../../assets/search.svg";
import styles from"./CatalogHeader.module.css"
import Button from "../Button/Button.jsx";
import Input from "../Input/Input.jsx";
import React from "react";

export default function CatalogHeader({title, searchFields}) {

    return (
        <div className={styles.header}>
            <h1>{title}</h1>
            <div className={styles.inputs}>
                {searchFields.map((holder, ind) => (
                    <Input key={ind} placeholder={holder}></Input>
                ))}
                <div>
                    <p className="text-class">Дата добавления</p>
                    <Input type="date"></Input>
                    <span className="text-class">-</span>
                    <Input type="date"></Input>
                </div>

                <Button>
                    <img src={searchLogo} alt="search"></img>
                    Поиск
                </Button>
            </div>
        </div>
    )
}