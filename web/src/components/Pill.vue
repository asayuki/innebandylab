<script setup lang="ts">
defineProps<{
    pulse?: boolean;
    text: string;
    link?: string;
}>();

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    emit('click', event);
};

</script>

<template>
    <component
        :is="link ? 'a' : 'span'"
        :href="link"
        class="pill"
        :class="{ 'pill--pulse': pulse, 'cursor-pointer': !!link }"
        @click="handleClick"
    >
        {{ text }}
    </component>
</template>

<style lang="scss" scoped>
.pill {
    display: inline-flex;
    align-items: center;
    color: var(--ink-2);
    font-family: var(--mono);
    font-size: var(--t-mono);
    justify-content: center;
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--rule);
    border-radius: 1rem;
    position: relative;

    &.uppercase {
        text-transform: uppercase;
    }

    &.cursor-pointer {
        text-decoration: none;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--accent);
            cursor: pointer;
        }
    }

    &--pulse {

        &:before, &:after {
            content: '';
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            background-color: var(--accent);
            border-radius: 50%;
            position: absolute;
            left: 0.85rem;
            top: 50%;
            transform: translateY(-50%);
        }

        padding-left: 1.85rem;
        &:before {
            animation: pulse 2s infinite;
        }
    }
}

@keyframes pulse {
    0% {
        transform: translateY(-50%) scale(1);
        opacity: 1;
    }
    50% {
        transform: translateY(-50%) scale(1.5);
        opacity: 0.5;
    }
    100% {
        transform: translateY(-50%) scale(1);
        opacity: 1;
    }
}
</style>