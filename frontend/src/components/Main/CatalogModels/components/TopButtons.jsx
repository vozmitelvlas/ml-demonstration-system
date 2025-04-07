import Button from "../../Buttons/Button.jsx";
import React from "react";

export function TopButtons({isAdminMode, setIsAddingModel, setIsAddingVersion, setAlarm}) {
    return (
        <>
            <div className="options-buttons_up">
                {isAdminMode && (
                    <div>
                        <Button onClick={() => {
                            setIsAddingModel(true)
                            setAlarm(null)
                        }}>Добавить модель</Button>
                        <Button onClick={() => {
                            setIsAddingVersion(true)
                            setAlarm(null)
                        }}>Добавить версию</Button>
                    </div>
                )}
            </div>
        </>
    )
}