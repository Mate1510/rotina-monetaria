'use client'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Provider from '../Provider'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import { usePathname } from 'next/navigation'
import { checkIsPublicRoute } from '@/routes/check-is-public-route'
import PrivateRoute from '@/routes/private-route'
import { checkIsAdminRoute } from '@/routes/check-is-admin-route'
import AdminRoute from '@/routes/admin-route'
import PublicRoute from '@/routes/public-route'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Rotina Monetária',
  description:
    'Um planejador financeiro de uso pessoal para a gestão de suas finanças',
  icons: './favicon.svg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isPublicPage = checkIsPublicRoute(pathname)
  const isAdminPage = checkIsAdminRoute(pathname)

  return (
    <html lang="en">
      <Provider>
        <body className={`${poppins.className} mx-auto flex-col `}>
          <Header />
          <div className="container flex-grow lg:max-w-screen-2xl lg:mx-auto bg-orangeDarker">
            {isPublicPage ? (
              <PublicRoute>{children}</PublicRoute>
            ) : isAdminPage ? (
              <AdminRoute>{children}</AdminRoute>
            ) : (
              <PrivateRoute>{children}</PrivateRoute>
            )}
          </div>
          <Footer />
        </body>
      </Provider>
    </html>
  )
}
