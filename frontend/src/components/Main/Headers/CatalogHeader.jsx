import Input from "../../Input.jsx";
import "./CatalogHeader.css"
import Button from "../../Button.jsx";
import searchLogo from "../../../assets/search.svg";
import React, {useState} from "react";

function CatalogHeader({title, searchFields}) {

    return (
        <div className="catalog-header">
            <h1>{title}</h1>
            <div className="catalog-header__inputs">
                {searchFields.map((holder, ind) => (
                    <Input key={ind} placeholder={holder}></Input>
                ))}
                <div className="catalog-header__date">
                    <p className="text-class">Дата добавления</p>
                    <Input type="date"></Input>
                    <span className="text-class">-</span>
                    <Input type="date"></Input>
                </div>

                <Button>
                    <img src={searchLogo}></img>
                    Поиск
                </Button>
            </div>

        </div>
    )
}

export default CatalogHeader