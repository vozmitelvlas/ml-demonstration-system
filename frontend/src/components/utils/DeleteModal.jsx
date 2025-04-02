import Button from "../Main/Buttons/Button.jsx";
import React from "react";

export default function DeleteModal({onNo, onYes, open}){
    return(
        <div className={`delete-modal-overlay ${open ? "" : "delete-modal-overlay_hidden"}`}>
            <div className="delete-modal">
                <div className="delete-modal__title">
                    <h3>
                        Вы действительно хотите удалить?
                    </h3>
                </div>

                <div className="delete-modal__buttons">
                    <Button onClick={onNo}>Нет</Button>
                    <Button onClick={onYes}>Да</Button>
                </div>
            </div>
        </div>
    )
}

