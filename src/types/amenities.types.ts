export type TAmenityType = 'hotel' | 'room';

//type
export interface IAmenity {
    id: string;
    name: string;
    type: TAmenityType;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updateAt: Date;
}

//component props types
export interface AmenityTableProps {
    amenities: IAmenity[]
    loading: boolean
}

export interface TCreateAmenityData {
    name: string;
    description: string;
    type: "hotel" | "room";
}

export interface IAmenitiesModalProps {
    open: boolean;
    title: string;
    onCancel: () => void;
    onSubmit: (data: TCreateAmenityData) => void;
    initialData?: TCreateAmenityData;
    loading?: boolean;
}
