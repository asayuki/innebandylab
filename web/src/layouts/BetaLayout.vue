<script setup lang="ts">
</script>

<template>
    <main class="beta">
        <slot />
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