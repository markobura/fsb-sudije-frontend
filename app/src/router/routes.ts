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
        component: () => import('pages/user/UsersPage.vue'),
        name: 'users.index',
        meta: {middleware: [auth]}
      },
      {
        path: 'create-test',
        component: () => import('pages/theory-test/CreateTestPFIPage.vue'),
        name: 'test.create',
        meta: {middleware: [auth]}
      },
      {
        path: 'tests-overview',
        component: () => import('pages/theory-test/TheoryTestsOverviewPage.vue'),
        name: 'tests.overview',
        meta: {middleware: [auth]}
      },
      {
        path: 'test-details/:id',
        component: () => import('pages/theory-test/CreateTestPFIPage.vue'),
        name: 'test.details',
        meta: {middleware: [auth]}
      },
      {
        path: 'test-pfi',
        component: () => import('pages/theory-test/TestPFIPage.vue'),
        name: 'test.pfi',
        meta: {middleware: [auth]}
      },
      {
        path: 'video-test',
        component: () => import('pages/video-test/VideoTestPage.vue'),
        name: 'video-test.overview',
        meta: {middleware: [auth]}
      },
      {
        path: 'video-test-details/:id',
        component: () => import('pages/video-test/VideoTestDetailsPage.vue'),
        name: 'video-test.details',
        meta: {middleware: [auth]}
      },
      {
        path: 'availability',
        component: () => import('pages/availability/AvailabilityPage.vue'),
        name: 'availability.index',
        meta: {middleware: [auth]}
      },
      // {
      //   path: 'users/:id',
      //   component: () => import('pages/UserDetailsPage.vue'),
      //   name: 'users.show',
      //   // meta: {middleware: [auth, setupUserDetailsPage]}
      // },

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
      {path: 'login', component: () => import('pages/auth/LoginPage.vue'), name: 'login'},
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
