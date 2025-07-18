import { TRoles } from "./Auth.Types"

export type User = {
  id: string
  firstName: string
  lastName: string
  role: TRoles
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
  id: string;
  image: string;
}