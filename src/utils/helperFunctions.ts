import { useEffect, useState } from "react";

export const disablePastDates = (date: string | Date, days?: number): string => {
    const now = new Date(date);

    if (days) {
        now.setDate(now.getDate() + days);
    }

    return now.toLocaleDateString('en-CA');
}

export const useDebounce = (value: string, delay = 1500) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
}
