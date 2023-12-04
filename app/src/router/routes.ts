import {RouteRecordRaw} from 'vue-router';
import auth from 'src/middleware/auth';
import guest from 'src/middleware/guest';
import setupUsersPage from "src/middleware/setupUsersPage";
import setupUserDetailsPage from "src/middleware/setupUserDetailsPage";
import setupLogsPage from "src/middleware/setupLogsPage";


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      middleware: [auth]
    },
    children: [
      {path: '', component: () => import('pages/IndexPage.vue'), name: 'home'},
      {
        path: 'users',
        component: () => import('pages/UsersPage.vue'),
        name: 'users.index',
        meta: {middleware: [auth, setupUsersPage]}
      },
      {
        path: 'users/:id',
        component: () => import('pages/UserDetailsPage.vue'),
        name: 'users.show',
        meta: {middleware: [auth, setupUserDetailsPage]}
      },
      {
        path: 'logs',
        component: () => import('pages/LogsPage.vue'),
        name: 'app.logs',
        meta: {middleware: [auth, setupLogsPage]}
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
        name: 'settings.session-timeout',
        meta: {middleware: [auth]}
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: {
      middleware: [guest],
    },
    redirect: {name: 'login'},
    children: [
      {path: 'login', component: () => import('pages/LoginPage.vue'), name: 'login'},
      {path: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue'), name: 'forgot-password'},
      {path: 'reset-password/:token/', component: () => import('pages/ResetPasswordPage.vue'), name: 'reset-password'},
      {
        path: 'activate-account/:token/',
        component: () => import('pages/ActivateAccountPage.vue'),
        name: 'activate-account'
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
