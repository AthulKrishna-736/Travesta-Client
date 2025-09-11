import { TRoles } from "./auth.types"

export type User = {
  id: string
  firstName: string
  lastName: string
  role: TRoles
  email: string
  isBlocked: boolean
}

export interface IAdmin {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: 'admin',
  createdAt: Date,
  updatedAt: Date
}

export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  isGoogle: boolean,
  email: string,
  password?: string,
  role: Exclude<TRoles, 'admin'>,
  phone: number,
  isBlocked: boolean,
  profileImage?: string,
  wishlist: string[],
  isVerified: boolean,
  verificationReason?: string,
  kycDocuments?: string[],
  createdAt: Date,
  updatedAt: Date
}

export interface UserTableProps {
  users: User[]
  loading: boolean
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
  password: string
  phone: number
  isVerified: boolean
}

export interface WishlistItem {
  id: string
  image: string
}
