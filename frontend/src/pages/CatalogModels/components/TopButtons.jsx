import Button from "../../../components/Buttons/Button.jsx";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {resetMessageStateAction} from "../../../actions/message-actions.js";
import {selectUserRoles} from "../../../selectors/user-selector.js";

export function TopButtons({setIsAddingModel, setIsAddingVersion}) {
    const dispatch = useDispatch()
    const {isAdminMode} = useSelector(selectUserRoles)
    const onAddVersion = () => {
        setIsAddingVersion(true)
        dispatch(resetMessageStateAction)
    }
    const onAddModel = () => {
        setIsAddingModel(true)
        dispatch(resetMessageStateAction)
    }

    return (
        <div className="options-buttons_up">
            {isAdminMode && (
                <div>
                    <Button onClick={onAddModel}>Добавить модель</Button>
                    <Button onClick={onAddVersion}>Добавить версию</Button>
                </div>
            )}
        </div>
    )
}