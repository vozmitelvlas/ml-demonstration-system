import {useEffect, useState} from "react";
import apiClient from "../../../utils/apiClient.jsx";

export const useRequestGetProblemTypes = (isConfirmed) => {
    const [problemTypes, setProblemTypes] = useState([])
    useEffect(() => {
        if (isConfirmed) {
            apiClient('/api/models/problem-types')
                .then((res) => {
                    setProblemTypes(
                        res.map((problemType) => ({
                            value: problemType.name,
                            label: problemType.value,
                        }))
                    )
                })
                .catch(error => console.log(error))
        }
    }, [isConfirmed])

    return {
        problemTypes,
    }
}