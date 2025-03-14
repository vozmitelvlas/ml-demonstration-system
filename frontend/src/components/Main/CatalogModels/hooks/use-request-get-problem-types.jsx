import {useEffect, useState} from "react";
import apiClient from "../../../utils/apiClient.jsx";

export const useRequestGetProblemTypes = () => {
    const [problemTypes, setProblemTypes] = useState([])
    useEffect(() => {
        apiClient('/api/models/problem-types')
            .then((res) => {
                setProblemTypes(
                    res.map((problemType) => ({
                        value: problemType.name,
                        label: problemType.value,
                    }))
                )
            })
    }, [])
    return {
        problemTypes,
    }
}