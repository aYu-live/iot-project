import { createRouter, createWebHashHistory } from 'vue-router';
import { basicRoutes } from './routes';

export const router = createRouter({
    // process.env.BASE_URL
    history: createWebHashHistory(''),
    routes: basicRoutes,
  });