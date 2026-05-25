<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { registerRouterPush } from './api/client';

import PublicLayout from '@/layouts/PublicLayout.vue';
import BetaLayout from '@/layouts/BetaLayout.vue';
import AppLayout from '@/layouts/AppLayout.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

registerRouterPush((to) => router.push(to));
authStore.loadStoredState();

const layout = computed(() => (route.meta.layout as string | undefined) ?? 'public');
</script>

<template>
    <BetaLayout v-if="layout === 'beta'" />
    <PublicLayout v-else-if="layout === 'public'">
        <router-view />
    </PublicLayout>
    <AppLayout v-else-if="layout === 'app'" />
</template>