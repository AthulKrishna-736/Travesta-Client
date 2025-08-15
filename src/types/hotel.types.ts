
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
  geoLocation?: [number, number]
  images?: File[] | string[]
}