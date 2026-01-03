import { RefObject } from "react";
import { IAmenity } from "./amenities.types";
import { IRating } from "./rating.types";
import { IRoom } from "./room.types";

export type TIdProof = 'Aadhaar' | 'Passport' | 'DrivingLicense' | 'PAN';

export interface IHotel {
  id: string
  vendorId: string;
  name: string
  slug: string
  description: string
  images: string[]
  amenities: (Partial<IAmenity> & { _id: string })[]
  tags: string[]
  state: string
  city: string
  address: string
  isBlocked: boolean;
  rating?: Partial<IRating[]>
  ratings?: Partial<IRating[]>
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

export interface IHotelCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  amenities: (Pick<IAmenity, 'name'> & { _id: string })[];
  city: string;
  state: string;
  address: string;
  room: IRoom & { discountedPrice: number, appliedOffer: any };
  rating: {
    totalRatings: number
    averageRating: number
    averages: {
      hospitality: number,
      cleanliness: number,
      facilities: number,
      room: number,
      moneyValue: number,
    }
  }
  isBlocked: boolean;
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

export interface HotelCardProps {
  hotel: IHotelCard;
  roomsCount: number,
  guests: number,
  geoSearch: string,
}

export interface IHotelWithRoom {
  hotel: IHotel;
  room: IRoom & { discountedPrice: number, appliedOffer: any };
  mapRef: RefObject<HTMLDivElement | null>;
  reviewRef: RefObject<HTMLDivElement | null>;
  roomsRef: RefObject<HTMLDivElement | null>;
  ratings: IRating[];
  roomSubmit: (room: IRoom & { discountedPrice: number, appliedOffer: any }) => void;
}