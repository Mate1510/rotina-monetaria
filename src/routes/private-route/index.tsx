import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { APP_ROUTES } from '@/routes/app-routes'
import { useSession } from 'next-auth/react'
import Loading from '@/app/loading'

type PrivateRouteProps = {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { push } = useRouter()

  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      push(APP_ROUTES.public.login)
    }
  }, [status, push])

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div>
      {status === 'unauthenticated' && null}
      {status === 'authenticated' && children}
    </div>
  )
}

export default PrivateRoute
