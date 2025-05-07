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