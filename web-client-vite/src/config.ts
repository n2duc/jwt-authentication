const config = {
  endpoints: {
    auth: {
      login: '/users/login',
      logout: '/users/logout',
      register: '/users/register',
    },
    users: {
      info: '/users/info',
    },
    tasks: {
      getTasks: '/tasks',
      createTask: '/tasks',
    }
  }
}

export default config