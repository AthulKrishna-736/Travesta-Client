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

export const formatDate = (date: string | Date): string => {
    return new Date(date).toISOString().split("T")[0];
};

export const formatDayLabel = (iso: string) => {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};


const GUEST_USER_ROUTES = [
    '/user/hotels',
    '/user/about-us',
    '/user/checkout',
];

export const isGuestAllowedUserRoute = (pathname: string) => {
    return GUEST_USER_ROUTES.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );
};