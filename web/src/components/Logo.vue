<script setup lang="ts">
defineProps<{ size?: string; beta?: boolean; }>();
</script>

<template>
    <p class="logo" :style="size ? { fontSize: `var(${size})` } : {}">
        <span v-if="beta" class="logo__beta">BETA</span>
        <span>Innebandy</span><span class="logo__accent">Lab</span>
    </p>
</template>

<style lang="scss" scoped>
.logo {
    font-family: var(--font-ui);
    font-weight: 600;
    letter-spacing: -0.04rem;
    line-height: 1;
    display: inline-flex;
    align-items: baseline;
    position: relative;
    font-size: var(--t-body);
    padding: 0;
    margin: 0;

    &__accent {
        color: var(--ink);
        font-style: italic;
        font-weight: 900;
    }

    &__beta {
        position: absolute;
        background-color: var(--accent);
        color: black;
        font-size: calc(var(--t-eyebrow) - 3px);
        line-height: 1;
        left: 50%;
        letter-spacing: 0rem;
        display: flex;
        padding: .25rem;
        border-radius: 0.25rem;
        font-weight: 700;
        transform: translateY(-70%) translateX(-50%);
    }
}
</style>
