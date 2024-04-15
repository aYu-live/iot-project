import type { RouteRecordRaw } from 'vue-router';

export const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Layout',
  redirect: '/dashboard/welcome',
//   component: () => import('@/layout/index.vue'),
  meta: {
    title: '根路由',
  },
  children: [],
};

export const basicRoutes: Array<RouteRecordRaw> = [
  rootRoute,
];