<script setup>
import AvatarDom from './AvatarDom.vue'
import AvatarCanvas from './AvatarCanvas.vue'

const props = defineProps({
    name: String,
    initials: String,
    color: String,
    radius: Number,
    x: Number,
    y: Number,
    canvas: Boolean, 
})

const component = computed(() => props.canvas ? AvatarCanvas : AvatarDom)
</script>

<template>
    <component :is="component" v-bind="props" />
</template>