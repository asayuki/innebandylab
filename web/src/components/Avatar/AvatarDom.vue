<script setup lang="ts">
import { computed } from 'vue';
import { useAvatar } from '@/composables/useAvatar';

const props = defineProps<{
    name: string;
    initials?: string;
    color?: string;
    radius?: number;
}>();

const { initials, color, radius, fontSize } = useAvatar(props);

const style = computed(() => ({
    width: `${radius.value * 2}px`,
    height: `${radius.value * 2}px`,
    borderRadius: '50%',
    backgroundColor: color.value,
    color: 'white',
    fontSize: `${fontSize.value}px`,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
</script>

<template>
    <div class="avatar" :style="style">
        {{ initials }}
    </div>
</template>