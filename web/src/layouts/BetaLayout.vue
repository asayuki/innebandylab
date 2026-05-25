<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import Pill from '@/components/Pill.vue';
</script>

<template>
    <main class="beta">
        <Logo :beta="true" size="--t-h1" />
        <Pill text="— Kommer snart! —" pulse class="uppercase" style="margin: var(--space-md)" />
    </main>
</template>

<style lang="scss" scoped>
.beta {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
</style>