<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import Pill from '@/components/Pill.vue';
</script>

<template>
  <Logo :beta="true" size="--t-h1" />
  <Pill text="— Kommer snart! —" pulse class="uppercase" style="margin: var(--space-md)" />
</template>
