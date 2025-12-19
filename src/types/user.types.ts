import { TRoles } from "./authentication.types"

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
  id: string
  firstName: string
  lastName: string
  isGoogle: boolean
  email: string
  role: TRoles
  phone: number
  isBlocked: boolean
  subscription: string | null;
  profileImage?: string
  isVerified: boolean
  verificationReason?: string
  kycDocuments?: []
  createdAt: Date
  updatedAt: Date
}

export type TSubscriptionType = 'basic' | 'medium' | 'vip';

export type Vendor = {
  id: string
  firstName: string
  lastName: string
  email: string
  isVerified: boolean
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
export type UpdateUserFormValues = Omit<UpdateUser, 'isVerified' | 'id'>;

//component props types
export interface UserTableProps {
  users: User[]
  loading: boolean
}

export interface VendorRequestTableProps {
  vendors: Vendor[]
  loading: boolean
  page: number
  limit: number
  search: string
}

export interface KycDocumentsProps {
  userId: string;
  onUpdate: (payload: { userId: string; files: File[] }) => void;
}

export interface ProfileSectionProps {
  user: IUser;
  onUpdate: (updatedUser: Omit<UpdateUser, 'isVerified' | 'id' | 'email'>) => void;
}

export interface ShowDetailModalProps {
  open: boolean
  title: string
  data: IUser
  onCancel: () => void
}

