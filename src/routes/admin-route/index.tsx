import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { APP_ROUTES } from '@/routes/app-routes'
import { useSession } from 'next-auth/react'

type AdminRouteProps = {
  children: ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { push } = useRouter()

  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      push(APP_ROUTES.public.login)
    } else if (session.user.role !== 'ADMIN') {
      push(APP_ROUTES.private.homepage)
    }
  }, [session, push])

  return <div>{session?.user.role === 'ADMIN' ? children : null}</div>
}

export default AdminRoute
