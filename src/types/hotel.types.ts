
export type TIdProof = 'Aadhaar' | 'Passport' | 'DrivingLicense' | 'PAN';

export interface IHotel {
  id: string
  name: string
  vendorId: string;
  description: string
  address: string
  state: string
  city: string
  tags: string[]
  amenities: string[]
  isBlocked: boolean;
  startingPrice: number
  images: string[]
  checkInTime: string;
  checkOutTime: string;
  minGuestAge: number;
  petsAllowed: boolean;
  outsideFoodAllowed: boolean;
  breakfastFee?: number;
  idProofAccepted: TIdProof[];
  specialNotes?: string;
  geoLocation?: {
    type: string,
    coordinates: [number, number],
  }
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

export type TResponseHotel = {
  id: string
  name: string
  vendorId: string;
  description: string
  address: string
  state: string
  city: string
  tags: string[]
  amenities: string[]
  isBlocked: boolean;
  startingPrice: number
  images: string[]
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
  geoLocation: {
    type: string,
    coordinates: [number, number],
  }
}