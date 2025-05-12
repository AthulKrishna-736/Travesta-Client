import { TRoles } from "./auth.types"

export type User = {
  id: string
  name: string
  email: string
  isBlocked: boolean
}

export interface UserTableProps {
  users: User[]
  loading: boolean
  page: number
  limit: number
  role: TRoles
}

export type TSubscriptionType = 'basic' | 'medium' | 'vip';

export type Vendor = {
  id: string
  name: string
  email: string
  isVerified: boolean
}

export interface VendorRequestTableProps {
  vendors: Vendor[]
  loading: boolean
  page: number
  limit: number
}

export type UpdateUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: number
}

export interface WishlistItem {
  id: string;
  image: string;
}