<script setup lang="ts">
defineProps<{ size?: string }>();
</script>

<template>
    <p class="logo" :data-size="size">
        <span>Innebandy</span><span class="logo__accent">lab</span>
    </p>
</template>

<style lang="scss" scoped>
.logo {
    font-family: var(--font-ui);
    font-size: var(--font-size-base);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0;
    display: inline-flex;
    align-items: baseline;

    $sizes: small, medium, large, xlarge;
    @each $size in $sizes {
        &[data-size="#{$size}"] { font-size: var(--font-size-#{$size}); }
    }

    &__accent {
        color: var(--color-accent-logo, var(--color-accent));
        font-style: italic;
        font-weight: 900;
    }
}
</style>
