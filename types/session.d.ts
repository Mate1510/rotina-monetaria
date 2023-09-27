import 'next-auth'
import { Role } from './enum'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email: string
      image?: string | null
      userId: string
      role: Role
    }
  }
}
