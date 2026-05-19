<script setup lang="ts">
defineProps<{ size?: string; beta?: boolean; }>();
</script>

<template>
    <p :class="['logo', size ? `text-${size}` : 'text-base']">
        <span v-if="beta" class="logo__beta">BETA</span>
        <span>Innebandy</span><span class="logo__accent">Lab</span>
    </p>
</template>

<style lang="scss" scoped>
.logo {
    font-family: var(--font-ui);
    font-weight: 600;
    letter-spacing: -0.1rem;
    line-height: 1;
    margin: 0;
    display: inline-flex;
    align-items: baseline;
    position: relative;

    &__accent {
        color: var(--accent-primary);
        font-style: italic;
        font-weight: 900;
    }

    &__beta {
        position: absolute;
        top: -20%;
        left: 45%;
        background-color: var(--accent-primary);
        color: white;
        font-size: var(--text-mini);
        line-height: 1;
        letter-spacing: 0rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-weight: 700;
    }
}
</style>
