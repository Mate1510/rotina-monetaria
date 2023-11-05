import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'
import { seedCategories } from './seedCategories'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text', placeholder: 'E-mail' },
        password: {
          label: 'Password',
          type: 'Password',
          placeholder: 'Senha',
        },
        name: { label: 'Name', type: 'text', placeholder: 'Nome' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Nenhuma credencial foi passada!')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error('Usuário ou senha inválidos!')
        }

        // if (!user.emailVerified) {
        //   throw new Error(
        //     'Por favor, verifique seu e-mail antes de fazer login!',
        //   )
        // }

        if (user.status == 'INACTIVE') {
          throw new Error('O usuário está inativo!')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) {
          throw new Error('Usuário ou senha inválidos!')
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ trigger, token, user, session }) {
      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }

      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        })

        if (existingUser?.lastEntry === null) {
          await seedCategories(existingUser.id)
        }

        await prisma.user.update({
          where: { id: existingUser?.id },
          data: { lastEntry: new Date() },
        })

        return {
          ...token,
          userId: user.id,
          role: existingUser?.role,
        }
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
          role: token.role,
          name: token.name,
        },
      }
    },
  },
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
}
