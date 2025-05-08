export type User = {
    id: string
    name: string
    email: string
    isBlocked: boolean
  }
  
export interface UserTableProps {
    users: User[]
    loading: boolean
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
}