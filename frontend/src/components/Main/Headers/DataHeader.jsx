import React from "react";
import "../CatalogModels/ModelData.css"

function DataHeader({children, firstButton, secondButton, onClick}) {

    let handleClick = (event) => {
        let div = event.target.closest(".header-buttons")
        let buttons = div.querySelectorAll("button")

        if (event.target instanceof HTMLButtonElement) {
            let [activeBut, hr1] = event.target.closest("div").querySelectorAll('*');
            if (!activeBut.classList.contains("new-color")) {
                activeBut.classList.add("new-color")
                hr1.classList.add("colorHr")
            }

            let otherButton = Array.from(buttons).filter((button) => button !== activeBut)[0]
            let hr2 = otherButton.closest("div").querySelector("hr")
            if (otherButton.classList.contains("new-color")) {
                otherButton.classList.remove("new-color")
                hr2.classList.remove("colorHr")
            }

            if (activeBut.name === "info") {
                document.querySelector('.change-container__info').removeAttribute('hidden');
                document.querySelector('.change-container__second').setAttribute('hidden', '');

            } else {
                document.querySelector('.change-container__info').setAttribute('hidden', '');
                document.querySelector('.change-container__second').removeAttribute('hidden');

                $(document).ready(function() {
                    $(".js-select2").select2({
                        closeOnSelect : false,
                        placeholder : "Администраторы",
                        // allowHtml: true,
                        allowClear: true,
                        tags: true // создает новые опции на лету
                    });
                });
            }
        }
    }

    return (
        <div className="change-container__header">
            <h1>{children}</h1>
            <div onClick={handleClick} className="header-buttons">
                <div>
                    <button name="info" className="new-color">{firstButton}</button>
                    <hr className="colorHr"/>
                </div>
                <div>
                    <button>{secondButton}</button>
                    <hr/>
                </div>
            </div>
        </div>
    )
}
export default DataHeader