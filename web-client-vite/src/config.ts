const config = {
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      refreshToken: '/auth/refresh_token'
    },
    users: {
      me: '/users/info',
      upload: '/users/upload',
      update: '/users/update',
      forgotPassword: '/users/forgot_password',
      resetPassword: (userId: string, token: string) => `/users/reset_password?userId=${userId}&token=${token}`,
    },
    tasks: {
      getTasks: '/tasks',
      createTask: '/tasks',
    },
    admin: {
      getUsers: '/dashboards/users',
    }
  }
}

export default config