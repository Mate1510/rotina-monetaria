import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { APP_ROUTES } from '@/routes/app-routes'

type PublicRouteProps = {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { status } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      push(APP_ROUTES.private.homepage)
    }
  }, [status, push])

  return (
    <div>
      {status === 'unauthenticated' && children}
      {status === 'authenticated' && null}
    </div>
  )
}

export default PublicRoute
