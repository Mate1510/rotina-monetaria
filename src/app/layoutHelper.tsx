'use client'

import './globals.css'
import { usePathname } from 'next/navigation'
import { checkIsPublicRoute } from '@/routes/check-is-public-route'
import PrivateRoute from '@/routes/private-route'
import { checkIsAdminRoute } from '@/routes/check-is-admin-route'
import AdminRoute from '@/routes/admin-route'
import PublicRoute from '@/routes/public-route'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isPublicPage = checkIsPublicRoute(pathname)
  const isAdminPage = checkIsAdminRoute(pathname)

  return (
    <>
      {isPublicPage ? (
        <div className="container flex-grow lg:max-w-screen-2xl lg:mx-auto bg-orangeDarker">
          <PublicRoute>{children}</PublicRoute>
        </div>
      ) : isAdminPage ? (
        <div className="container min-h-screen flex-grow lg:max-w-screen-2xl lg:mx-auto my-10">
          <AdminRoute>{children}</AdminRoute>
        </div>
      ) : (
        <div className="container flex-grow lg:max-w-screen-2xl lg:mx-auto my-10">
          <PrivateRoute>{children}</PrivateRoute>
        </div>
      )}
    </>
  )
}
