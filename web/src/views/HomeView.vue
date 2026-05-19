<script setup lang="ts">
import Logo from '@/components/Logo.vue';
import Pill from '@/components/Pill.vue';
</script>

<template>
  <Logo size="xxlarge" :beta="true" />
  <Pill text="Beta — Kommer snart!" pulse class="space-y-t-large" />
</template>