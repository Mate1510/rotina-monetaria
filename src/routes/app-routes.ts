export const APP_ROUTES = {
  private: {
    homepage: '/',
    categories: '/categories',
    charts: '/charts',
    finances: '/finances',
    goals: '/goals',
    userProfile: 'user-profile',
  },
  admin: {
    controlPanel: '/control-panel',
  },
  public: {
    login: '/login',
    register: '/register',
    forgetPassword: '/send-email/forget-password',
    resetPassword: '/from-email/reset-password',
    verifyEmail: '/from-email/verify-email',
    resendEmailVerification: '/send-email/email-verification',
  },
}
