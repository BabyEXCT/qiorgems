// UserRole type definition (since we're using SQLite without enums)
type UserRole = 'ADMIN' | 'CUSTOMER' | 'SELLER'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      username: string
      role: UserRole
      name?: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    username: string
    role: UserRole
    name?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    username: string
  }
}