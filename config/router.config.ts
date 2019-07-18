export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      // user
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          { path: '/user', redirect: '/user/login' },
          { path: '/user/login', name: 'login', component: './User/Login' },
          { path: '/user/register', name: 'register', component: './User/Register' },
          {
            path: '/user/register-result',
            name: 'register.result',
            component: './User/RegisterResult',
          },
        ],
      },
      // app
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
          { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'user'] },
          {
            name: 'analysis',
            path: '/dashboard/analysis',
            component: './dashboard/analysis',
            authority: ['admin', 'user'],
          },
        ],
      },
    ],
  },
];
