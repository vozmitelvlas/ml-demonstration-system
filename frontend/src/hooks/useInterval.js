import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Сохраняем последнюю версию функции
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Ставим интервал
    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(() => savedCallback.current(), delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}