<script setup lang="ts">
import { computed } from 'vue';
import { useAvatar } from '@/composables/useAvatar';

const props = defineProps({
    name: String,
    initials: String,
    color: String,
    radius: Number,
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
})

const { initials, color, radius, fontSize } = useAvatar(props)

const circleConfig = computed(() => ({
    x: 0, y: 0,
    radius: radius.value,
    fill: color.value,
}))

const textConfig = computed(() => ({
    text: initials.value,
    fontSize: fontSize.value,
    fontStyle: 'bold',
    fill: 'white',
    align: 'center',
    verticalAlign: 'middle',
    width: radius.value * 2,
    height: radius.value * 2,
    x: -radius.value,
    y: -radius.value,
}))
</script>

<template>
    <v-group :config="{ x, y }">
        <v-circle :config="circleConfig" />
        <v-text :config="textConfig" />
    </v-group>
</template>