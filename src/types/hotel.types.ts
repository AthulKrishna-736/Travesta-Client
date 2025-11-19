import { IAmenity } from "./amenities.types";
import { IRating } from "./rating.types";

export type TIdProof = 'Aadhaar' | 'Passport' | 'DrivingLicense' | 'PAN';

export interface IHotel {
  id: string
  vendorId: string;
  name: string
  description: string
  images: string[]
  amenities: (Partial<IAmenity> & { _id: string })[]
  tags: string[]
  state: string
  city: string
  address: string
  isBlocked: boolean;
  rating?: Partial<IRating[]>
  geoLocation: {
    type: string,
    coordinates: [number, number],
  }
  propertyRules: {
    checkInTime: string;
    checkOutTime: string;
    minGuestAge: number;
    petsAllowed: boolean;
    outsideFoodAllowed: boolean;
    breakfastFee?: number;
    idProofAccepted: TIdProof[];
    specialNotes?: string;
  }
  createdAt: string;
  updatedAt: string;
}

export type TCreateHotel = {
  name: string;
  description: string;
  address: string;
  state: string;
  city: string;
  checkInTime: string;
  checkOutTime: string;
  minGuestAge: number;
  petsAllowed: boolean;
  outsideFoodAllowed: boolean;
  breakfastFee?: number;
  idProofAccepted: TIdProof[];
  specialNotes?: string;
  tags: string[];
  amenities: string[];
  images: File[];
  geoLocation: [number, number];
};

export type TUpdateHotel = {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  state?: string;
  city?: string;
  checkInTime?: string;
  checkOutTime?: string;
  minGuestAge?: number;
  petsAllowed?: boolean;
  outsideFoodAllowed?: boolean;
  breakfastFee?: number;
  idProofAccepted?: TIdProof[];
  specialNotes?: string;
  tags?: string[];
  amenities?: string[];
  images?: File[];
  oldImages?: string[];
  geoLocation?: [number, number]
}

//component props types
export interface ICreateHotelModalProps<T = any> {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (data: T) => void;
  hotelData?: IHotel | null;
  isEdit?: boolean;
}

export interface IHotelTableProps {
  hotels: IHotel[];
  loading: boolean;
  onHotelsFetched?: (hotels: IHotel[]) => void;
}