import {useEffect, useState} from "react";
import apiClient from "../../../utils/apiClient.jsx";

export const useRequestGetRunTimes = () => {
    const [runtimes, setRuntimes] = useState([])
    useEffect(() => {
        apiClient('/api/models/runtimes')
            .then((res) => {
                setRuntimes(
                    res.map((runtime) => ({
                        value: runtime.name,
                        label: runtime.value
                    }))
                )
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    return {
        runtimes,
    }
}
