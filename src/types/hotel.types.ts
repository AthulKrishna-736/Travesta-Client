
export interface IHotel {
  _id?: string
  id?: string
  name: string
  description: string
  address: string
  state: string
  city: string
  tags: string[]
  amenities: string[]
  isBlocked?:boolean;
  rating?: number
  startingPrice?:number
  geoLocation?: [number, number]
  images?: File[] | string[]
}