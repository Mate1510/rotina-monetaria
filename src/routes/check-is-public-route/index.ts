import { APP_ROUTES } from '@/routes/app-routes'

export const checkIsPublicRoute = (asPath: string) => {
  const appPublicRoutes = Object.values(APP_ROUTES.public)

  return appPublicRoutes.includes(asPath)
}
