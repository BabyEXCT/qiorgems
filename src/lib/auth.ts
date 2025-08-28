import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (credentials?.username && credentials?.password) {
          try {
            // Look up user in database by username
            const user = await prisma.user.findUnique({
              where: { username: credentials.username }
            })
            
            if (user && user.password) {
              // Verify password with bcrypt
              const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
              
              if (isPasswordValid) {
                return {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  role: user.role
                } as any
              }
            }
          } catch (error) {
            console.error('Database error during authentication:', error)
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      // If a new user signed in, set base fields
      if (user) {
        const anyUser = user as any
        token.sub = anyUser.id || token.sub
        ;(token as any).role = (anyUser.role as string) || 'CUSTOMER'
        ;(token as any).username = anyUser.username || anyUser.email?.split('@')[0] || 'user'
      }

      // Set defaults if missing
      if (!token.sub) token.sub = 'default_customer_id'
      if (!(token as any).role) (token as any).role = 'CUSTOMER'
      if (!(token as any).username) {
        const email = (token as any).email as string | undefined
        ;(token as any).username = email ? email.split('@')[0] : 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).id = token.sub as string
        ;(session.user as any).role = (token as any).role as string
        ;(session.user as any).username = (token as any).username as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}