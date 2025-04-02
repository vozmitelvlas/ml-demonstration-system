import {useEffect, useState} from "react";
import apiClient from "../../../utils/apiClient.jsx";

export const useRequestGetRunTimes = (isConfirmed) => {
    const [runtimes, setRuntimes] = useState([])
    useEffect(() => {
        if (isConfirmed) {
            apiClient('/api/models/runtimes')
                .then((res) => {
                    setRuntimes(
                        res.map((runtime) => ({
                            value: runtime.name,
                            label: runtime.value
                        }))
                    )
                })
                .catch((error) => console.log(error))
        }
    }, [isConfirmed])
    return {
        runtimes,
    }
}
