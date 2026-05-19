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
        layout?: 'beta' | 'auth' | 'public';
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

    return true;
});

export default router;