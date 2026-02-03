import { LucideIcon } from "lucide-react"
import { ReactElement } from "react"

//api types
export type TSortOption = {
    [key: string]: 'ascending' | 'descending',
}

export type TPagination = {
    currentPage: number,
    pageSize: number,
    totalData: number,
    totalPages: number,
}

export type TApiErrorResponse = {
    success: boolean,
    message: string,
    statusCode: number,
}

export type TApiSuccessResponse<T = any | null> = {
    success: boolean,
    message: string,
    data: T,
    meta?: TPagination,
    statusCode: number,
}

export interface ICustomError extends Error {
    response: {
        data: TApiErrorResponse,
    }
}

//component types
export interface ILayoutProps {
    children: ReactElement;
    title?: string;
}

export type Action<T> = {
    label: string | ((rowData: T) => string);
    tooltip?: string | ((rowData: T) => string);
    onClick: (rowData: T) => void;
    variant?: "default" | "outline" | "ghost" | "link" | "destructive";
    className?: string | ((rowData: T) => string);
    showLabel?: boolean;
    icon?: LucideIcon | ((rowData: T) => LucideIcon);
    hidden?: boolean | ((rowData: T) => boolean);
};

export type TTableRow = object;

export type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export interface DataTableProps<T extends TTableRow> {
    columns: Column<T>[];
    data: T[];
    actions?: Action<T>[];
    loading?: boolean;
}

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export interface ICustomSearchProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    checkIn: string;
    setCheckIn: (val: string) => void;
    checkOut: string;
    setCheckOut: (val: string) => void;
    setLat: (val: number) => void;
    setLong: (val: number) => void;
    roomCount: number;
    setRoomCount: (val: number) => void;
    guests: number;
    setGuests: (val: number) => void;
    onSearch: () => void;
    disabled?: boolean;
}

export interface ConfirmationModalProps {
    open: boolean
    title: string
    description?: string
    extraNote?: React.ReactNode
    showInput?: boolean
    inputValue?: string
    onInputChange?: (val: string) => void
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

export type ImageUploadProps = {
    onImageSelected: (file: File | null) => void;
    updateProfileImage?: () => void;
};

export interface IMutilImageUploadProps {
    maxImages: number;
    onImagesChange: (files: (string | File)[]) => void;
    initialImageUrls?: string[];
};


export interface NearbyAttractionsProps {
    lat: number;
    long: number;
    layers?: string;
    types?: string;
}

export type TPlace = {
    description: string,
    reference: number,
    place_id: string,
    structured_formatting: {
        main_text: string,
        secondary_text: string,
    },
    types: string[],
    layer: string[],
    distance_meters: number,
    terms: { offset: number, value: string }[],
}

export interface StaticMapProps {
    long: number,
    lat: number,
    zoom: number,
    height: number,
    width: number,
    format: 'png' | 'jpg',
}

export interface IWeatherDetailsProps {
    latitude: number;
    longitude: number;
    checkIn: string;
    checkOut: string;
}

export type TWeather = {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: number,
    daily_units: {
        time: string,
        temperature_2m_max: string,
        temperature_2m_min: string,
        weathercode: string,
    },
    daily: {
        time: string[],
        temperature_2m_max: number[],
        temperature_2m_min: number[],
        weathercode: number[],
    }
}

export type TAutoComplete = {
    error_message: string,
    info_messages: [],
    predictions: {
        reference: string,
        types: string[],
        matched_substrings: { offset: number, length: number }[],
        terms: { offset: number, value: string }[],
        structured_formatting: {
            main_text_matched_substrings: { offset: number, length: number }[],
            secondary_text_matched_substrings: [],
            secondary_text: string,
            main_text: string,
        }
        description: string,
        geometry: {
            location: {
                lng: number,
                lat: number,
            }
        },
        place_id: string,
        layer: string[],
    }[]
}

export type TAutoCompletePrediction = TAutoComplete["predictions"][number];
