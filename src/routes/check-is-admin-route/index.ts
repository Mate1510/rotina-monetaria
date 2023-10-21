import { APP_ROUTES } from '@/routes/app-routes'

export const checkIsAdminRoute = (asPath: string) => {
  const appAdminRoutes = Object.values(APP_ROUTES.admin)

  return appAdminRoutes.includes(asPath)
}
