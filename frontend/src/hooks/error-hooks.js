import {useEffect} from "react";
import {setRejectMessageAction} from "../actions/message-actions.js";
import {useDispatch} from "react-redux";

export const useErrorHookForm = (activeBut, firstForm, secondForm) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (activeBut === "first") {
            const firstErrorKey1 = Object.keys(firstForm.formState.errors)[0]
            if (firstErrorKey1)
                dispatch(setRejectMessageAction(firstForm.formState.errors[firstErrorKey1].message))
        } else if (activeBut === "second") {
            const firstErrorKey2 = Object.keys(secondForm.formState.errors)[0]
            if (firstErrorKey2 !== undefined)
                dispatch(setRejectMessageAction(secondForm.formState.errors[firstErrorKey2].message))
        }
    }, [firstForm.formState.errors, secondForm.formState.errors])

}

