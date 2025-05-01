

export type User = {
    _id: string
    name: string
    email: string
    isBlocked: boolean
  }
  
export interface UserTableProps {
    users: User[]
    loading: boolean
}