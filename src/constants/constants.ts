export const PRICE_RANGES: { label: string; range: [number, number] }[] = [
    { label: "₹0 - ₹1500", range: [0, 1500] },
    { label: "₹1500 - ₹2500", range: [1500, 2500] },
    { label: "₹2500 - ₹5000", range: [2500, 5000] },
    { label: "₹5000 - ₹10000", range: [5000, 10000] },
    { label: "₹10000 - ₹30000", range: [10000, 30000] },
    { label: "₹30000 - ₹50000", range: [30000, 50000] },
    { label: "₹50000 - ₹100000", range: [50000, 100000] },
    { label: "₹100000+", range: [100000, Infinity] },
];

export const ROOM_TYPES: string[] = [
    "AC",
    "Non-AC",
    "Deluxe",
    "Suite",
    "Standard",
];

export const RATING_RANGE: { label: string, value: number }[] = [
    { label: 'Excellent: 4.5+', value: 4.5 },
    { label: 'Very Good: 4.0+', value: 4 },
    { label: 'Good: 3.0+', value: 3 },
    { label: 'Average: 2.0+', value: 2 },
]

export const RATINGS: { min: number; label: string }[] = [
    { min: 4.5, label: "Excellent" },
    { min: 4.0, label: "Very Good" },
    { min: 3.0, label: "Good" },
    { min: 2.0, label: "Average" },
    { min: 1.0, label: "Fair" },
    { min: 0, label: "Unrated" },
];