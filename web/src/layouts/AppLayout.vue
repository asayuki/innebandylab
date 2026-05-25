<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import ProfileAvatar from '@/components/ProfileAvatar.vue';
import Header from '@/partials/Header.vue';

const navItems = [
    {
        name: 'Hem',
        path: '/hem',
        match: (r: string) => r.startsWith('/hem'),
    },
    { name: 'Kalender', path: '/kalender', match: (r: string) => r.startsWith('/kalender') },
    { name: 'Övningar', path: '/ovningar', match: (r: string) => r.startsWith('/ovningar') },
    { name: 'Klubb', path: '/klubb', match: (r: string) => r.startsWith('/klubb') },
];

</script>

<template>
    <Header class="thin" />

    <router-view />
</template>

<style scoped lang="scss">

</style>