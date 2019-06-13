module.exports = [
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
        authority: ['admin', 'user'],
        routes: [
          {
            name: 'analysis',
            path: '/dashboard/analysis',
            component: './dashboard/analysis',
            authority: ['admin', 'user'],
          },
          {
            path: '/',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
            authority: ['admin', 'user'],
          },
        ],
      },
    ],
  },
];
