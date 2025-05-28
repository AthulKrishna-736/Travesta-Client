import { TRoles } from "./Auth.Types"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  isBlocked: boolean
}

export interface UserTableProps {
  users: User[]
  loading: boolean
  page: number
  limit: number
  role: TRoles
  search: string
}

export type TSubscriptionType = 'basic' | 'medium' | 'vip';

export type Vendor = {
  id: string
  firstName: string
  lastName: string
  email: string
  isVerified: boolean
}

export interface VendorRequestTableProps {
  vendors: Vendor[]
  loading: boolean
  page: number
  limit: number
  search: string
}

export type UpdateUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: number
  isVerified: boolean
}

export interface WishlistItem {
  id: string
  image: string
}


export interface IHotel {
  name: string
  description: string
  address: string
  state: string
  city: string
  tags: string
  amenities: string
  services: string
  geoLocation?: number[]
  images?: File[]
}
