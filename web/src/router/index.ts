import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from 'vue-router';
import { useAuthStore } from '@/stores/auth';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        public?: boolean;
        layout?: 'beta' | 'app' | 'public';
        requiresPro?: boolean;
        requiresClub?: boolean;
        requiresAdmin?: boolean;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
            layout: 'beta',
        },
    },
    /*{
        path: '/start',
        name: 'start',
        component: () => import('@/views/StartView.vue'),
        meta: {
            layout: 'public',
        },
    },
    {
        path: '/hem',
        name: 'hem',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
            layout: 'app',
            // requiresAuth: true,
        },
    },
    {
        path: '/kalender',
        name: 'kalender',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
            layout: 'app',
            // requiresAuth: true,
        },
    },
    {
        path: '/ovningar',
        name: 'ovningar',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
            layout: 'app',
            // requiresAuth: true,
        },
    },
    {
        path: '/klubb',
        name: 'klubb',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
            layout: 'app',
            // requiresAuth: true,
        },
    },*/
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_, __, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    },
});

router.beforeEach((to) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { path: '/login', query: { redirect: to.fullPath } };
    }

    if (to.meta.requiresPro && !auth.isPro) {
        return { path: '/upgrade', query: { redirect: to.fullPath } };
    }

    if (to.meta.requiresClub && !auth.isClub) {
        return { path: '/upgrade', query: { redirect: to.fullPath } };
    }

    if (to.meta.requiresAdmin && !auth.isAdmin) {
        return { path: '/' };
    }

    // Add 404 handling for unmatched routes
    if (to.matched.length === 0) {
        return { path: '/' };
    }

    return true;
});

export default router;